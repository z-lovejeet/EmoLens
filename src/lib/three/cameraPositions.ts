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
    lookAt: new THREE.Vector3(0.21, 1.38, 0),
    fov: 34,
  },
  shoulder_r: {
    position: new THREE.Vector3(-0.4, 1.38, 2.6),
    lookAt: new THREE.Vector3(-0.21, 1.38, 0),
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
  upper_arm_l: {
    position: new THREE.Vector3(0.45, 1.24, 2.6),
    lookAt: new THREE.Vector3(0.23, 1.24, 0),
    fov: 32,
  },
  upper_arm_r: {
    position: new THREE.Vector3(-0.45, 1.24, 2.6),
    lookAt: new THREE.Vector3(-0.23, 1.24, 0),
    fov: 32,
  },
  upper_arm_l_rear: {
    position: new THREE.Vector3(0.45, 1.24, -2.6),
    lookAt: new THREE.Vector3(0.23, 1.24, 0),
    fov: 32,
  },
  upper_arm_r_rear: {
    position: new THREE.Vector3(-0.45, 1.24, -2.6),
    lookAt: new THREE.Vector3(-0.23, 1.24, 0),
    fov: 32,
  },
  elbow_l: {
    position: new THREE.Vector3(0.45, 1.15, 2.5),
    lookAt: new THREE.Vector3(0.25, 1.15, 0),
    fov: 32,
  },
  elbow_r: {
    position: new THREE.Vector3(-0.45, 1.15, 2.5),
    lookAt: new THREE.Vector3(-0.25, 1.15, 0),
    fov: 32,
  },
  elbow_l_rear: {
    position: new THREE.Vector3(0.45, 1.15, -2.5),
    lookAt: new THREE.Vector3(0.25, 1.15, 0),
    fov: 32,
  },
  elbow_r_rear: {
    position: new THREE.Vector3(-0.45, 1.15, -2.5),
    lookAt: new THREE.Vector3(-0.25, 1.15, 0),
    fov: 32,
  },
  forearm_l: {
    position: new THREE.Vector3(0.48, 1.00, 2.6),
    lookAt: new THREE.Vector3(0.28, 1.00, 0),
    fov: 32,
  },
  forearm_r: {
    position: new THREE.Vector3(-0.48, 1.00, 2.6),
    lookAt: new THREE.Vector3(-0.28, 1.00, 0),
    fov: 32,
  },
  forearm_l_rear: {
    position: new THREE.Vector3(0.48, 1.00, -2.6),
    lookAt: new THREE.Vector3(0.28, 1.00, 0),
    fov: 32,
  },
  forearm_r_rear: {
    position: new THREE.Vector3(-0.48, 1.00, -2.6),
    lookAt: new THREE.Vector3(-0.28, 1.00, 0),
    fov: 32,
  },
  hand_l: {
    position: new THREE.Vector3(0.5, 0.83, 2.6),
    lookAt: new THREE.Vector3(0.32, 0.83, 0),
    fov: 34,
  },
  hand_r: {
    position: new THREE.Vector3(-0.5, 0.83, 2.6),
    lookAt: new THREE.Vector3(-0.32, 0.83, 0),
    fov: 34,
  },
  thigh_l: {
    position: new THREE.Vector3(0.25, 0.72, 2.8),
    lookAt: new THREE.Vector3(0.10, 0.72, 0),
    fov: 32,
  },
  thigh_r: {
    position: new THREE.Vector3(-0.25, 0.72, 2.8),
    lookAt: new THREE.Vector3(-0.10, 0.72, 0),
    fov: 32,
  },
  hamstring_l: {
    position: new THREE.Vector3(0.25, 0.70, -2.8),
    lookAt: new THREE.Vector3(0.10, 0.70, 0),
    fov: 32,
  },
  hamstring_r: {
    position: new THREE.Vector3(-0.25, 0.70, -2.8),
    lookAt: new THREE.Vector3(-0.10, 0.70, 0),
    fov: 32,
  },
  knee_l: {
    position: new THREE.Vector3(0.22, 0.48, 2.4),
    lookAt: new THREE.Vector3(0.095, 0.48, 0),
    fov: 30,
  },
  knee_r: {
    position: new THREE.Vector3(-0.22, 0.48, 2.4),
    lookAt: new THREE.Vector3(-0.095, 0.48, 0),
    fov: 30,
  },
  calf_l: {
    position: new THREE.Vector3(0.22, 0.28, 2.6),
    lookAt: new THREE.Vector3(0.095, 0.28, 0),
    fov: 32,
  },
  calf_r: {
    position: new THREE.Vector3(-0.22, 0.28, 2.6),
    lookAt: new THREE.Vector3(-0.095, 0.28, 0),
    fov: 32,
  },
  calf_l_rear: {
    position: new THREE.Vector3(0.22, 0.28, -2.6),
    lookAt: new THREE.Vector3(0.095, 0.28, 0),
    fov: 32,
  },
  calf_r_rear: {
    position: new THREE.Vector3(-0.22, 0.28, -2.6),
    lookAt: new THREE.Vector3(-0.095, 0.28, 0),
    fov: 32,
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

// ── FEMALE CAMERA RIG (Calibrated precisely to female geometry centers) ──
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
    position: new THREE.Vector3(0, 1.50, 2.4),
    lookAt: new THREE.Vector3(0, 1.50, 0),
    fov: 32,
  },
  shoulder_l: {
    position: new THREE.Vector3(0.35, 1.38, 2.6),
    lookAt: new THREE.Vector3(0.17, 1.38, 0),
    fov: 34,
  },
  shoulder_r: {
    position: new THREE.Vector3(-0.35, 1.38, 2.6),
    lookAt: new THREE.Vector3(-0.17, 1.38, 0),
    fov: 34,
  },
  chest: {
    position: new THREE.Vector3(0, 1.28, 2.8),
    lookAt: new THREE.Vector3(0, 1.28, 0),
    fov: 34,
  },
  stomach: {
    position: new THREE.Vector3(0, 1.08, 2.8),
    lookAt: new THREE.Vector3(0, 1.08, 0),
    fov: 34,
  },
  back: {
    position: new THREE.Vector3(0, 1.28, -2.8),
    lookAt: new THREE.Vector3(0, 1.28, 0),
    fov: 34,
  },
  hips: {
    position: new THREE.Vector3(0, 0.89, -2.8),
    lookAt: new THREE.Vector3(0, 0.89, 0),
    fov: 34,
  },
  upper_arm_l: {
    position: new THREE.Vector3(0.40, 1.24, 2.6),
    lookAt: new THREE.Vector3(0.19, 1.24, 0),
    fov: 32,
  },
  upper_arm_r: {
    position: new THREE.Vector3(-0.40, 1.24, 2.6),
    lookAt: new THREE.Vector3(-0.19, 1.24, 0),
    fov: 32,
  },
  upper_arm_l_rear: {
    position: new THREE.Vector3(0.40, 1.24, -2.6),
    lookAt: new THREE.Vector3(0.19, 1.24, 0),
    fov: 32,
  },
  upper_arm_r_rear: {
    position: new THREE.Vector3(-0.40, 1.24, -2.6),
    lookAt: new THREE.Vector3(-0.19, 1.24, 0),
    fov: 32,
  },
  elbow_l: {
    position: new THREE.Vector3(0.42, 1.15, 2.5),
    lookAt: new THREE.Vector3(0.21, 1.15, 0),
    fov: 32,
  },
  elbow_r: {
    position: new THREE.Vector3(-0.42, 1.15, 2.5),
    lookAt: new THREE.Vector3(-0.21, 1.15, 0),
    fov: 32,
  },
  elbow_l_rear: {
    position: new THREE.Vector3(0.42, 1.15, -2.5),
    lookAt: new THREE.Vector3(0.21, 1.15, 0),
    fov: 32,
  },
  elbow_r_rear: {
    position: new THREE.Vector3(-0.42, 1.15, -2.5),
    lookAt: new THREE.Vector3(-0.21, 1.15, 0),
    fov: 32,
  },
  forearm_l: {
    position: new THREE.Vector3(0.44, 1.00, 2.6),
    lookAt: new THREE.Vector3(0.27, 1.00, 0),
    fov: 32,
  },
  forearm_r: {
    position: new THREE.Vector3(-0.44, 1.00, 2.6),
    lookAt: new THREE.Vector3(-0.27, 1.00, 0),
    fov: 32,
  },
  forearm_l_rear: {
    position: new THREE.Vector3(0.44, 1.00, -2.6),
    lookAt: new THREE.Vector3(0.27, 1.00, 0),
    fov: 32,
  },
  forearm_r_rear: {
    position: new THREE.Vector3(-0.44, 1.00, -2.6),
    lookAt: new THREE.Vector3(-0.27, 1.00, 0),
    fov: 32,
  },
  hand_l: {
    position: new THREE.Vector3(0.48, 0.83, 2.6),
    lookAt: new THREE.Vector3(0.33, 0.83, 0),
    fov: 34,
  },
  hand_r: {
    position: new THREE.Vector3(-0.48, 0.83, 2.6),
    lookAt: new THREE.Vector3(-0.33, 0.83, 0),
    fov: 34,
  },
  thigh_l: {
    position: new THREE.Vector3(0.22, 0.72, 2.8),
    lookAt: new THREE.Vector3(0.09, 0.72, 0),
    fov: 32,
  },
  thigh_r: {
    position: new THREE.Vector3(-0.22, 0.72, 2.8),
    lookAt: new THREE.Vector3(-0.09, 0.72, 0),
    fov: 32,
  },
  hamstring_l: {
    position: new THREE.Vector3(0.22, 0.70, -2.8),
    lookAt: new THREE.Vector3(0.09, 0.70, 0),
    fov: 32,
  },
  hamstring_r: {
    position: new THREE.Vector3(-0.22, 0.70, -2.8),
    lookAt: new THREE.Vector3(-0.09, 0.70, 0),
    fov: 32,
  },
  knee_l: {
    position: new THREE.Vector3(0.20, 0.48, 2.4),
    lookAt: new THREE.Vector3(0.085, 0.48, 0),
    fov: 30,
  },
  knee_r: {
    position: new THREE.Vector3(-0.20, 0.48, 2.4),
    lookAt: new THREE.Vector3(-0.085, 0.48, 0),
    fov: 30,
  },
  calf_l: {
    position: new THREE.Vector3(0.20, 0.28, 2.6),
    lookAt: new THREE.Vector3(0.085, 0.28, 0),
    fov: 32,
  },
  calf_r: {
    position: new THREE.Vector3(-0.20, 0.28, 2.6),
    lookAt: new THREE.Vector3(-0.085, 0.28, 0),
    fov: 32,
  },
  calf_l_rear: {
    position: new THREE.Vector3(0.20, 0.28, -2.6),
    lookAt: new THREE.Vector3(0.085, 0.28, 0),
    fov: 32,
  },
  calf_r_rear: {
    position: new THREE.Vector3(-0.20, 0.28, -2.6),
    lookAt: new THREE.Vector3(-0.085, 0.28, 0),
    fov: 32,
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
