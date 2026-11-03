import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CELESTIAL_BODIES, CELESTIAL_BODY_ORDER } from '../config/celestialBodies';
import { CelestialBodyConfig, CelestialBodyId } from '../types/experience';

export interface LoadedCelestialAsset {
  id: CelestialBodyId;
  source: 'glb' | 'provisional-sphere';
  resolvedPath: string | null;
  /** Cena Three.js normalizada para raio unitário (R = 1.0) centrada na origem (0,0,0) */
  normalizedGroup: THREE.Group | null;
}

export interface PreloadProgressState {
  progress: number; // 0 a 100
  currentLabel: string;
  assets: Partial<Record<CelestialBodyId, LoadedCelestialAsset>>;
}

const assetCache: Partial<Record<CelestialBodyId, LoadedCelestialAsset>> = {};

/**
 * Verifica qual caminho de arquivo GLB/GLTF está disponível localmente para o corpo celeste.
 */
async function resolveAvailableModelPath(config: CelestialBodyConfig): Promise<string | null> {
  const uniquePaths = Array.from(new Set([config.modelPath, ...config.candidatePaths]));

  for (const candidate of uniquePaths) {
    try {
      const response = await fetch(candidate, { method: 'HEAD', cache: 'no-cache' });
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        // Evita falso positivo caso o servidor SPA retorne index.html para uma rota inexistente
        if (!contentType.includes('text/html')) {
          return candidate;
        }
      }
    } catch {
      // Continua tentando o próximo caminho candidato
    }
  }

  return null;
}

/**
 * Normaliza qualquer cena GLTF/GLB para que fique perfeitamente centralizada em (0, 0, 0)
 * com raio exatamente igual a 1.0 unidade, além de calibrar os materiais PBR para iluminação espacial.
 */
function buildNormalizedModelGroup(gltf: GLTF, config: CelestialBodyConfig): THREE.Group {
  const root = gltf.scene.clone(true);
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDimension = Math.max(size.x, size.y, size.z);
  const currentRadius = maxDimension > 0.0001 ? maxDimension * 0.5 : 1.0;
  const normalizeScale = 1.0 / currentRadius;

  // Aplica calibração de material para evitar brilho plástico e garantir transição dia/noite natural
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = true;

      // Garante normais suaves caso a geometria precise
      if (mesh.geometry && !mesh.geometry.attributes.normal) {
        mesh.geometry.computeVertexNormals();
      }

      const tuneMaterial = (mat: THREE.Material): THREE.Material => {
        const cloned = mat.clone();
        if (cloned instanceof THREE.MeshStandardMaterial || cloned instanceof THREE.MeshPhysicalMaterial) {
          cloned.roughness = config.materialTuning.roughness;
          cloned.metalness = config.materialTuning.metalness;
          if (cloned instanceof THREE.MeshPhysicalMaterial) {
            cloned.clearcoat = 0;
          }
          if (cloned.normalMap) {
            cloned.normalScale.set(
              config.materialTuning.normalScale,
              config.materialTuning.normalScale
            );
          }
          if (cloned.map) {
            cloned.map.colorSpace = THREE.SRGBColorSpace;
            cloned.map.anisotropy = 8;
          }
          cloned.needsUpdate = true;
        }
        return cloned;
      };

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(tuneMaterial);
      } else if (mesh.material) {
        mesh.material = tuneMaterial(mesh.material);
      }
    }
  });

  // Centraliza geometricamente na origem e normaliza o raio para 1.0
  root.position.set(
    -center.x * normalizeScale,
    -center.y * normalizeScale,
    -center.z * normalizeScale
  );
  root.scale.setScalar(normalizeScale);

  const wrapper = new THREE.Group();
  wrapper.name = `normalized-${config.id}`;
  wrapper.add(root);
  return wrapper;
}

/**
 * Pré-carrega todos os modelos 3D configurados antes de liberar a navegação e as viagens,
 * reportando o progresso detalhado para a tela de carregamento.
 */
export async function preloadAllCelestialModels(
  onProgress: (state: PreloadProgressState) => void,
  forceReload = false
): Promise<Record<CelestialBodyId, LoadedCelestialAsset>> {
  if (!forceReload && CELESTIAL_BODY_ORDER.every((id) => Boolean(assetCache[id]))) {
    const cachedResult = assetCache as Record<CelestialBodyId, LoadedCelestialAsset>;
    onProgress({
      progress: 100,
      currentLabel: 'Modelos espaciais prontos',
      assets: cachedResult,
    });
    return cachedResult;
  }

  const loader = new GLTFLoader();
  const totalBodies = CELESTIAL_BODY_ORDER.length;
  const perBodyProgress: Record<CelestialBodyId, number> = {
    earth: 0,
    moon: 0,
    mars: 0,
  };

  const emitOverallProgress = (label: string) => {
    const sum =
      perBodyProgress.earth + perBodyProgress.moon + perBodyProgress.mars;
    const avg = Math.min(99, Math.round(sum / totalBodies));
    onProgress({
      progress: avg,
      currentLabel: label,
      assets: { ...assetCache },
    });
  };

  emitOverallProgress('Verificando modelos 3D dos corpos celestes...');

  for (const id of CELESTIAL_BODY_ORDER) {
    const config = CELESTIAL_BODIES[id];
    emitOverallProgress(`Preparando ${config.name}...`);

    const resolvedPath = await resolveAvailableModelPath(config);

    if (!resolvedPath) {
      // Arquivo GLB ainda não presente: usa esfera provisória organizada para substituição posterior
      assetCache[id] = {
        id,
        source: 'provisional-sphere',
        resolvedPath: null,
        normalizedGroup: null,
      };
      perBodyProgress[id] = 100;
      emitOverallProgress(`${config.name}: esfera provisória configurada`);
      continue;
    }

    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        resolvedPath,
        (loaded) => resolve(loaded),
        (event) => {
          if (event.lengthComputable && event.total > 0) {
            perBodyProgress[id] = Math.min(98, Math.round((event.loaded / event.total) * 100));
            emitOverallProgress(`Carregando modelo 3D: ${config.name} (${perBodyProgress[id]}%)`);
          } else {
            perBodyProgress[id] = Math.min(90, perBodyProgress[id] + 15);
            emitOverallProgress(`Carregando modelo 3D: ${config.name}...`);
          }
        },
        (err) => {
          reject(
            new Error(
              `Falha ao carregar o modelo 3D de ${config.name} em "${resolvedPath}": ${
                err instanceof Error ? err.message : 'arquivo inválido ou inacessível'
              }`
            )
          );
        }
      );
    });

    const normalizedGroup = buildNormalizedModelGroup(gltf, config);
    assetCache[id] = {
      id,
      source: 'glb',
      resolvedPath,
      normalizedGroup,
    };
    perBodyProgress[id] = 100;
    emitOverallProgress(`${config.name} carregado`);
  }

  const finalAssets = assetCache as Record<CelestialBodyId, LoadedCelestialAsset>;
  onProgress({
    progress: 100,
    currentLabel: 'Telemetria visual pronta',
    assets: finalAssets,
  });

  return finalAssets;
}
