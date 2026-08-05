import * as THREE from 'three';
import { type BodyType } from '@/lib/store/checkinStore';

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

// ── MALE CAMERA RIG (Smooth, beautifully framed zoom targets) ──
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
    position: new THREE.Vector3(-0.4, 1.38, 2.6),
    lookAt: new THREE.Vector3(-0.30, 1.38, 0),
    fov: 34,
  },
  shoulder_r: {
    position: new THREE.Vector3(0.4, 1.38, 2.6),
    lookAt: new THREE.Vector3(0.30, 1.38, 0),
    fov: 34,
  },
  chest: {
    position: new THREE.Vector3(0, 1.25, 2.8),
    lookAt: new THREE.Vector3(0, 1.25, 0),
    fov: 34,
  },
  stomach: {
    position: new THREE.Vector3(0, 1.05, 2.8),
    lookAt: new THREE.Vector3(0, 1.05, 0),
    fov: 34,
  },
  back: {
    position: new THREE.Vector3(0, 1.15, -2.8),
    lookAt: new THREE.Vector3(0, 1.15, 0),
    fov: 34,
  },
  hips: {
    position: new THREE.Vector3(0, 0.88, -2.8),
    lookAt: new THREE.Vector3(0, 0.88, 0),
    fov: 34,
  },
  arm_l: {
    position: new THREE.Vector3(-0.5, 1.12, 2.6),
    lookAt: new THREE.Vector3(-0.34, 1.12, 0),
    fov: 34,
  },
  arm_r: {
    position: new THREE.Vector3(0.5, 1.12, 2.6),
    lookAt: new THREE.Vector3(0.34, 1.12, 0),
    fov: 34,
  },
  hand_l: {
    position: new THREE.Vector3(-0.5, 0.88, 2.6),
    lookAt: new THREE.Vector3(-0.36, 0.88, 0),
    fov: 34,
  },
  hand_r: {
    position: new THREE.Vector3(0.5, 0.88, 2.6),
    lookAt: new THREE.Vector3(0.36, 0.88, 0),
    fov: 34,
  },
  leg_l: {
    position: new THREE.Vector3(-0.25, 0.46, 2.8),
    lookAt: new THREE.Vector3(-0.15, 0.46, 0),
    fov: 34,
  },
  leg_r: {
    position: new THREE.Vector3(0.25, 0.46, 2.8),
    lookAt: new THREE.Vector3(0.15, 0.46, 0),
    fov: 34,
  },
  foot_l: {
    position: new THREE.Vector3(-0.25, 0.15, 2.4),
    lookAt: new THREE.Vector3(-0.15, 0.06, 0),
    fov: 30,
  },
  foot_r: {
    position: new THREE.Vector3(0.25, 0.15, 2.4),
    lookAt: new THREE.Vector3(0.15, 0.06, 0),
    fov: 30,
  },
};

// ── FEMALE CAMERA RIG (Smooth, beautifully framed zoom targets) ──
export const FEMALE_CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.88, 4.2),
    lookAt: new THREE.Vector3(0, 0.88, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.63, 2.5),
    lookAt: new THREE.Vector3(0, 1.63, 0),
    fov: 32,
  },
  throat: {
    position: new THREE.Vector3(0, 1.46, 2.4),
    lookAt: new THREE.Vector3(0, 1.46, 0),
    fov: 32,
  },
  shoulder_l: {
    position: new THREE.Vector3(-0.35, 1.35, 2.6),
    lookAt: new THREE.Vector3(-0.26, 1.35, 0),
    fov: 34,
  },
  shoulder_r: {
    position: new THREE.Vector3(0.35, 1.35, 2.6),
    lookAt: new THREE.Vector3(0.26, 1.35, 0),
    fov: 34,
  },
  chest: {
    position: new THREE.Vector3(0, 1.22, 2.8),
    lookAt: new THREE.Vector3(0, 1.22, 0),
    fov: 34,
  },
  stomach: {
    position: new THREE.Vector3(0, 1.02, 2.8),
    lookAt: new THREE.Vector3(0, 1.02, 0),
    fov: 34,
  },
  back: {
    position: new THREE.Vector3(0, 1.12, -2.8),
    lookAt: new THREE.Vector3(0, 1.12, 0),
    fov: 34,
  },
  hips: {
    position: new THREE.Vector3(0, 0.84, -2.8),
    lookAt: new THREE.Vector3(0, 0.84, 0),
    fov: 34,
  },
  arm_l: {
    position: new THREE.Vector3(-0.45, 1.08, 2.6),
    lookAt: new THREE.Vector3(-0.31, 1.08, 0),
    fov: 34,
  },
  arm_r: {
    position: new THREE.Vector3(0.45, 1.08, 2.6),
    lookAt: new THREE.Vector3(0.31, 1.08, 0),
    fov: 34,
  },
  hand_l: {
    position: new THREE.Vector3(-0.45, 0.82, 2.6),
    lookAt: new THREE.Vector3(-0.34, 0.82, 0),
    fov: 34,
  },
  hand_r: {
    position: new THREE.Vector3(0.45, 0.82, 2.6),
    lookAt: new THREE.Vector3(0.34, 0.82, 0),
    fov: 34,
  },
  leg_l: {
    position: new THREE.Vector3(-0.22, 0.42, 2.8),
    lookAt: new THREE.Vector3(-0.14, 0.42, 0),
    fov: 34,
  },
  leg_r: {
    position: new THREE.Vector3(0.22, 0.42, 2.8),
    lookAt: new THREE.Vector3(0.14, 0.42, 0),
    fov: 34,
  },
  foot_l: {
    position: new THREE.Vector3(-0.22, 0.15, 2.4),
    lookAt: new THREE.Vector3(-0.14, 0.06, 0),
    fov: 30,
  },
  foot_r: {
    position: new THREE.Vector3(0.22, 0.15, 2.4),
    lookAt: new THREE.Vector3(0.14, 0.06, 0),
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
