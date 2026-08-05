'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCheckinStore } from '@/lib/store/checkinStore';
import { CAMERA_POSITIONS } from '@/lib/three/cameraPositions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CameraController() {
  const { camera } = useThree();
  const reduced = useReducedMotion();
  const activeZone = useCheckinStore((s) => s.activeZone);
  const prevZone = useRef<string | null>(null);

  // Animate camera on zone selection/deselection
  useEffect(() => {
    if (prevZone.current === activeZone) return;
    prevZone.current = activeZone;

    const target = activeZone
      ? CAMERA_POSITIONS[activeZone]
      : CAMERA_POSITIONS.full;

    if (!target) return;

    const duration = reduced ? 0.01 : 0.8;
    const ease = reduced ? 'none' : 'power3.inOut';

    gsap.to(camera.position, {
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      duration,
      ease,
    });

    if (camera instanceof THREE.PerspectiveCamera) {
      gsap.to(camera, {
        fov: target.fov,
        duration,
        ease,
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [activeZone, camera, reduced]);

  return null;
}
