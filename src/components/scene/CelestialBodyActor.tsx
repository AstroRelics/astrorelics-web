import React, { MutableRefObject, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  CelestialBodyConfig,
  CelestialBodyId,
  ExperienceState,
  ViewportTier,
} from '../../types/experience';
import { LoadedCelestialAsset } from '../../utils/modelPreloader';
import {
  computeAllTransitionTransforms,
  getSlotTransform,
} from '../../utils/orbitalTransitionMath';
import { FallbackCelestialSphere } from './FallbackCelestialSphere';
import { AtmosphereHalo } from './AtmosphereHalo';
import { ExplorationDragState } from './ExplorationControls';
import { TravelRuntimeState } from './HyperspaceTransition';

interface CelestialBodyActorProps {
  config: CelestialBodyConfig;
  asset: LoadedCelestialAsset | undefined;
  selectedId: CelestialBodyId;
  highlightedId: CelestialBodyId | null;
  experienceState: ExperienceState;
  viewportTier: ViewportTier;
  reducedMotion: boolean;
  dragStateRef: MutableRefObject<ExplorationDragState>;
  travelRef: MutableRefObject<TravelRuntimeState>;
  onHighlightBody: (id: CelestialBodyId) => void;
  onInitiateTravel: (id: CelestialBodyId) => void;
}

