import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AtmosphereConfig } from '../../types/experience';
import { SUN_SCENE_CONFIG } from '../../config/celestialBodies';

interface AtmosphereHaloProps {
  atmosphere: AtmosphereConfig;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 mvPosition = viewMatrix * worldPosition;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uSunDirection;
  uniform float uIntensity;
  uniform float uFresnelPower;

  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Termo Fresnel para concentrar a dispersão atmosférica na borda (limbo planetário)
    float viewDot = clamp(dot(normal, viewDir), 0.0, 1.0);
    float fresnel = pow(1.0 - viewDot, uFresnelPower);

    // Coerência com a direção aparente do Sol: ilumina o limbo diurno e suaviza no lado noturno
    float sunDot = dot(normal, normalize(uSunDirection));
    float dayMask = smoothstep(-0.32, 0.45, sunDot);
    float twilightMask = smoothstep(-0.25, 0.15, sunDot) * (1.0 - smoothstep(0.15, 0.65, sunDot));

    vec3 scatterColor = mix(uSecondaryColor, uColor, clamp(sunDot * 0.65 + 0.45, 0.0, 1.0));
    scatterColor += uSecondaryColor * twilightMask * 0.25;

    float alpha = fresnel * uIntensity * (0.12 + 0.88 * dayMask);
    gl_FragColor = vec4(scatterColor, clamp(alpha, 0.0, 0.85));
  }
`;

export const AtmosphereHalo: React.FC<AtmosphereHaloProps> = ({ atmosphere }) => {
  const uniforms = useMemo(() => {
    const sunDir = new THREE.Vector3(...SUN_SCENE_CONFIG.keyLightPosition).normalize();
    return {
      uColor: { value: new THREE.Color(atmosphere.color) },
      uSecondaryColor: { value: new THREE.Color(atmosphere.secondaryColor) },
      uSunDirection: { value: sunDir },
      uIntensity: { value: atmosphere.intensity },
      uFresnelPower: { value: atmosphere.fresnelPower },
    };
  }, [atmosphere]);

  if (!atmosphere.enabled) {
    return null;
  }

  return (
    <mesh scale={atmosphere.scale} raycast={() => null}>
      <sphereGeometry args={[1.0, 48, 48]} />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};
