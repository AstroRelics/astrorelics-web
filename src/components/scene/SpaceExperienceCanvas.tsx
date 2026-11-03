import React, { MutableRefObject, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { CELESTIAL_BODIES, CELESTIAL_BODY_ORDER } from '../../config/celestialBodies';
import {
  CelestialBodyId,
  ExperienceState,
  TravelPhase,
  ViewportTier,
} from '../../types/experience';
import { LoadedCelestialAsset } from '../../utils/modelPreloader';
import { SpaceLighting } from './SpaceLighting';
import { StarfieldAndNebula } from './StarfieldAndNebula';
import { HyperspaceTransition, TravelRuntimeState } from './HyperspaceTransition';
import { ExplorationControls, ExplorationDragState } from './ExplorationControls';
import { CelestialBodyActor } from './CelestialBodyActor';

interface SpaceExperienceCanvasProps {
  selectedId: CelestialBodyId;
  highlightedId: CelestialBodyId | null;
  experienceState: ExperienceState;
  viewportTier: ViewportTier;
  reducedMotion: boolean;
  loadedAssets: Partial<Record<CelestialBodyId, LoadedCelestialAsset>>;
  dragStateRef: MutableRefObject<ExplorationDragState>;
  parallaxOffsetRef: MutableRefObject<THREE.Vector2>;
  travelRef: MutableRefObject<TravelRuntimeState>;
  onHighlightBody: (id: CelestialBodyId | null) => void;
  onInitiateTravel: (id: CelestialBodyId) => void;
  onTravelPhaseChange: (phase: TravelPhase) => void;
  onTravelComplete: (destinationId: CelestialBodyId) => void;
  onUserInteractionStart?: () => void;
}

export const SpaceExperienceCanvas: React.FC<SpaceExperienceCanvasProps> = ({
  selectedId,
  highlightedId,
  experienceState,
  viewportTier,
  reducedMotion,
  loadedAssets,
  dragStateRef,
  parallaxOffsetRef,
  travelRef,
  onHighlightBody,
  onInitiateTravel,
  onTravelPhaseChange,
  onTravelComplete,
  onUserInteractionStart,
}) => {
  // Adapta a densidade de estrelas, rastros e resolução (DPR) à capacidade do dispositivo
  const perfSettings = useMemo(() => {
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const isLowPower = viewportTier === 'mobile' || cores <= 4;

    return {
      dpr: (isLowPower ? [1, 1.5] : [1, 2]) as [number, number],
      starCount: viewportTier === 'mobile' ? 1350 : viewportTier === 'tablet' ? 1900 : 2650,
      streakCount: viewportTier === 'mobile' ? 160 : 280,
    };
  }, [viewportTier]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#02040A] select-none">
      <Canvas
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

        {/* Animação de viagem em hiperespaço em 3 fases (Aceleração, Viagem, Chegada) */}
        <HyperspaceTransition
          travelRef={travelRef}
          reducedMotion={reducedMotion}
          streakCount={perfSettings.streakCount}
          onPhaseChange={onTravelPhaseChange}
          onTravelComplete={onTravelComplete}
        />

        {/* Os três corpos celestes (Terra, Lua e Marte) exibidos simultaneamente */}
        {CELESTIAL_BODY_ORDER.map((id) => (
          <CelestialBodyActor
            key={id}
            config={CELESTIAL_BODIES[id]}
            asset={loadedAssets[id]}
            selectedId={selectedId}
            highlightedId={highlightedId}
            experienceState={experienceState}
            viewportTier={viewportTier}
            reducedMotion={reducedMotion}
            dragStateRef={dragStateRef}
            travelRef={travelRef}
            onHighlightBody={(targetId) => onHighlightBody(targetId)}
            onInitiateTravel={onInitiateTravel}
          />
        ))}

        {/* Controles de rotação por arraste ao redor do corpo selecionado (sem zoom manual) */}
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
