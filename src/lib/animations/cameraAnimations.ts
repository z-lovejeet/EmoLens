import gsap from 'gsap';
import * as THREE from 'three';
import { CAMERA_POSITIONS, type CameraTarget } from '@/lib/three/cameraPositions';
import { DURATION, EASE } from './tokens';

function getDuration(base: number, reduced: boolean): number {
  return reduced ? DURATION.instant : base;
}

function getEase(base: string, reduced: boolean): string {
  return reduced ? 'none' : base;
}

export function zoomToZone(
  camera: THREE.PerspectiveCamera,
  lookAtTarget: THREE.Vector3,
  target: CameraTarget,
  reducedMotion: boolean
) {
  const dur = getDuration(DURATION.dramatic, reducedMotion);
  const ease = getEase(EASE.cameraMove, reducedMotion);

  const tl = gsap.timeline();

  tl.to(camera.position, {
    x: target.position.x,
    y: target.position.y,
    z: target.position.z,
    duration: dur,
    ease,
  }, 0);

  tl.to(lookAtTarget, {
    x: target.lookAt.x,
    y: target.lookAt.y,
    z: target.lookAt.z,
    duration: dur,
    ease,
  }, 0);

  tl.to(camera, {
    fov: target.fov,
    duration: dur,
    ease,
    onUpdate: () => camera.updateProjectionMatrix(),
  }, 0);

  return tl;
}

export function zoomToFull(
  camera: THREE.PerspectiveCamera,
  lookAtTarget: THREE.Vector3,
  reducedMotion: boolean
) {
  return zoomToZone(camera, lookAtTarget, CAMERA_POSITIONS.full, reducedMotion);
}

export function startGlowPulse(
  material: THREE.MeshStandardMaterial,
  intensity: { min: number; max: number },
  reducedMotion: boolean
): gsap.core.Tween | null {
  if (reducedMotion) {
    material.emissiveIntensity = (intensity.min + intensity.max) / 2;
    return null;
  }

  return gsap.to(material, {
    emissiveIntensity: intensity.max,
    duration: 2.0,
    ease: EASE.gentle,
    yoyo: true,
    repeat: -1,
    startAt: { emissiveIntensity: intensity.min },
  });
}

export function startBreathingGlow(
  material: THREE.MeshStandardMaterial,
  reducedMotion: boolean
): gsap.core.Tween | null {
  if (reducedMotion) {
    material.emissiveIntensity = 0.45;
    return null;
  }

  return gsap.to(material, {
    emissiveIntensity: 0.55,
    duration: 3.0,
    ease: EASE.gentle,
    yoyo: true,
    repeat: -1,
    startAt: { emissiveIntensity: 0.35 },
  });
}

export function startIdleFloat(
  group: THREE.Group,
  reducedMotion: boolean
): gsap.core.Tween | null {
  if (reducedMotion) return null;

  return gsap.to(group.position, {
    y: '+=0.03',
    duration: 4.0,
    ease: EASE.gentle,
    yoyo: true,
    repeat: -1,
  });
}
