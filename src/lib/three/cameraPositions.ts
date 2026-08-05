import * as THREE from 'three';
import { type BodyType } from '@/lib/store/checkinStore';

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

// ── MALE CAMERA RIG (Broader shoulders, higher chest focal line) ──
export const MALE_CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.82, 4.2),
    lookAt: new THREE.Vector3(0, 0.82, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.78, 1.95),
    lookAt: new THREE.Vector3(0, 1.66, 0),
    fov: 30,
  },
  throat: {
    position: new THREE.Vector3(0.25, 1.52, 1.75),
    lookAt: new THREE.Vector3(0, 1.45, 0),
    fov: 28,
  },
  shoulder_l: {
    position: new THREE.Vector3(-1.15, 1.46, 2.15),
    lookAt: new THREE.Vector3(-0.38, 1.36, 0),
    fov: 30,
  },
  shoulder_r: {
    position: new THREE.Vector3(1.15, 1.46, 2.15),
    lookAt: new THREE.Vector3(0.38, 1.36, 0),
    fov: 30,
  },
  chest: {
    position: new THREE.Vector3(0, 1.18, 2.35),
    lookAt: new THREE.Vector3(0, 1.12, 0),
    fov: 32,
  },
  stomach: {
    position: new THREE.Vector3(0, 0.88, 2.35),
    lookAt: new THREE.Vector3(0, 0.84, 0),
    fov: 32,
  },
  back: {
    position: new THREE.Vector3(0, 1.12, -2.75),
    lookAt: new THREE.Vector3(0, 1.06, 0),
    fov: 32,
  },
  hips: {
    position: new THREE.Vector3(0, 0.68, -2.45),
    lookAt: new THREE.Vector3(0, 0.64, 0),
    fov: 32,
  },
  arm_l: {
    position: new THREE.Vector3(-1.45, 1.08, 1.95),
    lookAt: new THREE.Vector3(-0.55, 1.0, 0),
    fov: 30,
  },
  arm_r: {
    position: new THREE.Vector3(1.45, 1.08, 1.95),
    lookAt: new THREE.Vector3(0.55, 1.0, 0),
    fov: 30,
  },
  hand_l: {
    position: new THREE.Vector3(-1.25, 0.74, 1.75),
    lookAt: new THREE.Vector3(-0.6, 0.7, 0),
    fov: 28,
  },
  hand_r: {
    position: new THREE.Vector3(1.25, 0.74, 1.75),
    lookAt: new THREE.Vector3(0.6, 0.7, 0),
    fov: 28,
  },
  leg_l: {
    position: new THREE.Vector3(-0.52, 0.26, 2.75),
    lookAt: new THREE.Vector3(-0.14, 0.26, 0),
    fov: 32,
  },
  leg_r: {
    position: new THREE.Vector3(0.52, 0.26, 2.75),
    lookAt: new THREE.Vector3(0.14, 0.26, 0),
    fov: 32,
  },
  foot_l: {
    position: new THREE.Vector3(-0.42, 0.02, 1.75),
    lookAt: new THREE.Vector3(-0.14, -0.04, 0.04),
    fov: 26,
  },
  foot_r: {
    position: new THREE.Vector3(0.42, 0.02, 1.75),
    lookAt: new THREE.Vector3(0.14, -0.04, 0.04),
    fov: 26,
  },
};

// ── FEMALE CAMERA RIG (Tailored bust/waist focal lines, hip curve & arm framing) ──
export const FEMALE_CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.8, 4.1),
    lookAt: new THREE.Vector3(0, 0.8, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.74, 1.9),
    lookAt: new THREE.Vector3(0, 1.63, 0),
    fov: 29,
  },
  throat: {
    position: new THREE.Vector3(0.2, 1.48, 1.7),
    lookAt: new THREE.Vector3(0, 1.41, 0),
    fov: 28,
  },
  shoulder_l: {
    position: new THREE.Vector3(-1.0, 1.42, 2.05),
    lookAt: new THREE.Vector3(-0.32, 1.32, 0),
    fov: 29,
  },
  shoulder_r: {
    position: new THREE.Vector3(1.0, 1.42, 2.05),
    lookAt: new THREE.Vector3(0.32, 1.32, 0),
    fov: 29,
  },
  chest: {
    position: new THREE.Vector3(0, 1.12, 2.3),
    lookAt: new THREE.Vector3(0, 1.08, 0),
    fov: 32,
  },
  stomach: {
    position: new THREE.Vector3(0, 0.82, 2.3),
    lookAt: new THREE.Vector3(0, 0.79, 0),
    fov: 32,
  },
  back: {
    position: new THREE.Vector3(0, 1.08, -2.65),
    lookAt: new THREE.Vector3(0, 1.02, 0),
    fov: 32,
  },
  hips: {
    position: new THREE.Vector3(0, 0.62, -2.4),
    lookAt: new THREE.Vector3(0, 0.58, 0),
    fov: 32,
  },
  arm_l: {
    position: new THREE.Vector3(-1.3, 1.02, 1.9),
    lookAt: new THREE.Vector3(-0.46, 0.95, 0),
    fov: 30,
  },
  arm_r: {
    position: new THREE.Vector3(1.3, 1.02, 1.9),
    lookAt: new THREE.Vector3(0.46, 0.95, 0),
    fov: 30,
  },
  hand_l: {
    position: new THREE.Vector3(-1.15, 0.7, 1.7),
    lookAt: new THREE.Vector3(-0.52, 0.65, 0),
    fov: 28,
  },
  hand_r: {
    position: new THREE.Vector3(1.15, 0.7, 1.7),
    lookAt: new THREE.Vector3(0.52, 0.65, 0),
    fov: 28,
  },
  leg_l: {
    position: new THREE.Vector3(-0.46, 0.24, 2.65),
    lookAt: new THREE.Vector3(-0.11, 0.24, 0),
    fov: 32,
  },
  leg_r: {
    position: new THREE.Vector3(0.46, 0.24, 2.65),
    lookAt: new THREE.Vector3(0.11, 0.24, 0),
    fov: 32,
  },
  foot_l: {
    position: new THREE.Vector3(-0.38, 0.02, 1.7),
    lookAt: new THREE.Vector3(-0.11, -0.04, 0.04),
    fov: 26,
  },
  foot_r: {
    position: new THREE.Vector3(0.38, 0.02, 1.7),
    lookAt: new THREE.Vector3(0.11, -0.04, 0.04),
    fov: 26,
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

// Export default map for backwards compatibility
export const CAMERA_POSITIONS = MALE_CAMERA_POSITIONS;
