'use client';

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { createBodyGeometries } from '@/lib/three/bodyGeometry';
import { BodyZone } from './BodyZone';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function BodyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const zones = useMemo(() => createBodyGeometries(), []);

  // Model entrance animation
  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;

    if (reduced) {
      group.visible = true;
      return;
    }

    group.scale.set(0.97, 0.97, 0.97);

    gsap.to(group.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Fade in materials
    group.traverse((child) => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.isMeshStandardMaterial) {
          mat.transparent = true;
          mat.opacity = 0;
          gsap.to(mat, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => { mat.transparent = false; },
          });
        }
      }
    });
  }, [reduced]);

  // Idle float animation
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
