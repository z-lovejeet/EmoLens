'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCheckinStore } from '@/lib/store/checkinStore';
import { getCameraPositions } from '@/lib/three/cameraPositions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CameraController() {
  const { camera, controls } = useThree();
  const reduced = useReducedMotion();
  const activeZone = useCheckinStore((s) => s.activeZone);
  const activeZoneIsRear = useCheckinStore((s) => s.activeZoneIsRear);
  const bodyType = useCheckinStore((s) => s.bodyType);
  const prevZone = useRef<string | null>(null);

  // Smoothly animate camera & controls, then lock when selected
  useEffect(() => {
    const cameraPositions = getCameraPositions(bodyType);
    const key = activeZone
      ? activeZoneIsRear && cameraPositions[`${activeZone}_rear`]
        ? `${activeZone}_rear`
        : activeZone
      : 'full';
    const target = cameraPositions[key] || cameraPositions.full;

    if (!target) return;

    const duration = reduced ? 0.01 : 0.8;
    const ease = reduced ? 'none' : 'power3.inOut';

    // Animate camera position
    gsap.to(camera.position, {
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      duration,
      ease,
      onUpdate: () => {
        if (controls && 'update' in controls) {
          (controls as { update: () => void }).update();
        }
      },
    });

    // Animate OrbitControls target to lock framing center
    if (controls && 'target' in controls) {
      const orbTarget = (controls as { target: THREE.Vector3 }).target;
      gsap.to(orbTarget, {
        x: target.lookAt.x,
        y: target.lookAt.y,
        z: target.lookAt.z,
        duration,
        ease,
      });
    }

    // Animate camera FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      gsap.to(camera, {
        fov: target.fov,
        duration,
        ease,
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [activeZone, activeZoneIsRear, bodyType, camera, controls, reduced]);

  return null;
}
