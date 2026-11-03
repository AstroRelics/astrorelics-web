import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  CelestialBodyId,
  ExperienceState,
  TravelPhase,
  ViewportTier,
} from './types/experience';
import {
  LoadedCelestialAsset,
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

  // Estados principais da experiência: carregamento, exploração, viagem e erro
  const [experienceState, setExperienceState] = useState<ExperienceState>('loading');
  const [selectedId, setSelectedId] = useState<CelestialBodyId>('earth'); // Inicia com a Terra selecionada
  const [highlightedId, setHighlightedId] = useState<CelestialBodyId | null>(null);
  const [targetTravelId, setTargetTravelId] = useState<CelestialBodyId | null>(null);
  const [travelPhase, setTravelPhase] = useState<TravelPhase>('idle');

  // Progresso de pré-carregamento dos modelos 3D
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadStatusLabel, setLoadStatusLabel] = useState<string>('Inicializando telemetria...');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedAssets, setLoadedAssets] = useState<
    Partial<Record<CelestialBodyId, LoadedCelestialAsset>>
  >({});

  // Áudio inicia estritamente desativado
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  // Responsividade e preferência de movimento reduzido do sistema
  const [viewportTier, setViewportTier] = useState<ViewportTier>(() =>
    typeof window !== 'undefined' ? getViewportTier(window.innerWidth) : 'desktop'
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Refs mutáveis para animação 60fps sem re-renderizar a interface React a cada quadro
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
    duration: 2.85,
    progress: 0,
    warpIntensity: 0,
    phase: 'idle',
    fromId: 'earth',
    toId: 'earth',
    fromSlots: { ...INITIAL_SLOT_ASSIGNMENTS },
    toSlots: { ...INITIAL_SLOT_ASSIGNMENTS },
  });

  // Monitora redimensionamento e preferência de movimento reduzido do sistema
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

  // Executa o pré-carregamento dos modelos 3D antes de liberar a exploração
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

  // Caso ocorra erro de rede/arquivo e o usuário opte por continuar com esferas provisórias
  const handleContinueWithProvisional = useCallback(() => {
    setLoadedAssets({
      earth: { id: 'earth', source: 'provisional-sphere', resolvedPath: null, normalizedGroup: null },
      moon: { id: 'moon', source: 'provisional-sphere', resolvedPath: null, normalizedGroup: null },
      mars: { id: 'mars', source: 'provisional-sphere', resolvedPath: null, normalizedGroup: null },
    });
    setLoadError(null);
    setExperienceState('exploring');
  }, []);

  // Destaca um corpo ao fundo (clique simples)
  const handleHighlightBody = useCallback((id: CelestialBodyId | null) => {
    setHighlightedId((prev) => {
      if (id && id !== prev) {
        soundEffects.playHighlightPing();
      }
      return id;
    });
  }, []);

  // Restaura a orientação inicial da visualização do corpo selecionado
  const handleResetOrientation = useCallback(() => {
    if (experienceState !== 'exploring') return;
    dragStateRef.current.targetRotationOffset.set(0, 0);
    parallaxOffsetRef.current.set(0, 0);
    soundEffects.playResetTone();
  }, [experienceState]);

  // Inicia a viagem espacial para outro corpo celeste (via clique duplo ao fundo ou seletor)
  const handleInitiateTravel = useCallback(
    (destinationId: CelestialBodyId) => {
      // Bloqueia novas trocas enquanto uma viagem já estiver acontecendo ou se já for o corpo atual
      if (
        experienceState !== 'exploring' ||
        travelRef.current.isTraveling ||
        destinationId === selectedId
      ) {
        return;
      }

      const duration = reducedMotion ? 1.25 : 2.85;

      // Reinicia suavemente a orientação acumulada para apresentar a face principal do novo destino
      dragStateRef.current.targetRotationOffset.set(0, 0);
      dragStateRef.current.userRotationOffset.set(0, 0);
      parallaxOffsetRef.current.set(0, 0);

      // Gira os 3 astros em conjunto em 120° ao longo do anel orbital 3D
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
      };

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
    [experienceState, selectedId, reducedMotion]
  );

  // Conclui a viagem e restaura os controles de exploração
  const handleTravelComplete = useCallback((destinationId: CelestialBodyId) => {
    setSelectedId(destinationId);
    setTargetTravelId(null);
    setTravelPhase('idle');
    setExperienceState('exploring');
  }, []);

  // Alterna ativação de efeitos sonoros
  const handleToggleAudio = useCallback(() => {
    const next = soundEffects.setEnabled(!audioEnabled);
    setAudioEnabled(next);
  }, [audioEnabled]);

  if (!webglSupported) {
    return <WebGLFallbackScreen />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#02040A]">
      {/* Tela de carregamento com indicação de progresso e tratamento de erro */}
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

      {/* Cena 3D ocupando toda a tela */}
      <SpaceExperienceCanvas
        selectedId={selectedId}
        highlightedId={highlightedId}
        experienceState={experienceState}
        viewportTier={viewportTier}
        reducedMotion={reducedMotion}
        loadedAssets={loadedAssets}
        dragStateRef={dragStateRef}
        parallaxOffsetRef={parallaxOffsetRef}
        travelRef={travelRef}
        onHighlightBody={handleHighlightBody}
        onInitiateTravel={handleInitiateTravel}
        onTravelPhaseChange={setTravelPhase}
        onTravelComplete={handleTravelComplete}
      />

      {/* Cabeçalho minimalista: Nome do projeto, Seletor (Terra, Lua, Marte) e Controle de Áudio */}
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

      {/* Painel discreto do corpo selecionado, botão de restaurar orientação e instrução */}
      <DestinationInfoPanel
        selectedId={selectedId}
        highlightedId={highlightedId}
        experienceState={experienceState}
        loadedAsset={loadedAssets[selectedId]}
        onResetOrientation={handleResetOrientation}
        onTravelToHighlighted={handleInitiateTravel}
      />
    </div>
  );
};

export default App;
