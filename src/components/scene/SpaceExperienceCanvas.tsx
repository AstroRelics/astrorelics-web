import React, { MutableRefObject, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { CELESTIAL_BODIES, CELESTIAL_BODY_ORDER } from '../../config/celestialBodies';
import {
  CelestialBodyId,
  ExperienceState,
  SpaceArtifactId,
  TravelPhase,
  ViewportTier,
} from '../../types/experience';
import { EchoesHotspot3D } from '../../types/echoesMission';
import { LoadedCelestialAsset } from '../../utils/modelPreloader';
import { SpaceLighting } from './SpaceLighting';
import { StarfieldAndNebula } from './StarfieldAndNebula';
import { HyperspaceTransition, TravelRuntimeState } from './HyperspaceTransition';
import { ExplorationControls, ExplorationDragState } from './ExplorationControls';
import { CelestialBodyActor } from './CelestialBodyActor';
import {
  ArtifactShowcaseActor,
  DeepSpaceDriftingPins,
} from './ArtifactSceneActors';

interface SpaceExperienceCanvasProps {
  selectedId: CelestialBodyId;
  highlightedId: CelestialBodyId | null;
  activeArtifactId: SpaceArtifactId | null;
  experienceState: ExperienceState;
  viewportTier: ViewportTier;
  reducedMotion: boolean;
  loadedAssets: Partial<Record<CelestialBodyId, LoadedCelestialAsset>>;
  dragStateRef: MutableRefObject<ExplorationDragState>;
  parallaxOffsetRef: MutableRefObject<THREE.Vector2>;
  travelRef: MutableRefObject<TravelRuntimeState>;
  onHighlightBody: (id: CelestialBodyId | null) => void;
  onInitiateTravel: (id: CelestialBodyId) => void;
  onSelectArtifact: (id: SpaceArtifactId) => void;
  onTravelPhaseChange: (phase: TravelPhase) => void;
  onTravelComplete: (
    destinationId: CelestialBodyId,
    targetArtifactId?: SpaceArtifactId | null
  ) => void;
  onUserInteractionStart?: () => void;
  activeHotspots?: EchoesHotspot3D[];
  discoveredHotspotIds?: string[];
  selectedHotspotId?: string | null;
  revealCluesList?: boolean;
  onSelectHotspot?: (hotspot: EchoesHotspot3D) => void;
}

export const SpaceExperienceCanvas: React.FC<SpaceExperienceCanvasProps> = ({
  selectedId,
  highlightedId,
  activeArtifactId,
  experienceState,
  viewportTier,
  reducedMotion,
  loadedAssets,
  dragStateRef,
  parallaxOffsetRef,
  travelRef,
  onHighlightBody,
  onInitiateTravel,
  onSelectArtifact,
  onTravelPhaseChange,
  onTravelComplete,
  onUserInteractionStart,
  activeHotspots,
  discoveredHotspotIds,
  selectedHotspotId,
  revealCluesList,
  onSelectHotspot,
}) => {
  const perfSettings = useMemo(() => {
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const isLowPower = viewportTier === 'mobile' || cores <= 4;

    return {
      dpr: (isLowPower ? [1, 1.5] : [1, 2]) as [number, number],
      starCount: viewportTier === 'mobile' ? 1400 : viewportTier === 'tablet' ? 2000 : 2800,
      streakCount: viewportTier === 'mobile' ? 280 : 540,
    };
  }, [viewportTier]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#02040A] select-none">
      <Canvas
        shadows="soft"
        dpr={perfSettings.dpr}
        camera={{ position: [0, 0, 8.2], fov: 42, near: 0.1, far: 160 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        onPointerMissed={() => {
          if (experienceState === 'exploring' && highlightedId) {
            onHighlightBody(null);
          }
        }}
      >
        <color attach="background" args={['#02040A']} />

        {/* Iluminação espacial coerente com o Sol distante */}
        <SpaceLighting />

        {/* Fundo espacial profundo com estrelas variadas e nebulosas discretas */}
        <StarfieldAndNebula
          starCount={perfSettings.starCount}
          travelRef={travelRef}
          parallaxOffsetRef={parallaxOffsetRef}
        />

        {/* Animação de viagem na velocidade da luz (Star Wars Hyperdrive) */}
        <HyperspaceTransition
          travelRef={travelRef}
          reducedMotion={reducedMotion}
          streakCount={perfSettings.streakCount}
          onPhaseChange={onTravelPhaseChange}
          onTravelComplete={onTravelComplete}
        />

        {/* Os três corpos celestes (Terra, Lua e Marte) com os Pins de superfície */}
        {CELESTIAL_BODY_ORDER.map((id) => (
          <CelestialBodyActor
            key={id}
            config={CELESTIAL_BODIES[id]}
            asset={loadedAssets[id]}
            selectedId={selectedId}
            highlightedId={highlightedId}
            activeArtifactId={activeArtifactId}
            experienceState={experienceState}
            viewportTier={viewportTier}
            reducedMotion={reducedMotion}
            dragStateRef={dragStateRef}
            travelRef={travelRef}
            onHighlightBody={(targetId) => onHighlightBody(targetId)}
            onInitiateTravel={onInitiateTravel}
            onSelectArtifact={onSelectArtifact}
          />
        ))}

        {/* Pins dos objetos "meio à deriva no espaço" entre Terra, Lua e Marte (J002E3 e Snoopy) */}
        <DeepSpaceDriftingPins
          activeArtifactId={activeArtifactId}
          experienceState={experienceState}
          viewportTier={viewportTier}
          onSelectArtifact={onSelectArtifact}
        />

        {/* Visualizador 3D interativo em 360° do artefato selecionado após o salto na velocidade da luz */}
        <ArtifactShowcaseActor
          activeArtifactId={activeArtifactId}
          experienceState={experienceState}
          viewportTier={viewportTier}
          reducedMotion={reducedMotion}
          dragStateRef={dragStateRef}
          travelRef={travelRef}
          activeHotspots={activeHotspots}
          discoveredHotspotIds={discoveredHotspotIds}
          selectedHotspotId={selectedHotspotId}
          revealCluesList={revealCluesList}
          onSelectHotspot={onSelectHotspot}
        />

        {/* Controles de rotação por arraste ao redor do corpo ou objeto 3D selecionado */}
        <ExplorationControls
          experienceState={experienceState}
          dragStateRef={dragStateRef}
          parallaxOffsetRef={parallaxOffsetRef}
          onUserInteractionStart={onUserInteractionStart}
        />
      </Canvas>
    </div>
  );
};
