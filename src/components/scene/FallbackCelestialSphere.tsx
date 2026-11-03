import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CelestialBodyConfig, CelestialBodyId } from '../../types/experience';

interface FallbackCelestialSphereProps {
  config: CelestialBodyConfig;
}

function hash2D(ix: number, iy: number, seed: number): number {
  let n = (ix * 374761393 + iy * 668265263 + seed * 1442695041) | 0;
  n = (n ^ (n >> 13)) | 0;
  n = Math.imul(n, 1274126177);
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

function valueNoise2D(x: number, y: number, periodX: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const ix0 = ((ix % periodX) + periodX) % periodX;
  const ix1 = (((ix + 1) % periodX) + periodX) % periodX;

  const a = hash2D(ix0, iy, seed);
  const b = hash2D(ix1, iy, seed);
  const c = hash2D(ix0, iy + 1, seed);
  const d = hash2D(ix1, iy + 1, seed);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbmTileable(u: number, v: number, baseFreq: number, octaves: number, seed: number): number {
  let total = 0;
  let amplitude = 0.5;
  let freq = baseFreq;
  let maxVal = 0;

  for (let i = 0; i < octaves; i++) {
    total += valueNoise2D(u * freq, v * (freq * 0.5), freq, seed + i * 101) * amplitude;
    maxVal += amplitude;
    amplitude *= 0.5;
    freq *= 2;
  }
  return total / maxVal;
}

/**
 * Gera texturas procedurais de alta fidelidade (albedo + relevo rochoso) 100% locais
 * para substituição posterior caso o arquivo `.glb` ainda não esteja na pasta `3d_models/`.
 */
function createProceduralPlanetTextures(id: CelestialBodyId): {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const width = 1024;
  const height = 512;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  const colorImg = cCtx.createImageData(width, height);
  const bumpImg = bCtx.createImageData(width, height);
  const cData = colorImg.data;
  const bData = bumpImg.data;

  // Lista determinística de bacias e crateras de impacto
  let s = id === 'moon' ? 19690720 : id === 'earth' ? 19900424 : 20040125;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  interface Crater {
    u: number;
    v: number;
    r: number;
    depth: number;
  }

  const craters: Crater[] = [];
  const craterCount = id === 'moon' ? 165 : 40;
  for (let i = 0; i < craterCount; i++) {
    craters.push({
      u: rand(),
      v: 0.1 + rand() * 0.8,
      r: i < 14 ? 0.032 + rand() * 0.048 : 0.006 + Math.pow(rand(), 2.2) * 0.024,
      depth: 0.45 + rand() * 0.55,
    });
  }

  for (let y = 0; y < height; y++) {
    const v = y / height;
    // Corrige estiramento próximo aos polos
    const latScale = Math.max(0.22, Math.sin(v * Math.PI));

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const idx = (y * width + x) * 4;

      const macro = fbmTileable(u, v, 8, 5, 11);
      const meso = fbmTileable(u, v, 32, 4, 37);
      const micro = fbmTileable(u, v, 128, 3, 73);

      if (id === 'moon') {
        // Bacias basálticas (mares lunares mais escuros) vs terras altas rochosas (highlands)
        const mariaMask = THREE.MathUtils.smoothstep(macro, 0.34, 0.62);
        let heightVal = 0.25 + mariaMask * 0.42 + (meso - 0.5) * 0.22 + (micro - 0.5) * 0.14;
        let albedo = 84 + mariaMask * 64 + (meso - 0.5) * 28 + (micro - 0.5) * 18;

        // Aplica morfologia realista de crateras sem halos artificiais
        for (let c = 0; c < craters.length; c++) {
          const cr = craters[c];
          let du = Math.abs(u - cr.u);
          if (du > 0.5) du = 1.0 - du;
          du *= latScale;
          const dv = v - cr.v;

          if (Math.abs(du) > cr.r * 1.35 || Math.abs(dv) > cr.r * 1.35) continue;
          const dist = Math.sqrt(du * du + dv * dv) / cr.r;

          if (dist < 1.3) {
            if (dist < 0.78) {
              // Cavidade interna da cratera
              const bowl = 1.0 - Math.pow(dist / 0.78, 2);
              heightVal -= bowl * 0.28 * cr.depth;
              albedo -= bowl * 14 * cr.depth;
            } else if (dist < 1.06) {
              // Crista fina e irregular da borda da cratera
              const rimT = (dist - 0.78) / 0.28;
              const rim = Math.sin(rimT * Math.PI);
              heightVal += rim * 0.16 * cr.depth * (0.7 + 0.6 * micro);
              albedo += rim * 12 * cr.depth * (0.6 + 0.5 * meso);
            } else {
              // Transição externa suave
              const ejecta = 1.0 - (dist - 1.06) / 0.24;
              heightVal += ejecta * 0.03 * (micro - 0.3);
            }
          }
        }

        const rCol = THREE.MathUtils.clamp(Math.round(albedo), 42, 205);
        const gCol = THREE.MathUtils.clamp(Math.round(albedo * 0.99), 41, 203);
        const bCol = THREE.MathUtils.clamp(Math.round(albedo * 0.96), 39, 198);

        cData[idx] = rCol;
        cData[idx + 1] = gCol;
        cData[idx + 2] = bCol;
        cData[idx + 3] = 255;

        const bumpByte = THREE.MathUtils.clamp(Math.round(heightVal * 255), 0, 255);
        bData[idx] = bumpByte;
        bData[idx + 1] = bumpByte;
        bData[idx + 2] = bumpByte;
        bData[idx + 3] = 255;
      } else if (id === 'mars') {
        const rust = 115 + macro * 78 + (meso - 0.5) * 35;
        cData[idx] = THREE.MathUtils.clamp(Math.round(rust * 1.15), 55, 225);
        cData[idx + 1] = THREE.MathUtils.clamp(Math.round(rust * 0.56), 28, 130);
        cData[idx + 2] = THREE.MathUtils.clamp(Math.round(rust * 0.36), 18, 90);
        cData[idx + 3] = 255;

        const bumpByte = THREE.MathUtils.clamp(Math.round((macro * 0.6 + micro * 0.4) * 255), 0, 255);
        bData[idx] = bumpByte;
        bData[idx + 1] = bumpByte;
        bData[idx + 2] = bumpByte;
        bData[idx + 3] = 255;
      } else {
        // Terra provisória
        const isLand = macro > 0.52;
        cData[idx] = isLand ? 54 : 14;
        cData[idx + 1] = isLand ? 112 : 48;
        cData[idx + 2] = isLand ? 68 : 96;
        cData[idx + 3] = 255;

        const bumpByte = isLand ? Math.round(140 + meso * 100) : 90;
        bData[idx] = bumpByte;
        bData[idx + 1] = bumpByte;
        bData[idx + 2] = bumpByte;
        bData[idx + 3] = 255;
      }
    }
  }

  cCtx.putImageData(colorImg, 0, 0);
  bCtx.putImageData(bumpImg, 0, 0);

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;
  colorMap.anisotropy = 8;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.anisotropy = 8;

  return { colorMap, bumpMap };
}

export const FallbackCelestialSphere: React.FC<FallbackCelestialSphereProps> = ({ config }) => {
  const { colorMap, bumpMap } = useMemo(
    () => createProceduralPlanetTextures(config.id),
    [config.id]
  );

  return (
    <mesh name={`provisional-sphere-${config.id}`} receiveShadow>
      <sphereGeometry args={[1.0, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={config.id === 'moon' ? 0.038 : 0.02}
        roughness={config.materialTuning.roughness}
        metalness={config.materialTuning.metalness}
      />
    </mesh>
  );
};
