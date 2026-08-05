import * as THREE from 'three';
import { type BodyType } from '@/lib/store/checkinStore';

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

// ── MALE CAMERA RIG (Viewer facing front: Left side of screen is Model Right, Right side of screen is Model Left) ──
export const MALE_CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.88, 4.2),
    lookAt: new THREE.Vector3(0, 0.88, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.64, 2.5),
    lookAt: new THREE.Vector3(0, 1.64, 0),
    fov: 32,
  },
  throat: {
    position: new THREE.Vector3(0, 1.48, 2.4),
    lookAt: new THREE.Vector3(0, 1.48, 0),
    fov: 32,
  },
  shoulder_l: {
    position: new THREE.Vector3(0.4, 1.38, 2.6),
    lookAt: new THREE.Vector3(0.26, 1.38, 0),
    fov: 34,
  },
  shoulder_r: {
    position: new THREE.Vector3(-0.4, 1.38, 2.6),
    lookAt: new THREE.Vector3(-0.26, 1.38, 0),
    fov: 34,
  },
  chest: {
    position: new THREE.Vector3(0, 1.30, 2.8),
    lookAt: new THREE.Vector3(0, 1.30, 0),
    fov: 34,
  },
  stomach: {
    position: new THREE.Vector3(0, 1.09, 2.8),
    lookAt: new THREE.Vector3(0, 1.09, 0),
    fov: 34,
  },
  back: {
    position: new THREE.Vector3(0, 1.23, -2.8),
    lookAt: new THREE.Vector3(0, 1.23, 0),
    fov: 34,
  },
  hips: {
    position: new THREE.Vector3(0, 0.89, -2.8),
    lookAt: new THREE.Vector3(0, 0.89, 0),
    fov: 34,
  },
  arm_l: {
    position: new THREE.Vector3(0.5, 1.12, 2.6),
    lookAt: new THREE.Vector3(0.28, 1.12, 0),
    fov: 34,
  },
  arm_r: {
    position: new THREE.Vector3(-0.5, 1.12, 2.6),
    lookAt: new THREE.Vector3(-0.28, 1.12, 0),
    fov: 34,
  },
  hand_l: {
    position: new THREE.Vector3(0.5, 0.84, 2.6),
    lookAt: new THREE.Vector3(0.31, 0.84, 0),
    fov: 34,
  },
  hand_r: {
    position: new THREE.Vector3(-0.5, 0.84, 2.6),
    lookAt: new THREE.Vector3(-0.31, 0.84, 0),
    fov: 34,
  },
  leg_l: {
    position: new THREE.Vector3(0.25, 0.52, 2.8),
    lookAt: new THREE.Vector3(0.10, 0.52, 0),
    fov: 34,
  },
  leg_r: {
    position: new THREE.Vector3(-0.25, 0.52, 2.8),
    lookAt: new THREE.Vector3(-0.10, 0.52, 0),
    fov: 34,
  },
  foot_l: {
    position: new THREE.Vector3(0.25, 0.15, 2.4),
    lookAt: new THREE.Vector3(0.10, 0.08, 0),
    fov: 30,
  },
  foot_r: {
    position: new THREE.Vector3(-0.25, 0.15, 2.4),
    lookAt: new THREE.Vector3(-0.10, 0.08, 0),
    fov: 30,
  },
};

// ── FEMALE CAMERA RIG ──
export const FEMALE_CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.88, 4.2),
    lookAt: new THREE.Vector3(0, 0.88, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.62, 2.5),
    lookAt: new THREE.Vector3(0, 1.62, 0),
    fov: 32,
  },
  throat: {
    position: new THREE.Vector3(0, 1.49, 2.4),
    lookAt: new THREE.Vector3(0, 1.49, 0),
    fov: 32,
  },
  shoulder_l: {
    position: new THREE.Vector3(0.35, 1.36, 2.6),
    lookAt: new THREE.Vector3(0.22, 1.36, 0),
    fov: 34,
  },
  shoulder_r: {
    position: new THREE.Vector3(-0.35, 1.36, 2.6),
    lookAt: new THREE.Vector3(-0.22, 1.36, 0),
    fov: 34,
  },
  chest: {
    position: new THREE.Vector3(0, 1.30, 2.8),
    lookAt: new THREE.Vector3(0, 1.30, 0),
    fov: 34,
  },
  stomach: {
    position: new THREE.Vector3(0, 1.08, 2.8),
    lookAt: new THREE.Vector3(0, 1.08, 0),
    fov: 34,
  },
  back: {
    position: new THREE.Vector3(0, 1.23, -2.8),
    lookAt: new THREE.Vector3(0, 1.23, 0),
    fov: 34,
  },
  hips: {
    position: new THREE.Vector3(0, 0.88, -2.8),
    lookAt: new THREE.Vector3(0, 0.88, 0),
    fov: 34,
  },
  arm_l: {
    position: new THREE.Vector3(0.45, 1.08, 2.6),
    lookAt: new THREE.Vector3(0.26, 1.08, 0),
    fov: 34,
  },
  arm_r: {
    position: new THREE.Vector3(-0.45, 1.08, 2.6),
    lookAt: new THREE.Vector3(-0.26, 1.08, 0),
    fov: 34,
  },
  hand_l: {
    position: new THREE.Vector3(0.45, 0.86, 2.6),
    lookAt: new THREE.Vector3(0.32, 0.86, 0),
    fov: 34,
  },
  hand_r: {
    position: new THREE.Vector3(-0.45, 0.86, 2.6),
    lookAt: new THREE.Vector3(-0.32, 0.86, 0),
    fov: 34,
  },
  leg_l: {
    position: new THREE.Vector3(0.22, 0.55, 2.8),
    lookAt: new THREE.Vector3(0.10, 0.55, 0),
    fov: 34,
  },
  leg_r: {
    position: new THREE.Vector3(-0.22, 0.55, 2.8),
    lookAt: new THREE.Vector3(-0.10, 0.55, 0),
    fov: 34,
  },
  foot_l: {
    position: new THREE.Vector3(0.22, 0.15, 2.4),
    lookAt: new THREE.Vector3(0.07, 0.05, 0),
    fov: 30,
  },
  foot_r: {
    position: new THREE.Vector3(-0.22, 0.15, 2.4),
    lookAt: new THREE.Vector3(-0.07, 0.05, 0),
    fov: 30,
  },
};

export function getCameraPositions(bodyType: BodyType | null): Record<string, CameraTarget> {
  if (bodyType === 'female') {
    return FEMALE_CAMERA_POSITIONS;
  }
  return MALE_CAMERA_POSITIONS;
}

export const CAMERA_POSITIONS = MALE_CAMERA_POSITIONS;
