import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// ── Fresnel Rim Glow Shader ──

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = 1.0 - dot(vNormal, vViewDir);
    fresnel = pow(fresnel, uPower);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

const FresnelMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#8ecae6'),
    uIntensity: 0.0,
    uPower: 2.5,
  },
  vertexShader,
  fragmentShader
);

extend({ FresnelMaterial });

// ── Intensity Color Map ──

export const INTENSITY_COLORS: Record<number, THREE.Color> = {
  1: new THREE.Color('#88d4ab'),
  2: new THREE.Color('#8ecae6'),
  3: new THREE.Color('#b8a9c9'),
  4: new THREE.Color('#e6a97e'),
  5: new THREE.Color('#d4807a'),
};

// ── Zone Material States ──

export const ZONE_MATERIALS = {
  idle: {
    color: new THREE.Color('#c8beb5'),
    roughness: 0.85,
    metalness: 0.02,
    emissive: new THREE.Color('#000000'),
    emissiveIntensity: 0,
  },
  hovered: {
    color: new THREE.Color('#d4ccc4'),
    roughness: 0.75,
    metalness: 0.05,
    emissive: new THREE.Color('#8ecae6'),
    emissiveIntensity: 0.3,
  },
  selected: {
    color: new THREE.Color('#ddd5cd'),
    roughness: 0.6,
    metalness: 0.08,
    emissive: new THREE.Color('#8ecae6'),
    emissiveIntensity: 0.6,
  },
  completed: {
    color: new THREE.Color('#d4ccc4'),
    roughness: 0.65,
    metalness: 0.06,
    emissiveIntensity: 0.5,
  },
} as const;

export { FresnelMaterial };

// Type augmentation for R3F JSX
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type React from 'react';

declare module '@react-three/fiber' {
  interface ThreeElements {
    fresnelMaterial: React.JSX.IntrinsicElements['mesh'] & {
      uColor?: THREE.Color;
      uIntensity?: number;
      uPower?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      side?: THREE.Side;
    };
  }
}
