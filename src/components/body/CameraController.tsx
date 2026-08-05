'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCheckinStore } from '@/lib/store/checkinStore';
import { CAMERA_POSITIONS } from '@/lib/three/cameraPositions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CameraController() {
  const { camera } = useThree();
  const reduced = useReducedMotion();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0.8, 0));
  const activeZone = useCheckinStore((s) => s.activeZone);
  const isZoomed = useCheckinStore((s) => s.isZoomed);
  const prevZone = useRef<string | null>(null);

  // Set initial camera position
  useEffect(() => {
    const initial = CAMERA_POSITIONS.full;
    camera.position.copy(initial.position);
    lookAtTarget.current.copy(initial.lookAt);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = initial.fov;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

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

    gsap.to(lookAtTarget.current, {
      x: target.lookAt.x,
      y: target.lookAt.y,
      z: target.lookAt.z,
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

  // Apply lookAt every frame
  useFrame(() => {
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
