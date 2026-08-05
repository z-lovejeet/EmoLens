'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCheckinStore } from '@/lib/store/checkinStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CameraController() {
  const { camera } = useThree();
  const reduced = useReducedMotion();
  const activeZone = useCheckinStore((s) => s.activeZone);
  const prevZone = useRef<string | null>(null);

  // Maintain comfortable full-body view (rotate to rear view ONLY if 'back' is selected)
  useEffect(() => {
    if (prevZone.current === activeZone) return;
    prevZone.current = activeZone;

    const isBackView = activeZone === 'back';
    const duration = reduced ? 0.01 : 0.8;
    const ease = reduced ? 'none' : 'power2.inOut';

    const targetZ = isBackView ? -4.2 : 4.2;

    gsap.to(camera.position, {
      x: 0,
      y: 0.88,
      z: targetZ,
      duration,
      ease,
    });

    if (camera instanceof THREE.PerspectiveCamera) {
      gsap.to(camera, {
        fov: 40,
        duration,
        ease,
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [activeZone, camera, reduced]);

  return null;
}
