import * as THREE from 'three';
import { type ZoneId, type BodyType } from '@/lib/store/checkinStore';

export interface ZoneBounds {
  id: ZoneId;
  minY: number;
  maxY: number;
  center: [number, number, number];
}

// ── MALE ZONE CENTERS (Precisely aligned to male model anatomy) ──
export const MALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.64, 0.05],
  throat: [0, 1.48, 0.05],
  shoulder_l: [-0.30, 1.38, 0.02],
  shoulder_r: [0.30, 1.38, 0.02],
  chest: [0, 1.25, 0.10],
  stomach: [0, 1.05, 0.09],
  back: [0, 1.15, -0.10],
  hips: [0, 0.88, 0.08],
  arm_l: [-0.34, 1.12, 0.02],
  arm_r: [0.34, 1.12, 0.02],
  hand_l: [-0.36, 0.88, 0.02],
  hand_r: [0.36, 0.88, 0.02],
  leg_l: [-0.15, 0.46, 0.04],
  leg_r: [0.15, 0.46, 0.04],
  foot_l: [-0.15, 0.06, 0.10],
  foot_r: [0.15, 0.06, 0.10],
};

// ── FEMALE ZONE CENTERS (Precisely aligned to female model anatomy) ──
export const FEMALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.63, 0.05],
  throat: [0, 1.46, 0.05],
  shoulder_l: [-0.26, 1.35, 0.02],
  shoulder_r: [0.26, 1.35, 0.02],
  chest: [0, 1.22, 0.12],
  stomach: [0, 1.02, 0.10],
  back: [0, 1.12, -0.10],
  hips: [0, 0.84, 0.08],
  arm_l: [-0.31, 1.08, 0.02],
  arm_r: [0.31, 1.08, 0.02],
  hand_l: [-0.34, 0.82, 0.02],
  hand_r: [0.34, 0.82, 0.02],
  leg_l: [-0.14, 0.42, 0.04],
  leg_r: [0.14, 0.42, 0.04],
  foot_l: [-0.14, 0.06, 0.10],
  foot_r: [0.14, 0.06, 0.10],
};

export function getZoneCenter(zoneId: ZoneId, bodyType: BodyType | null): [number, number, number] {
  if (bodyType === 'female') {
    return FEMALE_ZONE_CENTERS[zoneId];
  }
  return MALE_ZONE_CENTERS[zoneId];
}

/**
 * Maps a 3D hit point (in normalized space 0..1.75) to exact body ZoneId
 */
export function hitToZone(point: THREE.Vector3, bodyType: BodyType | null): ZoneId {
  const { x, y, z } = point;
  const isFemale = bodyType === 'female';

  // 1. Head (Y: 1.55 -> 1.75)
  if (y >= 1.55) {
    return 'head';
  }

  // 2. Throat / Neck (Y: 1.44 -> 1.55)
  if (y >= 1.44 && y < 1.55) {
    return 'throat';
  }

  // 3. Shoulders / Upper Torso (Y: 1.33 -> 1.44)
  const shoulderX = isFemale ? 0.20 : 0.24;
  if (y >= 1.33 && y < 1.44) {
    if (x < -shoulderX) return 'shoulder_l';
    if (x > shoulderX) return 'shoulder_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // 4. Chest / Upper Arms (Y: 1.18 -> 1.33)
  const armX = isFemale ? 0.22 : 0.25;
  if (y >= 1.18 && y < 1.33) {
    if (x < -armX) return 'arm_l';
    if (x > armX) return 'arm_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // 5. Stomach / Mid Back / Arms (Y: 0.98 -> 1.18)
  if (y >= 0.98 && y < 1.18) {
    if (x < -armX) return 'arm_l';
    if (x > armX) return 'arm_r';
    return z < -0.02 ? 'back' : 'stomach';
  }

  // 6. Hips / Glutes / Hands (Y: 0.80 -> 0.98)
  const handX = isFemale ? 0.22 : 0.25;
  if (y >= 0.80 && y < 0.98) {
    if (x < -handX) return 'hand_l';
    if (x > handX) return 'hand_r';
    return z < -0.02 ? 'back' : 'hips';
  }

  // 7. Legs (Y: 0.18 -> 0.80)
  if (y >= 0.18 && y < 0.80) {
    return x < 0 ? 'leg_l' : 'leg_r';
  }

  // 8. Feet (Y: 0.00 -> 0.18)
  return x < 0 ? 'foot_l' : 'foot_r';
}

export function normalizeGLBScene(scene: THREE.Object3D, targetHeight = 1.75): { scale: number; offset: THREE.Vector3 } {
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
