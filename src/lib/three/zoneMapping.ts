import * as THREE from 'three';
import { type ZoneId } from '@/lib/store/checkinStore';

export interface ZoneBounds {
  id: ZoneId;
  minY: number;
  maxY: number;
  center: [number, number, number];
}

/**
 * Maps a 3D hit point (in normalized model space where Y ranges from 0 at feet to ~1.75 at head)
 * to a specific body ZoneId based on Y, X, and Z coordinates.
 */
export function hitToZone(point: THREE.Vector3): ZoneId {
  const { x, y, z } = point;

  // Head (top region)
  if (y >= 1.55) {
    return 'head';
  }

  // Throat / Neck
  if (y >= 1.42 && y < 1.55) {
    return 'throat';
  }

  // Upper Torso / Shoulders (y: 1.25 -> 1.42)
  if (y >= 1.25 && y < 1.42) {
    if (x < -0.22) return 'shoulder_l';
    if (x > 0.22) return 'shoulder_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // Mid Torso / Chest / Upper Arms (y: 1.05 -> 1.25)
  if (y >= 1.05 && y < 1.25) {
    if (x < -0.26) return 'arm_l';
    if (x > 0.26) return 'arm_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // Lower Torso / Stomach / Forearms (y: 0.85 -> 1.05)
  if (y >= 0.85 && y < 1.05) {
    if (x < -0.26) return 'arm_l';
    if (x > 0.26) return 'arm_r';
    return z < -0.02 ? 'back' : 'stomach';
  }

  // Hips / Glutes / Hands (y: 0.70 -> 0.85)
  if (y >= 0.70 && y < 0.85) {
    if (x < -0.26) return 'hand_l';
    if (x > 0.26) return 'hand_r';
    return 'hips';
  }

  // Legs (y: 0.18 -> 0.70)
  if (y >= 0.18 && y < 0.70) {
    return x < 0 ? 'leg_l' : 'leg_r';
  }

  // Feet (y: 0.0 -> 0.18)
  return x < 0 ? 'foot_l' : 'foot_r';
}

/**
 * Returns center world coordinates for each ZoneId (assuming normalized model with height 1.75, bottom at Y=0)
 */
export const ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.65, 0.05],
  throat: [0, 1.48, 0.05],
  shoulder_l: [-0.30, 1.35, 0],
  shoulder_r: [0.30, 1.35, 0],
  chest: [0, 1.15, 0.12],
  stomach: [0, 0.95, 0.12],
  back: [0, 1.15, -0.12],
  hips: [0, 0.78, 0.05],
  arm_l: [-0.35, 1.05, 0],
  arm_r: [0.35, 1.05, 0],
  hand_l: [-0.38, 0.75, 0],
  hand_r: [0.38, 0.75, 0],
  leg_l: [-0.15, 0.44, 0.05],
  leg_r: [0.15, 0.44, 0.05],
  foot_l: [-0.15, 0.08, 0.08],
  foot_r: [0.15, 0.08, 0.08],
};

/**
 * Normalizes a raw loaded GLB scene:
 * - Rotates mesh to Y-up if stored Z-up (e.g. Sketchfab OBJ/GLB exports)
 * - Scales model to target height (1.75 units)
 * - Shifts model origin so feet sit at Y=0, X=0, Z=0
 */
export function normalizeGLBScene(scene: THREE.Object3D, targetHeight = 1.75): { scale: number; offset: THREE.Vector3 } {
  // First compute raw bounding box
  const rawBox = new THREE.Box3().setFromObject(scene);
  const rawSize = new THREE.Vector3();
  rawBox.getSize(rawSize);

  // If Z dimension is the largest, model was exported in Z-up orientation. Rotate to Y-up (-90 deg around X).
  if (rawSize.z > rawSize.y && rawSize.z > rawSize.x) {
    scene.rotation.x = -Math.PI / 2;
    scene.updateMatrixWorld(true);
  }

  // Re-evaluate box after orientation fix
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = size.y > 0 ? targetHeight / size.y : 1;

  // Offset to center X and Z at 0, and align bottom feet at Y=0
  const offset = new THREE.Vector3(-center.x * scale, -box.min.y * scale, -center.z * scale);

  return { scale, offset };
}
