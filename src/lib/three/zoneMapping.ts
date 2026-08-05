import * as THREE from 'three';
import { type ZoneId, type BodyType } from '@/lib/store/checkinStore';

export interface ZoneBounds {
  id: ZoneId;
  minY: number;
  maxY: number;
  center: [number, number, number];
}

// ── MALE ZONE CENTERS (Precisely aligned to 1.75 height upright male GLB) ──
export const MALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.64, 0.02],
  throat: [0, 1.46, 0.02],
  shoulder_l: [-0.30, 1.34, 0.0],
  shoulder_r: [0.30, 1.34, 0.0],
  chest: [0, 1.20, 0.10],
  stomach: [0, 1.02, 0.10],
  back: [0, 1.15, -0.10],
  hips: [0, 0.84, 0.06],
  arm_l: [-0.34, 1.10, 0.0],
  arm_r: [0.34, 1.10, 0.0],
  hand_l: [-0.36, 0.78, 0.0],
  hand_r: [0.36, 0.78, 0.0],
  leg_l: [-0.15, 0.45, 0.03],
  leg_r: [0.15, 0.45, 0.03],
  foot_l: [-0.15, 0.07, 0.06],
  foot_r: [0.15, 0.07, 0.06],
};

// ── FEMALE ZONE CENTERS (Precisely aligned to 1.75 height upright female GLB) ──
export const FEMALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.63, 0.02],
  throat: [0, 1.45, 0.02],
  shoulder_l: [-0.28, 1.32, 0.0],
  shoulder_r: [0.28, 1.32, 0.0],
  chest: [0, 1.16, 0.12],
  stomach: [0, 0.98, 0.10],
  back: [0, 1.12, -0.10],
  hips: [0, 0.80, 0.06],
  arm_l: [-0.32, 1.05, 0.0],
  arm_r: [0.32, 1.05, 0.0],
  hand_l: [-0.34, 0.74, 0.0],
  hand_r: [0.34, 0.74, 0.0],
  leg_l: [-0.14, 0.42, 0.03],
  leg_r: [0.14, 0.42, 0.03],
  foot_l: [-0.14, 0.07, 0.06],
  foot_r: [0.14, 0.07, 0.06],
};

/**
 * Returns gender-specific zone centers for label/badge/ring placement
 */
export function getZoneCenter(zoneId: ZoneId, bodyType: BodyType | null): [number, number, number] {
  if (bodyType === 'female') {
    return FEMALE_ZONE_CENTERS[zoneId];
  }
  return MALE_ZONE_CENTERS[zoneId];
}

/**
 * Maps a 3D hit point (in normalized model space: Y 0..1.75, upright Y-up) to a specific body ZoneId
 */
export function hitToZone(point: THREE.Vector3, bodyType: BodyType | null): ZoneId {
  const { x, y, z } = point;
  const isFemale = bodyType === 'female';

  // 1. Head (Y: 1.52 -> 1.75)
  const headMinY = isFemale ? 1.50 : 1.52;
  if (y >= headMinY) {
    return 'head';
  }

  // 2. Throat / Neck (Y: 1.40 -> 1.52)
  const throatMinY = isFemale ? 1.38 : 1.40;
  if (y >= throatMinY && y < headMinY) {
    return 'throat';
  }

  // 3. Shoulders / Upper Torso (Y: 1.28 -> 1.40)
  const shoulderMinY = isFemale ? 1.25 : 1.28;
  const shoulderX = isFemale ? 0.22 : 0.24;
  if (y >= shoulderMinY && y < throatMinY) {
    if (x < -shoulderX) return 'shoulder_l';
    if (x > shoulderX) return 'shoulder_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // 4. Chest / Upper Arms (Y: 1.12 -> 1.28)
  const chestMinY = isFemale ? 1.08 : 1.12;
  const armX = isFemale ? 0.23 : 0.25;
  if (y >= chestMinY && y < shoulderMinY) {
    if (x < -armX) return 'arm_l';
    if (x > armX) return 'arm_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // 5. Stomach / Mid Back / Arms (Y: 0.92 -> 1.12)
  const stomachMinY = isFemale ? 0.88 : 0.92;
  if (y >= stomachMinY && y < chestMinY) {
    if (x < -armX) return 'arm_l';
    if (x > armX) return 'arm_r';
    return z < -0.02 ? 'back' : 'stomach';
  }

  // 6. Hips / Glutes / Hands (Y: 0.76 -> 0.92)
  const hipsMinY = isFemale ? 0.72 : 0.76;
  const handX = isFemale ? 0.23 : 0.25;
  if (y >= hipsMinY && y < stomachMinY) {
    if (x < -handX) return 'hand_l';
    if (x > handX) return 'hand_r';
    return z < -0.02 ? 'back' : 'hips';
  }

  // 7. Legs (Y: 0.15 -> 0.76)
  const legMinY = isFemale ? 0.14 : 0.15;
  if (y >= legMinY && y < hipsMinY) {
    return x < 0 ? 'leg_l' : 'leg_r';
  }

  // 8. Feet (Y: 0.00 -> 0.15)
  return x < 0 ? 'foot_l' : 'foot_r';
}

/**
 * Normalizes a raw loaded GLB scene:
 * - GLTFLoader automatically handles GLB scene matrix transformations.
 * - Computes clean bounding box on the upright scene.
 * - Scales model to target height (1.75 units).
 * - Shifts model origin so feet sit at Y=0, X=0, Z=0.
 */
export function normalizeGLBScene(scene: THREE.Object3D, targetHeight = 1.75): { scale: number; offset: THREE.Vector3 } {
  // Ensure matrices are up to date
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = size.y > 0 ? targetHeight / size.y : 1;
  const offset = new THREE.Vector3(-center.x * scale, -box.min.y * scale, -center.z * scale);

  return { scale, offset };
}
