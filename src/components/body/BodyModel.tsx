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

const MODEL_PATH = '/models/human-body.glb';

/**
 * Premium material for the real human body GLB.
 * Uses MeshPhysicalMaterial (works with SkinnedMesh + bones).
 * Gives a smooth, semi-translucent porcelain/mannequin look.
 */
function createBodyMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c8beb5'),
    roughness: 0.55,
    metalness: 0.02,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    sheen: 1.0,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color('#8ecae6'),
    emissive: new THREE.Color('#1a2a3a'),
    emissiveIntensity: 0.15,
    envMapIntensity: 0.8,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
  });
}

function GLTFBodyModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const bodyType = useCheckinStore((s) => s.bodyType);
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene once per bodyType change
  const preparedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      // Toggle armature visibility based on body type
      if (child.name === 'Armature_60') {
        child.visible = bodyType === 'male' || bodyType === 'neutral';
      }
      if (child.name === 'Armature.001_121') {
        child.visible = bodyType === 'female';
      }

      // Apply premium material to ALL mesh types (Mesh + SkinnedMesh)
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = createBodyMaterial();
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (!mesh.geometry.attributes.normal) {
          mesh.geometry.computeVertexNormals();
        }
      }
    });

    return cloned;
  }, [scene, bodyType]);

  // Auto-center and scale to fit our scene
  const { modelScale, offset } = useMemo(() => {
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
      modelScale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    };
  }, [preparedScene, bodyType]);

  // Gentle breathing emissive pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.1 + Math.sin(t * 0.8) * 0.05;
    preparedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = pulse;
        }
      }
    });
  });

  return (
    <primitive
      object={preparedScene}
      scale={[modelScale, modelScale, modelScale]}
      position={[offset.x, offset.y, offset.z]}
    />
  );
}

export function BodyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const bodyType = useCheckinStore((s) => s.bodyType);
  const zones = useMemo(() => createBodyGeometries(), []);

  // Entrance animation
  useEffect(() => {
    if (!groupRef.current || reduced || !bodyType) return;
    groupRef.current.scale.set(0.95, 0.95, 0.95);
    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, [reduced, bodyType]);

  // Idle float
  useEffect(() => {
    if (!groupRef.current || reduced || !bodyType) return;
    const tween = gsap.to(groupRef.current.position, {
      y: '+=0.03',
      duration: 4.0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [reduced, bodyType]);

  // Don't render anything if no body type selected
  if (!bodyType) return null;

  return (
    <group ref={groupRef}>
      {/* Real 3D GLB body — visual display */}
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
