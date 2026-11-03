import React, { MutableRefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ExperienceState } from '../../types/experience';

export interface ExplorationDragState {
  /** Rotação acumulada [pitch, yaw] aplicada pelo usuário ao corpo selecionado */
  userRotationOffset: THREE.Vector2;
  /** Rotação alvo [pitch, yaw] com amortecimento suave */
  targetRotationOffset: THREE.Vector2;
  /** Indica se o usuário está arrastando ativamente */
  isDragging: boolean;
  /** Timestamp (performance.now) do término do último arraste para filtrar cliques acidentais */
  lastDragEndTime: number;
}

interface ExplorationControlsProps {
  experienceState: ExperienceState;
  dragStateRef: MutableRefObject<ExplorationDragState>;
  parallaxOffsetRef: MutableRefObject<THREE.Vector2>;
  onUserInteractionStart?: () => void;
}

const DRAG_THRESHOLD_PX = 5;
const MAX_PITCH_RAD = 1.12; // ~64 graus para evitar inversão dos polos (gimbal lock)

export const ExplorationControls: React.FC<ExplorationControlsProps> = ({
  experienceState,
  dragStateRef,
  parallaxOffsetRef,
  onUserInteractionStart,
}) => {
  const { gl, camera } = useThree();
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const startPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasNotifiedInteractionRef = useRef(false);

  useEffect(() => {
    const domElement = gl.domElement;
    // Desativa gestos nativos de pinça/scroll no canvas
    domElement.style.touchAction = 'none';

    const handleWheel = (e: WheelEvent) => {
      // Zoom manual desativado conforme especificação
      e.preventDefault();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (experienceState !== 'exploring') return;
      if (e.button !== undefined && e.button !== 0) return;

      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointersRef.current.size === 1) {
        startPointerPosRef.current = { x: e.clientX, y: e.clientY };
        dragStateRef.current.isDragging = false;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Se houver mais de um toque simultâneo (pinça), ignora completamente (sem zoom manual)
      if (activePointersRef.current.size > 1) {
        activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        return;
      }

      const prev = activePointersRef.current.get(e.pointerId);
      if (!prev) return;

      if (experienceState !== 'exploring') {
        activePointersRef.current.clear();
        dragStateRef.current.isDragging = false;
        return;
      }

      const totalDx = e.clientX - startPointerPosRef.current.x;
      const totalDy = e.clientY - startPointerPosRef.current.y;
      const totalDist = Math.hypot(totalDx, totalDy);

      if (!dragStateRef.current.isDragging && totalDist > DRAG_THRESHOLD_PX) {
        dragStateRef.current.isDragging = true;
        domElement.style.cursor = 'grabbing';
        if (!hasNotifiedInteractionRef.current && onUserInteractionStart) {
          hasNotifiedInteractionRef.current = true;
          onUserInteractionStart();
        }
      }

      if (dragStateRef.current.isDragging) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;

        const sensitivity = 0.0058;
        // Arrastar horizontalmente gira o corpo ao redor do eixo Y (360° livres)
        dragStateRef.current.targetRotationOffset.y += dx * sensitivity;
        // Arrastar verticalmente inclina o eixo X com limite confortável nos polos
        dragStateRef.current.targetRotationOffset.x = THREE.MathUtils.clamp(
          dragStateRef.current.targetRotationOffset.x + dy * sensitivity,
          -MAX_PITCH_RAD,
          MAX_PITCH_RAD
        );

        // Paralaxe espacial sutil
        parallaxOffsetRef.current.x = THREE.MathUtils.clamp(
          parallaxOffsetRef.current.x + dx * 0.0012,
          -0.65,
          0.65
        );
        parallaxOffsetRef.current.y = THREE.MathUtils.clamp(
          parallaxOffsetRef.current.y + dy * 0.0012,
          -0.45,
          0.45
        );
      }

      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };

    const handlePointerUpOrCancel = (e: PointerEvent) => {
      activePointersRef.current.delete(e.pointerId);

      if (dragStateRef.current.isDragging) {
        dragStateRef.current.lastDragEndTime = performance.now();
      }
      if (activePointersRef.current.size === 0) {
        dragStateRef.current.isDragging = false;
        domElement.style.cursor = experienceState === 'exploring' ? 'grab' : 'default';
      }
    };

    domElement.style.cursor = experienceState === 'exploring' ? 'grab' : 'default';

    domElement.addEventListener('wheel', handleWheel, { passive: false });
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUpOrCancel);
    window.addEventListener('pointercancel', handlePointerUpOrCancel);

    return () => {
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUpOrCancel);
      window.removeEventListener('pointercancel', handlePointerUpOrCancel);
    };
  }, [gl, experienceState, dragStateRef, parallaxOffsetRef, onUserInteractionStart]);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.05);
    const drag = dragStateRef.current;

    // Amortecimento suave (damping) para rotação do corpo em primeiro plano
    drag.userRotationOffset.x = THREE.MathUtils.damp(
      drag.userRotationOffset.x,
      drag.targetRotationOffset.x,
      8.5,
      safeDelta
    );
    drag.userRotationOffset.y = THREE.MathUtils.damp(
      drag.userRotationOffset.y,
      drag.targetRotationOffset.y,
      8.5,
      safeDelta
    );

    // Mantém a câmera estável com leve resposta de orientação
    const targetCamX = parallaxOffsetRef.current.x * 0.18;
    const targetCamY = -parallaxOffsetRef.current.y * 0.14;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 5, safeDelta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 5, safeDelta);
    camera.lookAt(0, 0, 0);
  });

  return null;
};
