import * as THREE from 'three';
import { type BodyType } from '@/lib/store/checkinStore';

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

// ── MALE CAMERA RIG (Calibrated precisely to male Y levels) ──
export const MALE_CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.88, 4.2),
    lookAt: new THREE.Vector3(0, 0.88, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.64, 1.8),
    lookAt: new THREE.Vector3(0, 1.64, 0),
    fov: 28,
  },
  throat: {
    position: new THREE.Vector3(0.2, 1.46, 1.6),
    lookAt: new THREE.Vector3(0, 1.46, 0),
    fov: 26,
  },
  shoulder_l: {
    position: new THREE.Vector3(-0.8, 1.34, 1.8),
    lookAt: new THREE.Vector3(-0.30, 1.34, 0),
    fov: 28,
  },
  shoulder_r: {
    position: new THREE.Vector3(0.8, 1.34, 1.8),
    lookAt: new THREE.Vector3(0.30, 1.34, 0),
    fov: 28,
  },
  chest: {
    position: new THREE.Vector3(0, 1.20, 2.0),
    lookAt: new THREE.Vector3(0, 1.20, 0),
    fov: 30,
  },
  stomach: {
    position: new THREE.Vector3(0, 1.02, 2.0),
    lookAt: new THREE.Vector3(0, 1.02, 0),
    fov: 30,
  },
  back: {
    position: new THREE.Vector3(0, 1.15, -2.2),
    lookAt: new THREE.Vector3(0, 1.15, 0),
    fov: 30,
  },
  hips: {
    position: new THREE.Vector3(0, 0.84, -2.0),
    lookAt: new THREE.Vector3(0, 0.84, 0),
    fov: 30,
  },
  arm_l: {
    position: new THREE.Vector3(-1.2, 1.10, 1.8),
    lookAt: new THREE.Vector3(-0.34, 1.10, 0),
    fov: 28,
  },
  arm_r: {
    position: new THREE.Vector3(1.2, 1.10, 1.8),
    lookAt: new THREE.Vector3(0.34, 1.10, 0),
    fov: 28,
  },
  hand_l: {
    position: new THREE.Vector3(-1.0, 0.78, 1.6),
    lookAt: new THREE.Vector3(-0.36, 0.78, 0),
    fov: 26,
  },
  hand_r: {
    position: new THREE.Vector3(1.0, 0.78, 1.6),
    lookAt: new THREE.Vector3(0.36, 0.78, 0),
    fov: 26,
  },
  leg_l: {
    position: new THREE.Vector3(-0.45, 0.45, 2.4),
    lookAt: new THREE.Vector3(-0.15, 0.45, 0),
    fov: 30,
  },
  leg_r: {
    position: new THREE.Vector3(0.45, 0.45, 2.4),
    lookAt: new THREE.Vector3(0.15, 0.45, 0),
    fov: 30,
  },
  foot_l: {
    position: new THREE.Vector3(-0.35, 0.07, 1.6),
    lookAt: new THREE.Vector3(-0.15, 0.07, 0),
    fov: 24,
  },
  foot_r: {
    position: new THREE.Vector3(0.35, 0.07, 1.6),
    lookAt: new THREE.Vector3(0.15, 0.07, 0),
    fov: 24,
  },
};

// ── FEMALE CAMERA RIG (Calibrated precisely to female Y levels) ──
export const FEMALE_CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.88, 4.2),
    lookAt: new THREE.Vector3(0, 0.88, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.63, 1.8),
    lookAt: new THREE.Vector3(0, 1.63, 0),
    fov: 28,
  },
  throat: {
    position: new THREE.Vector3(0.2, 1.45, 1.6),
    lookAt: new THREE.Vector3(0, 1.45, 0),
    fov: 26,
  },
  shoulder_l: {
    position: new THREE.Vector3(-0.75, 1.32, 1.8),
    lookAt: new THREE.Vector3(-0.28, 1.32, 0),
    fov: 28,
  },
  shoulder_r: {
    position: new THREE.Vector3(0.75, 1.32, 1.8),
    lookAt: new THREE.Vector3(0.28, 1.32, 0),
    fov: 28,
  },
  chest: {
    position: new THREE.Vector3(0, 1.16, 2.0),
    lookAt: new THREE.Vector3(0, 1.16, 0),
    fov: 30,
  },
  stomach: {
    position: new THREE.Vector3(0, 0.98, 2.0),
    lookAt: new THREE.Vector3(0, 0.98, 0),
    fov: 30,
  },
  back: {
    position: new THREE.Vector3(0, 1.12, -2.2),
    lookAt: new THREE.Vector3(0, 1.12, 0),
    fov: 30,
  },
  hips: {
    position: new THREE.Vector3(0, 0.80, -2.0),
    lookAt: new THREE.Vector3(0, 0.80, 0),
    fov: 30,
  },
  arm_l: {
    position: new THREE.Vector3(-1.1, 1.05, 1.8),
    lookAt: new THREE.Vector3(-0.32, 1.05, 0),
    fov: 28,
  },
  arm_r: {
    position: new THREE.Vector3(1.1, 1.05, 1.8),
    lookAt: new THREE.Vector3(0.32, 1.05, 0),
    fov: 28,
  },
  hand_l: {
    position: new THREE.Vector3(-0.9, 0.74, 1.6),
    lookAt: new THREE.Vector3(-0.34, 0.74, 0),
    fov: 26,
  },
  hand_r: {
    position: new THREE.Vector3(0.9, 0.74, 1.6),
    lookAt: new THREE.Vector3(0.34, 0.74, 0),
    fov: 26,
  },
  leg_l: {
    position: new THREE.Vector3(-0.4, 0.42, 2.4),
    lookAt: new THREE.Vector3(-0.14, 0.42, 0),
    fov: 30,
  },
  leg_r: {
    position: new THREE.Vector3(0.4, 0.42, 2.4),
    lookAt: new THREE.Vector3(0.14, 0.42, 0),
    fov: 30,
  },
  foot_l: {
    position: new THREE.Vector3(-0.32, 0.07, 1.6),
    lookAt: new THREE.Vector3(-0.14, 0.07, 0),
    fov: 24,
  },
  foot_r: {
    position: new THREE.Vector3(0.32, 0.07, 1.6),
    lookAt: new THREE.Vector3(0.14, 0.07, 0),
    fov: 24,
  },
};

/**
 * Returns gender-specific camera rig target configuration
 */
export function getCameraPositions(bodyType: BodyType | null): Record<string, CameraTarget> {
  if (bodyType === 'female') {
    return FEMALE_CAMERA_POSITIONS;
  }
  return MALE_CAMERA_POSITIONS;
}

export const CAMERA_POSITIONS = MALE_CAMERA_POSITIONS;
