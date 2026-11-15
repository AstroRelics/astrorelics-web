import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SPACE_ARTIFACTS, SPACE_ARTIFACT_ORDER } from '../../config/spaceArtifacts';
import {
  ExperienceState,
  SpaceArtifactConfig,
  SpaceArtifactId,
  ViewportTier,
} from '../../types/experience';
import { loadSpaceArtifactModel } from '../../utils/modelPreloader';
import { ArtifactCartoonIcon } from '../ui/ArtifactCartoonIcons';
import { ExplorationDragState } from './ExplorationControls';
import { TravelRuntimeState } from './HyperspaceTransition';

/**
 * Converte coordenadas esféricas [latitudeGraus, longitudeGraus] para posição 3D (x, y, z)
 * na superfície de uma esfera de raio `radius`.
 */
export function latLonToVector3(
  latDeg: number,
  lonDeg: number,
  radius = 1.06
): [number, number, number] {
  const phi = THREE.MathUtils.degToRad(90 - latDeg);
  const theta = THREE.MathUtils.degToRad(lonDeg);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

interface ArtifactPinMarkerProps {
  artifact: SpaceArtifactConfig;
  activeArtifactId: SpaceArtifactId | null;
  experienceState: ExperienceState;
  compact?: boolean;
  onSelectArtifact: (id: SpaceArtifactId) => void;
}

/**
 * Pin interativo 3D com o ícone cartoonizado personalizado do objeto.
 */
export const ArtifactPinMarker: React.FC<ArtifactPinMarkerProps> = ({
  artifact,
  activeArtifactId,
  experienceState,
  compact = false,
  onSelectArtifact,
}) => {
  const [hovered, setHovered] = useState(false);
  const isActive = activeArtifactId === artifact.id;
  const isDrifting = artifact.placementType === 'deep-space';

  if (experienceState === 'traveling' || activeArtifactId !== null) {
    return null;
  }

  return (
    <Html
      center
      zIndexRange={[18, 0]}
      style={{
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectArtifact(artifact.id);
        }}
        className="relative group flex flex-col items-center cursor-pointer"
      >
        {/* Tooltip expandido ao passar o mouse sobre o Pin */}
        {hovered && (
          <div className="mb-2 w-56 rounded-xl bg-[#050E21]/95 backdrop-blur-md border border-sky-400/65 p-2.5 shadow-[0_0_28px_rgba(56,189,248,0.35)] text-left animate-fadeIn pointer-events-none">
            <div className="flex items-center justify-between gap-1.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30"
              >
                {isDrifting ? 'À Deriva no Espaço' : 'Relíquia na Superfície'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{artifact.year.split(' ')[0]}</span>
            </div>
            <p className="text-xs font-display font-bold text-white mt-1 leading-snug">
              {artifact.name}
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
              {artifact.locationLabel}
            </p>
            <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-sky-300 font-semibold">
              <span>⚡ Saltar na velocidade da luz</span>
              <span>3D →</span>
            </div>
          </div>
        )}

        {/* Anel pulsante de telemetria */}
        <div className="relative flex items-center justify-center">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-35"
            style={{ backgroundColor: artifact.accentColor }}
          />
          <button
            type="button"
            aria-label={`Viajar na velocidade da luz até ${artifact.name}`}
            className={`relative rounded-full flex items-center justify-center transition-all duration-200 border-2 shadow-[0_0_22px_rgba(14,165,233,0.4)] ${
              compact ? 'w-10 h-10 p-1' : 'w-12 h-12 p-1.5'
            } ${
              hovered || isActive
                ? 'scale-115 bg-[#0B2144] border-white shadow-[0_0_28px_rgba(56,189,248,0.75)]'
                : 'bg-[#061328]/90 border-sky-400/75 hover:scale-110'
            }`}
            style={{
              borderColor: hovered ? '#FFFFFF' : artifact.accentColor,
            }}
          >
            <ArtifactCartoonIcon id={artifact.id} className="w-full h-full drop-shadow" />
          </button>
        </div>

        {/* Etiqueta compacta abaixo do Pin */}
        <div
          className={`mt-1 px-2 py-0.5 rounded-full backdrop-blur-md border text-[10px] font-display font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-1 shadow-md ${
            hovered
              ? 'bg-[#0B2246]/95 border-sky-300 text-white'
              : 'bg-[#040B18]/85 border-slate-700/80 text-slate-100'
          }`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: artifact.accentColor }}
          />
          <span>{artifact.shortName}</span>
          {isDrifting && (
            <span className="text-[9px] text-sky-300/90 font-normal ml-0.5">· À Deriva</span>
          )}
        </div>
      </div>
    </Html>
  );
};

interface DeepSpaceDriftingPinsProps {
  activeArtifactId: SpaceArtifactId | null;
  experienceState: ExperienceState;
  viewportTier: ViewportTier;
  onSelectArtifact: (id: SpaceArtifactId) => void;
}

/**
 * Renderiza os Pins dos objetos que estão "meio à deriva no espaço" entre Terra, Lua e Marte
 * (como o estágio S-IVB J002E3 da Apollo 12 e o Módulo Lunar Snoopy da Apollo 10),
 * com uma leve flutuação gravitacional em 3D.
 */
export const DeepSpaceDriftingPins: React.FC<DeepSpaceDriftingPinsProps> = ({
  activeArtifactId,
  experienceState,
  viewportTier,
  onSelectArtifact,
}) => {
  const driftingArtifacts = useMemo(
    () =>
      SPACE_ARTIFACT_ORDER.map((id) => SPACE_ARTIFACTS[id]).filter(
        (a) => a.placementType === 'deep-space' && a.deepSpacePosition
      ),
    []
  );

  const groupRefs = useRef<Record<string, THREE.Group | null>>({});

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    driftingArtifacts.forEach((artifact, idx) => {
      const grp = groupRefs.current[artifact.id];
      if (!grp || !artifact.deepSpacePosition) return;
      const base = artifact.deepSpacePosition[viewportTier];
      const phase = idx * 2.1;
      // Flutuação suave "à deriva no espaço"
      grp.position.set(
        base[0] + Math.sin(t * 0.55 + phase) * 0.14,
        base[1] + Math.cos(t * 0.7 + phase) * 0.11,
        base[2] + Math.sin(t * 0.4 + phase) * 0.1
      );
      grp.rotation.y = t * 0.35 + phase;
      grp.rotation.z = Math.sin(t * 0.5 + phase) * 0.15;
    });
  });

  if (activeArtifactId !== null || experienceState === 'traveling') {
    return null;
  }

  return (
    <group name="deep-space-drifting-pins">
      {driftingArtifacts.map((artifact) => {
        const base = artifact.deepSpacePosition![viewportTier];
        return (
          <group
            key={artifact.id}
            ref={(el) => {
              groupRefs.current[artifact.id] = el;
            }}
            position={base}
          >
            {/* Pequeno beacon 3D orbital indicando objeto à deriva */}
            <mesh raycast={() => null}>
              <octahedronGeometry args={[0.075, 0]} />
              <meshBasicMaterial
                color={artifact.accentColor}
                wireframe
                transparent
                opacity={0.65}
              />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0, 0]} raycast={() => null}>
              <ringGeometry args={[0.12, 0.145, 28]} />
              <meshBasicMaterial
                color={artifact.accentColor}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>

            <ArtifactPinMarker
              artifact={artifact}
              activeArtifactId={activeArtifactId}
              experienceState={experienceState}
              onSelectArtifact={onSelectArtifact}
            />
          </group>
        );
      })}
    </group>
  );
};

