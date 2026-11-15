import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SPACE_ARTIFACTS } from './config/spaceArtifacts';
import {
  CelestialBodyId,
  ExperienceState,
  SpaceArtifactId,
  TravelPhase,
  ViewportTier,
} from './types/experience';
import {
  LoadedCelestialAsset,
  loadSpaceArtifactModel,
  preloadAllCelestialModels,
} from './utils/modelPreloader';
import {
  computeRotatedSlotAssignments,
  INITIAL_SLOT_ASSIGNMENTS,
} from './utils/orbitalTransitionMath';
import { soundEffects } from './utils/soundEffects';
import { SpaceExperienceCanvas } from './components/scene/SpaceExperienceCanvas';
import { ExplorationDragState } from './components/scene/ExplorationControls';
import { TravelRuntimeState } from './components/scene/HyperspaceTransition';
import { HeaderHud } from './components/ui/HeaderHud';
import { DestinationInfoPanel } from './components/ui/DestinationInfoPanel';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WebGLFallbackScreen } from './components/ui/WebGLFallbackScreen';

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function getViewportTier(width: number): ViewportTier {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export const App: React.FC = () => {
  const [webglSupported] = useState<boolean>(() => checkWebGLSupport());

  const [experienceState, setExperienceState] = useState<ExperienceState>('loading');
  const [selectedId, setSelectedId] = useState<CelestialBodyId>('earth');
  const [highlightedId, setHighlightedId] = useState<CelestialBodyId | null>(null);
  const [targetTravelId, setTargetTravelId] = useState<CelestialBodyId | null>(null);
  const [travelPhase, setTravelPhase] = useState<TravelPhase>('idle');
  const [activeArtifactId, setActiveArtifactId] = useState<SpaceArtifactId | null>(null);

  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadStatusLabel, setLoadStatusLabel] = useState<string>('Inicializando telemetria...');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedAssets, setLoadedAssets] = useState<
    Partial<Record<CelestialBodyId, LoadedCelestialAsset>>
  >({});

  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  const [viewportTier, setViewportTier] = useState<ViewportTier>(() =>
    typeof window !== 'undefined' ? getViewportTier(window.innerWidth) : 'desktop'
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const dragStateRef = useRef<ExplorationDragState>({
    userRotationOffset: new THREE.Vector2(0, 0),
    targetRotationOffset: new THREE.Vector2(0, 0),
    isDragging: false,
    lastDragEndTime: 0,
  });

  const parallaxOffsetRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  const travelRef = useRef<TravelRuntimeState>({
    isTraveling: false,
    elapsed: 0,
    duration: 1.55,
    progress: 0,
    warpIntensity: 0,
    phase: 'idle',
    fromId: 'earth',
    toId: 'earth',
    fromSlots: { ...INITIAL_SLOT_ASSIGNMENTS },
    toSlots: { ...INITIAL_SLOT_ASSIGNMENTS },
    targetArtifactId: null,
    isArtifactJump: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportTier(getViewportTier(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const runPreload = useCallback(async (force = false) => {
    setExperienceState('loading');
    setLoadProgress(0);
    setLoadError(null);

    try {
      const assets = await preloadAllCelestialModels((state) => {
        setLoadProgress(state.progress);
        setLoadStatusLabel(state.currentLabel);
        setLoadedAssets(state.assets);
      }, force);

      setLoadedAssets(assets);
      setLoadProgress(100);
      setLoadStatusLabel('Telemetria visual pronta');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os modelos 3D dos corpos celestes.';
      setLoadError(msg);
      setExperienceState('error');
    }
  }, []);

  useEffect(() => {
    if (webglSupported) {
      runPreload(false);
    }
  }, [webglSupported, runPreload]);

  const handleContinueWithProvisional = useCallback(() => {
    setLoadedAssets({
      earth: { id: 'earth', source: 'provisional-sphere', resolvedPath: null, normalizedGroup: null },
      moon: { id: 'moon', source: 'provisional-sphere', resolvedPath: null, normalizedGroup: null },
      mars: { id: 'mars', source: 'provisional-sphere', resolvedPath: null, normalizedGroup: null },
    });
    setLoadError(null);
    setExperienceState('exploring');
  }, []);

  const handleHighlightBody = useCallback((id: CelestialBodyId | null) => {
    setHighlightedId((prev) => {
      if (id && id !== prev) {
        soundEffects.playHighlightPing();
      }
      return id;
    });
  }, []);

  const handleResetOrientation = useCallback(() => {
    if (experienceState !== 'exploring') return;
    dragStateRef.current.targetRotationOffset.set(0, 0);
    parallaxOffsetRef.current.set(0, 0);
    soundEffects.playResetTone();
  }, [experienceState]);

  // Inicia viagem espacial para outro corpo celeste (ou retorna de um artefato 3D para o planeta)
  const handleInitiateTravel = useCallback(
    (destinationId: CelestialBodyId) => {
      if (experienceState !== 'exploring' || travelRef.current.isTraveling) {
        return;
      }

      // Se já estamos nesse planeta e apenas fechando um artefato 3D, retorna imediatamente com suavidade
      if (destinationId === selectedId && activeArtifactId !== null) {
        dragStateRef.current.targetRotationOffset.set(0, 0);
        dragStateRef.current.userRotationOffset.set(0, 0);
        parallaxOffsetRef.current.set(0, 0);
        setActiveArtifactId(null);
        soundEffects.playResetTone();
        return;
      }

      if (destinationId === selectedId && activeArtifactId === null) {
        return;
      }

      const duration = reducedMotion ? 0.65 : 1.35;

      dragStateRef.current.targetRotationOffset.set(0, 0);
      dragStateRef.current.userRotationOffset.set(0, 0);
      parallaxOffsetRef.current.set(0, 0);

      const currentSlots = { ...travelRef.current.toSlots };
      const { nextSlots } = computeRotatedSlotAssignments(currentSlots, destinationId);

      travelRef.current = {
        isTraveling: true,
        elapsed: 0,
        duration,
        progress: 0,
        warpIntensity: 0,
        phase: 'acceleration',
        fromId: selectedId,
        toId: destinationId,
        fromSlots: currentSlots,
        toSlots: nextSlots,
        targetArtifactId: null,
        isArtifactJump: false,
      };

      setActiveArtifactId(null);
      setHighlightedId(null);
      setTargetTravelId(destinationId);
      setTravelPhase('acceleration');
      setExperienceState('traveling');

      if (!reducedMotion) {
        soundEffects.playHyperspaceTravel(duration);
      } else {
        soundEffects.playHighlightPing();
      }
    },
    [experienceState, selectedId, activeArtifactId, reducedMotion]
  );

  // Inicia salto na velocidade da luz estilo Star Wars rumo ao objeto 3D selecionado
  const handleSelectArtifact = useCallback(
    (artifactId: SpaceArtifactId) => {
      if (
        experienceState !== 'exploring' ||
        travelRef.current.isTraveling ||
        activeArtifactId === artifactId
      ) {
        return;
      }

      // Garante que o modelo 3D esteja carregando/em cache imediatamente
      void loadSpaceArtifactModel(artifactId);

      const artifact = SPACE_ARTIFACTS[artifactId];
      const destinationBodyId = artifact.relatedBodyId;
      const duration = reducedMotion ? 0.55 : 0.85;

      dragStateRef.current.targetRotationOffset.set(0, 0);
      dragStateRef.current.userRotationOffset.set(0, 0);
      parallaxOffsetRef.current.set(0, 0);

      const currentSlots = { ...travelRef.current.toSlots };
      const { nextSlots } = computeRotatedSlotAssignments(currentSlots, destinationBodyId);

      travelRef.current = {
        isTraveling: true,
        elapsed: 0,
        duration,
        progress: 0,
        warpIntensity: 0,
        phase: 'acceleration',
        fromId: selectedId,
        toId: destinationBodyId,
        fromSlots: currentSlots,
        toSlots: nextSlots,
        targetArtifactId: artifactId,
        isArtifactJump: true,
      };

      setHighlightedId(null);
      setTargetTravelId(destinationBodyId);
      setTravelPhase('acceleration');
      setExperienceState('traveling');

      if (!reducedMotion) {
        soundEffects.playHyperspaceTravel(duration);
      } else {
        soundEffects.playHighlightPing();
      }
    },
    [experienceState, selectedId, activeArtifactId, reducedMotion]
  );

  const handleCloseArtifact = useCallback(() => {
    if (experienceState !== 'exploring') return;
    dragStateRef.current.targetRotationOffset.set(0, 0);
    dragStateRef.current.userRotationOffset.set(0, 0);
    parallaxOffsetRef.current.set(0, 0);
    setActiveArtifactId(null);
    soundEffects.playResetTone();
  }, [experienceState]);

  const handleTravelComplete = useCallback(
    (destinationId: CelestialBodyId, targetArtifactId?: SpaceArtifactId | null) => {
      setSelectedId(destinationId);
      setActiveArtifactId(targetArtifactId ?? null);
      setTargetTravelId(null);
      setTravelPhase('idle');
      setExperienceState('exploring');
    },
    []
  );

  const handleToggleAudio = useCallback(() => {
    const next = soundEffects.setEnabled(!audioEnabled);
    setAudioEnabled(next);
  }, [audioEnabled]);

  if (!webglSupported) {
    return <WebGLFallbackScreen />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#02040A]">
      {(experienceState === 'loading' || experienceState === 'error') && (
        <LoadingScreen
          progress={loadProgress}
          statusLabel={loadStatusLabel}
          errorMessage={loadError}
          onRetry={() => runPreload(true)}
          onContinueWithFallback={handleContinueWithProvisional}
          onFinishTransition={() => setExperienceState('exploring')}
        />
      )}

      <SpaceExperienceCanvas
        selectedId={selectedId}
        highlightedId={highlightedId}
        activeArtifactId={activeArtifactId}
        experienceState={experienceState}
        viewportTier={viewportTier}
        reducedMotion={reducedMotion}
        loadedAssets={loadedAssets}
        dragStateRef={dragStateRef}
        parallaxOffsetRef={parallaxOffsetRef}
        travelRef={travelRef}
        onHighlightBody={handleHighlightBody}
        onInitiateTravel={handleInitiateTravel}
        onSelectArtifact={handleSelectArtifact}
        onTravelPhaseChange={setTravelPhase}
        onTravelComplete={handleTravelComplete}
      />

      <HeaderHud
        selectedId={selectedId}
        targetTravelId={targetTravelId}
        experienceState={experienceState}
        travelPhase={travelPhase}
        audioEnabled={audioEnabled}
        reducedMotion={reducedMotion}
        onSelectDestination={handleInitiateTravel}
        onToggleAudio={handleToggleAudio}
      />

      <DestinationInfoPanel
        selectedId={selectedId}
        highlightedId={highlightedId}
        activeArtifactId={activeArtifactId}
        experienceState={experienceState}
        loadedAsset={loadedAssets[selectedId]}
        onResetOrientation={handleResetOrientation}
        onTravelToHighlighted={handleInitiateTravel}
        onSelectArtifact={handleSelectArtifact}
        onCloseArtifact={handleCloseArtifact}
      />
    </div>
  );
};

export default App;
