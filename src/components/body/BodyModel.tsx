'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { createBodyGeometries } from '@/lib/three/bodyGeometry';
import { BodyZone } from './BodyZone';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { bodyVertexShader, bodyFragmentShader, createBodyUniforms } from '@/lib/three/bodyShader';

const MODEL_PATH = '/models/human-body.glb';

/**
 * Renders the real GLB human body model underneath,
 * with invisible interactive zone hitboxes on top.
 * Falls back to the programmatic body if GLB fails to load.
 */
function GLTFBody() {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const reduced = useReducedMotion();

  const uniforms = useMemo(() => createBodyUniforms(), []);

  // Clone the scene and apply custom shader to all meshes
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Replace all materials with our custom shader
        const shaderMat = new THREE.ShaderMaterial({
          uniforms: createBodyUniforms(),
          vertexShader: bodyVertexShader,
          fragmentShader: bodyFragmentShader,
          transparent: true,
          depthWrite: true,
          side: THREE.FrontSide,
        });
        child.material = shaderMat;

        // Ensure geometry has computed normals for the shader
        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }
      }
    });

    return cloned;
  }, [scene]);

  // Update all shader uniforms in useFrame
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
        child.material.uniforms.uTime.value = t;
      }
    });
  });

  // Entrance animation
  useEffect(() => {
    if (!groupRef.current) return;
    if (reduced) return;

    groupRef.current.scale.set(0.95, 0.95, 0.95);
    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, [reduced]);

  // Gentle float
  useEffect(() => {
    if (!groupRef.current || reduced) return;
    const tween = gsap.to(groupRef.current.position, {
      y: '+=0.03',
      duration: 4.0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [reduced]);

  // Auto-center and auto-scale the model
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Target height: ~1.75 units
    const targetHeight = 1.75;
    const s = targetHeight / size.y;

    // Offset so feet are at y=0 and model is centered
    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    };
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        scale={[scale, scale, scale]}
        position={[offset.x, offset.y, offset.z]}
      />
    </group>
  );
}

/**
 * Fallback: procedural mannequin body with interactive zones
 */
function ProceduralBody() {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const zones = useMemo(() => createBodyGeometries(), []);

  useEffect(() => {
    if (!groupRef.current) return;
    if (reduced) {
      groupRef.current.visible = true;
      return;
    }
    groupRef.current.scale.set(0.95, 0.95, 0.95);
    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, [reduced]);

  useEffect(() => {
    if (!groupRef.current || reduced) return;
    const tween = gsap.to(groupRef.current.position, {
      y: '+=0.03',
      duration: 4.0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [reduced]);

  return (
    <group ref={groupRef}>
      {zones.map((zone) => (
        <BodyZone
          key={zone.id}
          zoneId={zone.id}
          geometry={zone.geometry}
          center={zone.center}
        />
      ))}
    </group>
  );
}

/**
 * Main BodyModel component.
 * Tries to load GLB model first; falls back to procedural.
 * The GLB model gets the zone hitboxes overlaid on top.
 */
export function BodyModel() {
  const [useGLB, setUseGLB] = useState(true);
  const zones = useMemo(() => createBodyGeometries(), []);
  const reduced = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);

  // Check if GLB exists
  useEffect(() => {
    fetch(MODEL_PATH, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) setUseGLB(false);
      })
      .catch(() => setUseGLB(false));
  }, []);

  // Float animation for GLB + hitboxes mode
  useEffect(() => {
    if (!useGLB || !groupRef.current || reduced) return;
    const tween = gsap.to(groupRef.current.position, {
      y: '+=0.03',
      duration: 4.0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [useGLB, reduced]);

  if (!useGLB) {
    return <ProceduralBody />;
  }

  // GLB model with invisible zone hitboxes overlaid
  return (
    <group ref={groupRef}>
      {/* Real 3D model — visual only */}
      <GLTFBody />

      {/* Invisible zone hitboxes — handle clicks/hovers */}
      {zones.map((zone) => (
        <BodyZone
          key={zone.id}
          zoneId={zone.id}
          geometry={zone.geometry}
          center={zone.center}
        />
      ))}
    </group>
  );
}

// Preload the GLB
try {
  useGLTF.preload(MODEL_PATH);
} catch {
  // Model may not exist yet
}
