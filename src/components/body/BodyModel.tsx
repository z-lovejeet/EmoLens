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

  // Entrance animation
  useEffect(() => {
    if (!groupRef.current) return;
    if (reduced) {
      groupRef.current.visible = true;
      return;
    }

    groupRef.current.scale.set(0.92, 0.92, 0.92);
    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.0,
      ease: 'power3.out',
    });
  }, [reduced]);

  // Idle float — gentle breathing motion
  useEffect(() => {
    if (!groupRef.current || reduced) return;
    const tween = gsap.to(groupRef.current.position, {
      y: '+=0.025',
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