interface ArtifactShowcaseActorProps {
  activeArtifactId: SpaceArtifactId | null;
  experienceState: ExperienceState;
  viewportTier: ViewportTier;
  reducedMotion: boolean;
  dragStateRef: MutableRefObject<ExplorationDragState>;
  travelRef: MutableRefObject<TravelRuntimeState>;
}

/**
 * Exibe o modelo 3D (.glb) real/fiel do objeto espacial selecionado em primeiro plano,
 * com chegada cinematográfica saindo do hiperespaço (estilo Star Wars) e rotação livre 360° pelo usuário.
 */
export const ArtifactShowcaseActor: React.FC<ArtifactShowcaseActorProps> = ({
  activeArtifactId,
  viewportTier,
  reducedMotion,
  dragStateRef,
  travelRef,
}) => {
  const { gl } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const [loadedModels, setLoadedModels] = useState<
    Partial<Record<SpaceArtifactId, THREE.Group>>
  >({});
  const idleSpinRef = useRef<number>(0);

  // Mapa de reflexo PBR exclusivo para os materiais metálicos/ópticos dos artefatos
  const artifactEnvTex = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);

  // Determina qual artefato deve estar visível (o ativo atual ou o alvo de um salto em andamento)
  const displayedId =
    travelRef.current.isTraveling && travelRef.current.targetArtifactId
      ? travelRef.current.targetArtifactId
      : activeArtifactId;

  useEffect(() => {
    if (!displayedId) return;
    let cancelled = false;
    loadSpaceArtifactModel(displayedId)
      .then((group) => {
        if (!cancelled) {
          const cloned = group.clone(true);
          cloned.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              const mesh = obj as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((m) => {
                if (
                  m instanceof THREE.MeshStandardMaterial ||
                  m instanceof THREE.MeshPhysicalMaterial
                ) {
                  m.envMap = artifactEnvTex;
                  // Reflexo especular PBR controlado nas sombras para manter alto contraste realista no espaço
                  m.envMapIntensity = 0.34;
                  m.needsUpdate = true;
                }
              });
            }
          });
          setLoadedModels((prev) => ({ ...prev, [displayedId]: cloned }));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [displayedId, artifactEnvTex]);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.05);
    const root = rootRef.current;
    const spin = spinRef.current;
    if (!root || !spin) return;

    const travel = travelRef.current;
    const targetId = travel.isTraveling ? travel.targetArtifactId : activeArtifactId;

    if (!targetId) {
      root.visible = false;
      return;
    }

    const config = SPACE_ARTIFACTS[targetId];
    const tierScale =
      viewportTier === 'mobile' ? 0.72 : viewportTier === 'tablet' ? 0.88 : 1.0;
    const finalScale = config.inspectRadius * tierScale;
    const fgX = viewportTier === 'desktop' ? -1.05 : 0.0;
    const fgY = viewportTier === 'mobile' ? 0.42 : 0.26;

    if (travel.isTraveling && travel.targetArtifactId) {
      // Durante o salto na velocidade da luz: o objeto emerge do hiperespaço na fase final (progress > 0.42)
      const p = travel.progress;
      if (p < 0.42) {
        root.visible = false;
        idleSpinRef.current = 0;
        return;
      }
      root.visible = true;
      const t = THREE.MathUtils.clamp((p - 0.42) / 0.58, 0, 1);
      const easeOut = 1 - Math.pow(1 - t, 3);

      root.position.set(
        THREE.MathUtils.lerp(0, fgX, easeOut),
        THREE.MathUtils.lerp(0, fgY, easeOut),
        THREE.MathUtils.lerp(-24.0, 0.0, easeOut)
      );
      root.scale.setScalar(THREE.MathUtils.lerp(0.04, finalScale, easeOut));
    } else if (activeArtifactId) {
      root.visible = true;
      root.position.x = THREE.MathUtils.damp(root.position.x, fgX, 8, safeDelta);
      root.position.y = THREE.MathUtils.damp(root.position.y, fgY, 8, safeDelta);
      root.position.z = THREE.MathUtils.damp(root.position.z, 0.0, 8, safeDelta);
      root.scale.setScalar(THREE.MathUtils.damp(root.scale.x, finalScale, 8, safeDelta));
    } else {
      root.visible = false;
      return;
    }

    // Rotação contínua suave + rotação manual em 360° pelo arraste do usuário
    if (!reducedMotion && !dragStateRef.current.isDragging) {
      idleSpinRef.current += config.idleRotationSpeed * safeDelta;
    }

    const targetPitch = config.initialRotation[0] + dragStateRef.current.userRotationOffset.x;
    const targetYaw =
      config.initialRotation[1] +
      dragStateRef.current.userRotationOffset.y +
      idleSpinRef.current;

    spin.rotation.x = THREE.MathUtils.damp(spin.rotation.x, targetPitch, 12, safeDelta);
    spin.rotation.y = THREE.MathUtils.damp(spin.rotation.y, targetYaw, 12, safeDelta);
    spin.rotation.z = THREE.MathUtils.damp(
      spin.rotation.z,
      config.initialRotation[2],
      8,
      safeDelta
    );
  });

  const activeScene = displayedId ? loadedModels[displayedId] : null;

  return (
    <group ref={rootRef} name="artifact-showcase-actor" visible={false}>
      {/* Luz direcional de recorte/estúdio com projeção de sombras reais (self-shadowing nítido entre peças do modelo 3D) */}
      <directionalLight
        position={[3.6, 4.8, 4.2]}
        intensity={1.15}
        color="#FFFDF9"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00025}
        shadow-normalBias={0.014}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-2.2}
      />
      {/* Contra-luz fria (rim light) discreta no lado escuro para recortar a silhueta sem apagar as sombras */}
      <pointLight position={[-4.8, 1.8, -2.5]} intensity={0.45} color="#7DD3FC" distance={14} />

      <group ref={spinRef}>
        {activeScene && <primitive object={activeScene} />}
      </group>

      {/* Sombra de contato projetada abaixo do artefato 3D para dar profundidade espacial e volume */}
      <ContactShadows
        position={[0, -1.08, 0]}
        opacity={0.72}
        scale={3.6}
        blur={1.9}
        far={2.8}
        resolution={512}
        color="#00030A"
      />
    </group>
  );
};
