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

function getTargetTransform(
  config: CelestialBodyConfig,
  activeId: CelestialBodyId,
  viewportTier: ViewportTier,
  aspect: number
): { position: [number, number, number]; scale: number } {
  if (config.id === activeId) {
    const pos = config.foregroundPosition[viewportTier];
    const mobileScaleFactor = viewportTier === 'mobile' ? 0.62 : viewportTier === 'tablet' ? 0.88 : 1.0;
    return {
      position: pos,
      scale: config.foregroundRadius * mobileScaleFactor,
    };
  }

  const slotMap = config.backgroundWhenSelectedIs[activeId];
  const rawPos = slotMap ? slotMap[viewportTier] : ([-3.5, 1.2, -5.0] as [number, number, number]);

  // Garante que em qualquer proporção de tela o corpo ao fundo permaneça dentro da área visível
  const cameraZ = 8.2;
  const distFromCam = cameraZ - rawPos[2];
  const halfHeight = distFromCam * Math.tan(THREE.MathUtils.degToRad(21));
  const halfWidth = halfHeight * aspect;
  const safeMaxX = Math.max(1.25, halfWidth - 0.68);

  const clampedX = THREE.MathUtils.clamp(rawPos[0], -safeMaxX, safeMaxX);
  const bgScaleFactor = viewportTier === 'mobile' ? 0.66 : viewportTier === 'tablet' ? 0.88 : 1.0;

  return {
    position: [clampedX, rawPos[1], rawPos[2]],
    scale: config.backgroundRadius * bgScaleFactor,
  };
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
      // Calcula interpolação cinematográfica entre estado de origem (fromId) e destino (toId)
      const fromTransform = getTargetTransform(
        config,
        travel.fromId,
        viewportTier,
        viewport.aspect
      );
      const toTransform = getTargetTransform(
        config,
        travel.toId,
        viewportTier,
        viewport.aspect
      );

      // Curva suave em S (smoothstep cúbico)
      const p = travel.progress;
      const smoothT = p * p * (3 - 2 * p);

      let tx = THREE.MathUtils.lerp(fromTransform.position[0], toTransform.position[0], smoothT);
      let ty = THREE.MathUtils.lerp(fromTransform.position[1], toTransform.position[1], smoothT);
      let tz = THREE.MathUtils.lerp(fromTransform.position[2], toTransform.position[2], smoothT);
      let tScale = THREE.MathUtils.lerp(fromTransform.scale, toTransform.scale, smoothT);

      if (!reducedMotion) {
        // Efeito de profundidade durante a fase de viagem em hiperespaço
        const warpArch = Math.sin(p * Math.PI);
        if (config.id === travel.fromId) {
          // O corpo que deixamos para trás recua rapidamente em Z
          tz -= warpArch * 3.2;
        } else if (config.id === travel.toId) {
          // O novo destino emerge do espaço profundo e desacelera suavemente em primeiro plano
          const arrivalCurve = Math.pow(p, 1.65);
          tx = THREE.MathUtils.lerp(fromTransform.position[0] * 0.65, toTransform.position[0], arrivalCurve);
          ty = THREE.MathUtils.lerp(fromTransform.position[1] * 0.65, toTransform.position[1], arrivalCurve);
          tz = THREE.MathUtils.lerp(fromTransform.position[2] - 4.5, toTransform.position[2], arrivalCurve);
          tScale = THREE.MathUtils.lerp(fromTransform.scale * 0.75, toTransform.scale, arrivalCurve);
        } else {
          tz -= warpArch * 1.6;
        }
      }

      group.position.set(tx, ty, tz);
      group.scale.setScalar(tScale);
    } else {
      // Estado de exploração: amortecimento suave para posição e escala responsivas
      const target = getTargetTransform(config, selectedId, viewportTier, viewport.aspect);
      targetPosVec.set(target.position[0], target.position[1], target.position[2]);

      group.position.x = THREE.MathUtils.damp(group.position.x, targetPosVec.x, 6.5, safeDelta);
      group.position.y = THREE.MathUtils.damp(group.position.y, targetPosVec.y, 6.5, safeDelta);
      group.position.z = THREE.MathUtils.damp(group.position.z, targetPosVec.z, 6.5, safeDelta);

      const nextScale = THREE.MathUtils.damp(
        group.scale.x,
        target.scale * (isHighlighted ? 1.07 : 1.0),
        7.0,
        safeDelta
      );
      group.scale.setScalar(nextScale);
    }

    // Rotação contínua sutil quando não está sendo arrastado
    if (!reducedMotion && (!isSelected || !dragStateRef.current.isDragging)) {
      idleSpinAngleRef.current += config.idleRotationSpeed * safeDelta;
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
