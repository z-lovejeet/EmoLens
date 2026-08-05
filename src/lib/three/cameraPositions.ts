import * as THREE from 'three';

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

export const CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.8, 4.2),
    lookAt: new THREE.Vector3(0, 0.8, 0),
    fov: 40,
  },
  head: {
    position: new THREE.Vector3(0, 1.75, 2.0),
    lookAt: new THREE.Vector3(0, 1.65, 0),
    fov: 30,
  },
  throat: {
    position: new THREE.Vector3(0.3, 1.5, 1.8),
    lookAt: new THREE.Vector3(0, 1.42, 0),
    fov: 28,
  },
  shoulder_l: {
    position: new THREE.Vector3(-1.0, 1.45, 2.2),
    lookAt: new THREE.Vector3(-0.35, 1.35, 0),
    fov: 30,
  },
  shoulder_r: {
    position: new THREE.Vector3(1.0, 1.45, 2.2),
    lookAt: new THREE.Vector3(0.35, 1.35, 0),
    fov: 30,
  },
  chest: {
    position: new THREE.Vector3(0, 1.15, 2.4),
    lookAt: new THREE.Vector3(0, 1.1, 0),
    fov: 32,
  },
  stomach: {
    position: new THREE.Vector3(0, 0.85, 2.4),
    lookAt: new THREE.Vector3(0, 0.82, 0),
    fov: 32,
  },
  back: {
    position: new THREE.Vector3(0, 1.1, -2.8),
    lookAt: new THREE.Vector3(0, 1.05, 0),
    fov: 32,
  },
  hips: {
    position: new THREE.Vector3(0, 0.65, -2.5),
    lookAt: new THREE.Vector3(0, 0.62, 0),
    fov: 32,
  },
  arm_l: {
    position: new THREE.Vector3(-1.4, 1.05, 2.0),
    lookAt: new THREE.Vector3(-0.52, 0.98, 0),
    fov: 30,
  },
  arm_r: {
    position: new THREE.Vector3(1.4, 1.05, 2.0),
    lookAt: new THREE.Vector3(0.52, 0.98, 0),
    fov: 30,
  },
  hand_l: {
    position: new THREE.Vector3(-1.2, 0.72, 1.8),
    lookAt: new THREE.Vector3(-0.58, 0.68, 0),
    fov: 28,
  },
  hand_r: {
    position: new THREE.Vector3(1.2, 0.72, 1.8),
    lookAt: new THREE.Vector3(0.58, 0.68, 0),
    fov: 28,
  },
  leg_l: {
    position: new THREE.Vector3(-0.5, 0.25, 2.8),
    lookAt: new THREE.Vector3(-0.12, 0.25, 0),
    fov: 32,
  },
  leg_r: {
    position: new THREE.Vector3(0.5, 0.25, 2.8),
    lookAt: new THREE.Vector3(0.12, 0.25, 0),
    fov: 32,
  },
  foot_l: {
    position: new THREE.Vector3(-0.4, 0.02, 1.8),
    lookAt: new THREE.Vector3(-0.12, -0.04, 0.04),
    fov: 26,
  },
  foot_r: {
    position: new THREE.Vector3(0.4, 0.02, 1.8),
    lookAt: new THREE.Vector3(0.12, -0.04, 0.04),
    fov: 26,
  },
};
