import React, { MutableRefObject, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { CelestialBodyId, TravelPhase } from '../../types/experience';

export interface TravelRuntimeState {
  isTraveling: boolean;
  elapsed: number;
  duration: number;
  progress: number;
  warpIntensity: number;
  phase: TravelPhase;
  fromId: CelestialBodyId;
  toId: CelestialBodyId;
}

interface HyperspaceTransitionProps {
  travelRef: MutableRefObject<TravelRuntimeState>;
  reducedMotion: boolean;
  streakCount?: number;
  onPhaseChange: (phase: TravelPhase) => void;
  onTravelComplete: (destinationId: CelestialBodyId) => void;
}

interface StreakParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  thickness: number;
  lengthFactor: number;
}

export const HyperspaceTransition: React.FC<HyperspaceTransitionProps> = ({
  travelRef,
  reducedMotion,
  streakCount = 260,
  onPhaseChange,
  onTravelComplete,
}) => {
  const { camera } = useThree();
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const lastPhaseRef = useRef<TravelPhase>('idle');

  // Objeto auxiliar único pré-alocado para evitar qualquer alocação de memória por quadro
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { particles, material } = useMemo(() => {
    const list: StreakParticle[] = [];
    let seed = 9876543;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < streakCount; i++) {
      // Túnel cilíndrico deixando o centro livre para não atravessar diretamente o planeta
      const angle = rand() * Math.PI * 2;
      const radius = 2.35 + Math.pow(rand(), 0.78) * 11.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.78;
      const z = -55 + rand() * 62;
      const speed = 36 + rand() * 38;
      const thickness = 0.011 + rand() * 0.018;
      const lengthFactor = 0.65 + rand() * 0.85;

      list.push({ x, y, z, speed, thickness, lengthFactor });
    }

    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#BAE6FD'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { particles: list, material: mat };
  }, [streakCount]);

  // Inicializa cores variadas (branco, azul-gelo e ciano) uma única vez nas instâncias
  React.useLayoutEffect(() => {
    const mesh = instancedRef.current;
    if (!mesh) return;

    const palette = [
      new THREE.Color('#F8FAFC'),
      new THREE.Color('#E0F2FE'),
      new THREE.Color('#7DD3FC'),
      new THREE.Color('#38BDF8'),
      new THREE.Color('#1D4ED8'),
    ];

    for (let i = 0; i < streakCount; i++) {
      mesh.setColorAt(i, palette[i % palette.length]);
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [streakCount]);

  useFrame((_, delta) => {
    const state = travelRef.current;
    const perspCam = camera as THREE.PerspectiveCamera;

    if (!state.isTraveling) {
      if (lastPhaseRef.current !== 'idle') {
        lastPhaseRef.current = 'idle';
      }
      state.warpIntensity = THREE.MathUtils.damp(state.warpIntensity, 0, 10, delta);
      if (Math.abs(perspCam.fov - 42) > 0.02) {
        perspCam.fov = THREE.MathUtils.damp(perspCam.fov, 42, 8, delta);
        perspCam.updateProjectionMatrix();
      }
      if (instancedRef.current) {
        instancedRef.current.visible = false;
      }
      return;
    }

    // Avança o tempo de viagem com delta limitado para evitar saltos se a aba perder foco
    const safeDelta = Math.min(delta, 0.05);
    state.elapsed += safeDelta;
    const rawProgress = Math.min(1, state.elapsed / state.duration);
    state.progress = rawProgress;

    // Determina as 3 etapas da viagem:
    // 1. Aceleração (0.00 - 0.27)
    // 2. Viagem em alta velocidade (0.27 - 0.72)
    // 3. Chegada e acomodação suave (0.72 - 1.00)
    let nextPhase: TravelPhase = 'acceleration';
    if (rawProgress >= 0.72) {
      nextPhase = 'arrival';
    } else if (rawProgress >= 0.27) {
      nextPhase = 'cruise';
    }

    if (nextPhase !== lastPhaseRef.current) {
      lastPhaseRef.current = nextPhase;
      state.phase = nextPhase;
      onPhaseChange(nextPhase);
    }

    if (reducedMotion) {
      // Modo Movimento Reduzido: sem rastros luminosos nem distorção de FOV
      state.warpIntensity = 0;
      if (instancedRef.current) {
        instancedRef.current.visible = false;
      }
    } else {
      // Calcula curva suave de intensidade do hiperespaço nas 3 fases
      let warp = 0;
      if (rawProgress < 0.27) {
        // Fase 1: Aceleração suave (easeInCubic)
        const t = rawProgress / 0.27;
        warp = t * t * (3 - 2 * t);
      } else if (rawProgress < 0.72) {
        // Fase 2: Viagem em velocidade máxima constante com leve modulação
        warp = 1.0;
      } else {
        // Fase 3: Chegada e desaceleração suave (easeOutCubic)
        const t = (rawProgress - 0.72) / 0.28;
        const easeOut = 1 - Math.pow(1 - t, 3);
        warp = Math.max(0, 1 - easeOut);
      }

      state.warpIntensity = warp;

      // Variação sutil e cinematográfica de FOV durante o salto espacial
      const targetFov = 42 + warp * 5.2;
      perspCam.fov = THREE.MathUtils.damp(perspCam.fov, targetFov, 9, safeDelta);
      perspCam.updateProjectionMatrix();

      // Atualiza rastros luminosos 3D
      const mesh = instancedRef.current;
      if (mesh) {
        mesh.visible = warp > 0.005;
        material.opacity = Math.min(0.82, warp * 0.82);

        const speedMultiplier = 0.15 + warp * 1.65;
        // Na aceleração as estrelas começam a se alongar; na viagem atingem comprimento máximo; na chegada encolhem
        const streakStretch = 0.04 + Math.pow(warp, 1.35) * 5.6;

        for (let i = 0; i < streakCount; i++) {
          const p = particles[i];
          p.z += p.speed * speedMultiplier * safeDelta;
          if (p.z > 7.5) {
            p.z -= 62;
          }

          dummy.position.set(p.x, p.y, p.z);
          dummy.scale.set(
            p.thickness,
            p.thickness,
            Math.max(0.03, streakStretch * p.lengthFactor)
          );
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    }

    // Finaliza a viagem ao atingir 100%
    if (rawProgress >= 1) {
      state.isTraveling = false;
      state.warpIntensity = 0;
      state.phase = 'idle';
      lastPhaseRef.current = 'idle';
      if (instancedRef.current) {
        instancedRef.current.visible = false;
      }
      onTravelComplete(state.toId);
    }
  });

  return (
    <instancedMesh
      ref={instancedRef}
      args={[undefined, undefined, streakCount]}
      material={material}
      visible={false}
      frustumCulled={false}
      raycast={() => null}
    >
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
};
