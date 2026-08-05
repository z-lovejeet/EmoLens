'use client';

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { createBodyGeometries } from '@/lib/three/bodyGeometry';
import { BodyZone } from './BodyZone';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCheckinStore } from '@/lib/store/checkinStore';
import { bodyVertexShader, bodyFragmentShader, createBodyUniforms } from '@/lib/three/bodyShader';

const MODEL_PATH = '/models/human-body.glb';

function GLTFBodyModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const bodyType = useCheckinStore((s) => s.bodyType);

  // Clone scene and configure visibility based on bodyType
  const preparedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      // Hide/show armatures based on body type
      if (child.name === 'Armature_60') {
        child.visible = bodyType === 'male' || bodyType === 'neutral';
      }
      if (child.name === 'Armature.001_121') {
        child.visible = bodyType === 'female';
      }

      // Apply custom shader to all meshes
      if (child instanceof THREE.Mesh && child.visible) {
        const shaderMat = new THREE.ShaderMaterial({
          uniforms: createBodyUniforms(),
          vertexShader: bodyVertexShader,
          fragmentShader: bodyFragmentShader,
          transparent: true,
          depthWrite: true,
          side: THREE.DoubleSide,
        });
        child.material = shaderMat;

        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }
      }
    });

    return cloned;
  }, [scene, bodyType]);

  // Animate shader time
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    preparedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
        child.material.uniforms.uTime.value = t;
      }
    });
  });

  // Auto-center and scale
  const { scale, offset } = useMemo(() => {
    // Get bounds of the VISIBLE armature only
    const targetArmature = bodyType === 'female' ? 'Armature.001_121' : 'Armature_60';
    let targetNode: THREE.Object3D | null = null;
    preparedScene.traverse((child) => {
      if (child.name === targetArmature) targetNode = child;
    });

    const measureTarget = targetNode || preparedScene;
    const box = new THREE.Box3().setFromObject(measureTarget);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const targetHeight = 1.75;
    const s = size.y > 0 ? targetHeight / size.y : 1;

    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    };
  }, [preparedScene, bodyType]);

  return (
    <primitive
      object={preparedScene}
      scale={[scale, scale, scale]}
      position={[offset.x, offset.y, offset.z]}
    />
  );
}

export function BodyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const bodyType = useCheckinStore((s) => s.bodyType);
  const zones = useMemo(() => createBodyGeometries(), []);

  // Don't render anything if no body type selected
  if (!bodyType) return null;

  return (
    <group ref={groupRef}>
      {/* Real 3D GLB body — visual only, not interactive */}
      <GLTFBodyModel />

      {/* Invisible interactive zone hitboxes */}
      {zones.map((zone) => (
        <BodyZone
          key={zone.id}
          zoneId={zone.id}
          geometry={zone.geometry}
          center={zone.center}
          invisible
        />
      ))}
    </group>
  );
}

try {
  useGLTF.preload(MODEL_PATH);
} catch {
  // Model may not exist yet
}
