import * as THREE from 'three';

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

export const CAMERA_POSITIONS: Record<string, CameraTarget> = {
  full: {
    position: new THREE.Vector3(0, 0.8, 5.0),
    lookAt: new THREE.Vector3(0, 0.8, 0),
    fov: 35,
  },
  head: {
    position: new THREE.Vector3(0, 1.8, 2.5),
    lookAt: new THREE.Vector3(0, 1.65, 0),
    fov: 30,
  },
  throat: {
    position: new THREE.Vector3(0, 1.5, 2.2),
    lookAt: new THREE.Vector3(0, 1.35, 0),
    fov: 30,
  },
  chest: {
    position: new THREE.Vector3(0, 1.2, 2.8),
    lookAt: new THREE.Vector3(0, 1.1, 0),
    fov: 32,
  },
  stomach: {
    position: new THREE.Vector3(0, 0.9, 2.8),
    lookAt: new THREE.Vector3(0, 0.8, 0),
    fov: 32,
  },
  back: {
    position: new THREE.Vector3(0, 1.0, -3.0),
    lookAt: new THREE.Vector3(0, 1.0, 0),
    fov: 32,
  },
  arm_l: {
    position: new THREE.Vector3(-1.2, 1.2, 2.5),
    lookAt: new THREE.Vector3(-0.5, 1.1, 0),
    fov: 30,
  },
  arm_r: {
    position: new THREE.Vector3(1.2, 1.2, 2.5),
    lookAt: new THREE.Vector3(0.5, 1.1, 0),
    fov: 30,
  },
  hand_l: {
    position: new THREE.Vector3(-1.3, 0.8, 2.0),
    lookAt: new THREE.Vector3(-0.7, 0.75, 0),
    fov: 28,
  },
  hand_r: {
    position: new THREE.Vector3(1.3, 0.8, 2.0),
    lookAt: new THREE.Vector3(0.7, 0.75, 0),
    fov: 28,
  },
  leg_l: {
    position: new THREE.Vector3(-0.6, 0.3, 3.0),
    lookAt: new THREE.Vector3(-0.2, 0.3, 0),
    fov: 32,
  },
  leg_r: {
    position: new THREE.Vector3(0.6, 0.3, 3.0),
    lookAt: new THREE.Vector3(0.2, 0.3, 0),
    fov: 32,
  },
  foot_l: {
    position: new THREE.Vector3(-0.5, 0.1, 2.0),
    lookAt: new THREE.Vector3(-0.2, -0.05, 0.05),
    fov: 28,
  },
  foot_r: {
    position: new THREE.Vector3(0.5, 0.1, 2.0),
    lookAt: new THREE.Vector3(0.2, -0.05, 0.05),
    fov: 28,
  },
};
