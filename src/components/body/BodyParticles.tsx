'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 250;

/**
 * Floating energy particles that orbit the body.
 * Gives the scene a premium, living, ethereal quality.
 * Uses additive blending for soft light-like appearance.
 */
export function BodyParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particle positions in a cylinder around the body
  const { positions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const off = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 0.9; // radius 0.6 to 1.5
      const y = -0.2 + Math.random() * 2.1; // y from -0.2 to 1.9

      pos[i * 3]     = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      spd[i] = 0.02 + Math.random() * 0.04; // orbit speed
      off[i] = Math.random() * Math.PI * 2;  // phase offset
    }

    return { positions: pos, speeds: spd, offsets: off };
  }, []);

  // Animate particles — slow orbit + gentle vertical drift
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const r = Math.sqrt(x * x + z * z);
      const baseAngle = Math.atan2(z, x);
      const angle = baseAngle + t * speeds[i];

      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(t * 0.3 + offsets[i]) * 0.06;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.slice(), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#8ecae6"
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Subtle luminous ground reference — a soft glow beneath the body.
 * Anchors the model visually without a hard floor.
 */
export function GroundGlow() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#8ecae6') },
  }), []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.08, 0]}>
      <circleGeometry args={[1.2, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;

          void main() {
            float dist = length(vUv - 0.5) * 2.0;
            float glow = smoothstep(1.0, 0.0, dist);
            glow = pow(glow, 3.0);

            // Subtle pulse
            float pulse = sin(uTime * 0.8) * 0.1 + 0.9;
            glow *= pulse;

            // Concentric ring pattern
            float ring = sin(dist * 12.0 - uTime * 0.5) * 0.5 + 0.5;
            ring = smoothstep(0.3, 0.7, ring) * 0.15;

            float alpha = glow * 0.06 + ring * glow;

            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}