export const CelestialBodyActor: React.FC<CelestialBodyActorProps> = ({
  config,
  asset,
  selectedId,
  highlightedId,
  experienceState,
  viewportTier,
  reducedMotion,
  dragStateRef,
  travelRef,
  onHighlightBody,
  onInitiateTravel,
}) => {
  const { viewport, gl } = useThree();
  const rootGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const [isHovered, setIsHovered] = useState(false);
  const lastClickTimeRef = useRef<number>(0);
  const idleSpinAngleRef = useRef<number>(0);

  const isSelected = selectedId === config.id;
  const isHighlighted = !isSelected && (highlightedId === config.id || isHovered);

  // Clona a cena normalizada para esta instância na árvore R3F
  const clonedModelScene = useMemo(() => {
    if (asset?.source === 'glb' && asset.normalizedGroup) {
      return asset.normalizedGroup.clone(true);
    }
    return null;
  }, [asset]);

  // Vetores pré-alocados para interpolação sem garbage collection por quadro
  const targetPosVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.05);
    const group = rootGroupRef.current;
    const spinGroup = spinGroupRef.current;
    if (!group || !spinGroup) return;

    const travel = travelRef.current;

    if (travel.isTraveling) {
      // Calcula a translação orbital 3D suave (passando pela frente e por trás no plano orbital)
      const allTransforms = computeAllTransitionTransforms(
        travel,
        viewportTier,
        viewport.aspect,
        reducedMotion
      );
      const currentTransform = allTransforms[config.id];

      group.position.x = THREE.MathUtils.damp(
        group.position.x,
        currentTransform.position[0],
        16,
        safeDelta
      );
      group.position.y = THREE.MathUtils.damp(
        group.position.y,
        currentTransform.position[1],
        16,
        safeDelta
      );
      group.position.z = THREE.MathUtils.damp(
        group.position.z,
        currentTransform.position[2],
        16,
        safeDelta
      );
      const dampedScale = THREE.MathUtils.damp(
        group.scale.x,
        currentTransform.scale,
        16,
        safeDelta
      );
      group.scale.setScalar(dampedScale);
    } else {
      // Usa o slot orbital atribuído em `travel.toSlots` como referência estável
      const assignedSlot = travel.toSlots[config.id];
      const target = getSlotTransform(
        config,
        assignedSlot,
        viewportTier,
        viewport.aspect
      );
      targetPosVec.set(target.position[0], target.position[1], target.position[2]);

      group.position.x = THREE.MathUtils.damp(group.position.x, targetPosVec.x, 7.5, safeDelta);
      group.position.y = THREE.MathUtils.damp(group.position.y, targetPosVec.y, 7.5, safeDelta);
      group.position.z = THREE.MathUtils.damp(group.position.z, targetPosVec.z, 7.5, safeDelta);

      const nextScale = THREE.MathUtils.damp(
        group.scale.x,
        target.scale * (isHighlighted ? 1.07 : 1.0),
        7.5,
        safeDelta
      );
      group.scale.setScalar(nextScale);
    }

    // Rotação axial contínua (autorrotação em torno do próprio eixo) + impulso suave durante a rotação orbital
    if (!reducedMotion && (!isSelected || !dragStateRef.current.isDragging)) {
      const transitionSpinBoost = travel.isTraveling
        ? Math.sin(travel.progress * Math.PI) * 0.65
        : 0;
      idleSpinAngleRef.current += (config.idleRotationSpeed + transitionSpinBoost) * safeDelta;
    }

    if (isSelected) {
      const targetPitch = config.initialRotation[0] + dragStateRef.current.userRotationOffset.x;
      const targetYaw =
        config.initialRotation[1] +
        dragStateRef.current.userRotationOffset.y +
        idleSpinAngleRef.current;

      spinGroup.rotation.x = THREE.MathUtils.damp(spinGroup.rotation.x, targetPitch, 12, safeDelta);
      spinGroup.rotation.y = THREE.MathUtils.damp(spinGroup.rotation.y, targetYaw, 12, safeDelta);
      spinGroup.rotation.z = THREE.MathUtils.damp(
        spinGroup.rotation.z,
        config.initialRotation[2],
        8,
        safeDelta
      );
    } else {
      // Corpos ao fundo mantêm rotação suave e orientação natural
      spinGroup.rotation.x = THREE.MathUtils.damp(
        spinGroup.rotation.x,
        config.initialRotation[0],
        5,
        safeDelta
      );
      spinGroup.rotation.y = config.initialRotation[1] + idleSpinAngleRef.current;
      spinGroup.rotation.z = config.initialRotation[2];
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += safeDelta * 0.35;
    }
  });

  const isRecentDrag = () => {
    return (
      dragStateRef.current.isDragging ||
      performance.now() - dragStateRef.current.lastDragEndTime < 150
    );
  };

  const handleBackgroundClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (experienceState !== 'exploring' || isSelected) return;
    if (isRecentDrag()) return;

    const now = performance.now();
    const deltaClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    // Se dois cliques ocorrerem em até 380ms no mesmo corpo ao fundo, inicia a viagem
    if (deltaClick > 20 && deltaClick < 380) {
      onInitiateTravel(config.id);
      return;
    }

    // Clique simples: destaca o nome e indica a possibilidade de viajar
    onHighlightBody(config.id);
  };

  const handleBackgroundDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (experienceState !== 'exploring' || isSelected) return;
    if (isRecentDrag()) return;

    onInitiateTravel(config.id);
  };

  return (
    <group ref={rootGroupRef} name={`celestial-actor-${config.id}`}>
      {/* Esfera de colisão generosa para facilitar seleção e clique duplo nos corpos menores ao fundo */}
      <mesh
        scale={isSelected ? 1.01 : 1.42}
        onClick={handleBackgroundClick}
        onDoubleClick={handleBackgroundDoubleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (experienceState !== 'exploring' || isSelected) return;
          setIsHovered(true);
          gl.domElement.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          if (!dragStateRef.current.isDragging) {
            gl.domElement.style.cursor = experienceState === 'exploring' ? 'grab' : 'default';
          }
        }}
      >
        <sphereGeometry args={[1.0, 24, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Grupo com inclinação axial e rotação interativa do corpo celeste */}
      <group rotation={[0, 0, config.axialTilt * 0.25]}>
        <group ref={spinGroupRef}>
          {clonedModelScene ? (
            <primitive object={clonedModelScene} />
          ) : (
            <FallbackCelestialSphere config={config} />
          )}
        </group>
      </group>

      {/* Halo atmosférico discreto para Terra e Marte (desativado para a Lua) */}
      <AtmosphereHalo atmosphere={config.atmosphere} />

      {/* Anel orbital sutil de marcação quando o corpo está ao fundo e destacado */}
      {!isSelected && experienceState === 'exploring' && (
        <mesh ref={ringRef} scale={isHighlighted ? 1.28 : 1.18} raycast={() => null}>
          <ringGeometry args={[0.98, 1.015, 48]} />
          <meshBasicMaterial
            color={isHighlighted ? '#38BDF8' : '#64748B'}
            transparent
            opacity={isHighlighted ? 0.72 : 0.22}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Marcador espacial dos corpos ao fundo: destaca o nome com clique simples e inicia viagem com clique duplo */}
      {!isSelected && experienceState === 'exploring' && (
        <Html
          position={[0, -1.32, 0]}
          center
          zIndexRange={[10, 0]}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (experienceState !== 'exploring') return;
              const now = performance.now();
              if (now - lastClickTimeRef.current < 380) {
                onInitiateTravel(config.id);
              } else {
                onHighlightBody(config.id);
              }
              lastClickTimeRef.current = now;
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (experienceState !== 'exploring') return;
              onInitiateTravel(config.id);
            }}
            className={`group flex flex-col items-center cursor-pointer transition-all duration-200 ${
              isHighlighted ? 'scale-105' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div
              className={`px-2.5 py-1 rounded-full backdrop-blur-md border transition-colors flex items-center gap-1.5 ${
                isHighlighted
                  ? 'bg-[#08152C]/90 border-sky-400/80 text-white shadow-[0_0_20px_rgba(56,189,248,0.28)]'
                  : 'bg-[#040915]/75 border-slate-700/60 text-slate-200 hover:border-sky-400/50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isHighlighted ? 'bg-sky-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-display font-semibold tracking-wide whitespace-nowrap">
                {config.name}
              </span>
            </div>

            {isHighlighted && (
              <div className="mt-1.5 px-2.5 py-1 rounded-md bg-[#061022]/95 border border-sky-400/40 text-[11px] text-sky-300 font-medium whitespace-nowrap shadow-lg animate-fadeIn">
                Clique 2x para viajar
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
