import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { TravelRuntimeState } from './HyperspaceTransition';

interface StarfieldAndNebulaProps {
  starCount: number;
  travelRef: MutableRefObject<TravelRuntimeState>;
  parallaxOffsetRef: MutableRefObject<THREE.Vector2>;
}

const NEBULA_VERT = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const NEBULA_FRAG = /* glsl */ `
  varying vec3 vWorldPos;

  // Ruído trigonométrico leve em GPU para nebulosas discretas sem texturas pesadas
  float cosmicField(vec3 p) {
    float n = sin(p.x * 0.045 + cos(p.y * 0.055)) * cos(p.z * 0.04 + sin(p.x * 0.035));
    n += 0.5 * sin(p.y * 0.09 - p.x * 0.06 + cos(p.z * 0.08));
    return clamp(n * 0.5 + 0.5, 0.0, 1.0);
  }

  void main() {
    vec3 dir = normalize(vWorldPos);
    float band = exp(-pow(dir.y * 2.2 - dir.x * 0.65, 2.0));
    float c1 = cosmicField(dir * 26.0);
    float c2 = cosmicField(dir * 52.0 + vec3(4.2, -2.1, 7.3));

    vec3 voidBlack = vec3(0.008, 0.014, 0.032);
    vec3 deepBlue = vec3(0.024, 0.058, 0.125);
    vec3 subtleCyan = vec3(0.032, 0.115, 0.185);

    float nebulaMask = smoothstep(0.42, 0.88, c1 * c2) * band;
    vec3 col = mix(voidBlack, deepBlue, band * 0.42);
    col = mix(col, subtleCyan, nebulaMask * 0.28);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  attribute vec3 aColor;

  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uWarpDimming;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    // Cintilação sutil individual
    float twinkle = 0.88 + 0.12 * sin(uTime * 1.4 + position.x * 3.7 + position.y * 5.3);
    vAlpha = aBrightness * twinkle * (1.0 - uWarpDimming * 0.35);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (110.0 / max(-mvPosition.z, 10.0));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord) * 2.0;
    if (dist > 1.0) discard;

    float core = smoothstep(1.0, 0.08, dist);
    float glow = pow(1.0 - dist, 2.4);
    float alpha = (core * 0.65 + glow * 0.35) * vAlpha;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const StarfieldAndNebula: React.FC<StarfieldAndNebulaProps> = ({
  starCount,
  travelRef,
  parallaxOffsetRef,
}) => {
  const starsGroupRef = useRef<THREE.Group>(null);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const brightness = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color('#F8FAFC'), // Branco puro
      new THREE.Color('#E0F2FE'), // Branco-azulado
      new THREE.Color('#BAE6FD'), // Ciano pálido estelar
      new THREE.Color('#FEF3C7'), // Âmbar pálido distante
      new THREE.Color('#CBD5E1'), // Prata suave
    ];

    let seed = 421969;
    const nextRand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < starCount; i++) {
      // Distribuição esférica profunda ao redor da cena
      const u = nextRand();
      const v = nextRand();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 38 + nextRand() * 48;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Tamanhos e intensidades variados (maioria pequenas, algumas estrelas-guia mais brilhantes)
      const sizeRoll = nextRand();
      sizes[i] = sizeRoll > 0.94 ? 2.4 + nextRand() * 1.6 : 0.75 + nextRand() * 1.35;
      brightness[i] = 0.28 + Math.pow(nextRand(), 1.5) * 0.72;

      const pickedColor = palette[Math.floor(nextRand() * palette.length)];
      colors[i * 3] = pickedColor.r;
      colors[i * 3 + 1] = pickedColor.g;
      colors[i * 3 + 2] = pickedColor.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aBrightness', new THREE.BufferAttribute(brightness, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const starUniforms = {
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uTime: { value: 0 },
      uWarpDimming: { value: 0 },
    };

    return { geometry: geo, uniforms: starUniforms };
  }, [starCount]);

  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uWarpDimming.value = travelRef.current.warpIntensity;

    if (starsGroupRef.current) {
      const targetRotY = parallaxOffsetRef.current.x * 0.08;
      const targetRotX = parallaxOffsetRef.current.y * 0.06;
      starsGroupRef.current.rotation.y = THREE.MathUtils.damp(
        starsGroupRef.current.rotation.y,
        targetRotY,
        4,
        delta
      );
      starsGroupRef.current.rotation.x = THREE.MathUtils.damp(
        starsGroupRef.current.rotation.x,
        targetRotX,
        4,
        delta
      );
    }
  });

  return (
    <group ref={starsGroupRef} name="starfield-and-nebula">
      {/* Domo de fundo com nebulosas muito discretas em azul profundo e preto cósmico */}
      <mesh raycast={() => null}>
        <sphereGeometry args={[92, 32, 32]} />
        <shaderMaterial
          vertexShader={NEBULA_VERT}
          fragmentShader={NEBULA_FRAG}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Campo de estrelas de tamanhos e intensidades variados */}
      <points geometry={geometry} raycast={() => null}>
        <shaderMaterial
          vertexShader={STAR_VERT}
          fragmentShader={STAR_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
