import * as THREE from 'three';
import { type ZoneId, type BodyType } from '@/lib/store/checkinStore';

export interface ZoneBounds {
  id: ZoneId;
  minY: number;
  maxY: number;
  center: [number, number, number];
}

// ── PER-ZONE SPHERE RADIUS (Scaled according to muscle/body part surface area) ──
export const ZONE_SPHERE_RADIUS: Record<ZoneId, number> = {
  head: 0.10,
  throat: 0.05,
  shoulder_l: 0.09,
  shoulder_r: 0.09,
  chest: 0.15,
  stomach: 0.14,
  back: 0.16,
  hips: 0.14,
  arm_l: 0.09,
  arm_r: 0.09,
  hand_l: 0.065,
  hand_r: 0.065,
  leg_l: 0.12,
  leg_r: 0.12,
  foot_l: 0.065,
  foot_r: 0.065,
};

// ── MALE ZONE CENTERS (Standardized World Space: Feet Y=0, Head Y=1.75) ──
export const MALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.643, 0.02],
  throat: [0, 1.494, 0.02],
  shoulder_l: [0.260, 1.380, 0.0],
  shoulder_r: [-0.260, 1.380, 0.0],
  chest: [0, 1.280, 0.08],
  stomach: [0, 1.080, 0.05],
  back: [0, 1.235, -0.08],
  hips: [0, 0.894, -0.08],
  arm_l: [0.280, 1.120, 0.0],
  arm_r: [-0.280, 1.120, 0.0],
  hand_l: [0.310, 0.840, 0.0],
  hand_r: [-0.310, 0.840, 0.0],
  leg_l: [0.100, 0.520, 0.02],
  leg_r: [-0.100, 0.520, 0.02],
  foot_l: [0.100, 0.080, 0.06],
  foot_r: [-0.100, 0.080, 0.06],
};

// ── FEMALE ZONE CENTERS (Standardized World Space: Feet Y=0, Head Y=1.75) ──
export const FEMALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.620, 0.04],
  throat: [0, 1.499, 0.00],
  shoulder_l: [0.210, 1.340, 0.0],
  shoulder_r: [-0.210, 1.340, 0.0],
  chest: [0, 1.280, 0.08],
  stomach: [0, 1.083, 0.04],
  back: [0, 1.280, -0.06],
  hips: [0, 0.895, -0.06],
  arm_l: [0.252, 1.102, -0.02],
  arm_r: [-0.252, 1.100, -0.02],
  hand_l: [0.326, 0.872, -0.02],
  hand_r: [-0.326, 0.872, -0.02],
  leg_l: [0.094, 0.534, 0.01],
  leg_r: [-0.095, 0.530, 0.01],
  foot_l: [0.074, 0.048, 0.05],
  foot_r: [-0.074, 0.048, 0.05],
};

export function getZoneCenter(zoneId: ZoneId, bodyType: BodyType | null): [number, number, number] {
  if (bodyType === 'female') {
    return FEMALE_ZONE_CENTERS[zoneId];
  }
  return MALE_ZONE_CENTERS[zoneId];
}

/**
 * Maps a world raycast hit point (Y 0..1.75) to exact body ZoneId.
 * - Front View (Z >= -0.02): Torso maps exclusively to Chest (Y >= 1.20) or Stomach (Y < 1.20).
 * - Rear View (Z < -0.02): Torso maps exclusively to Back (Y >= 0.98) or Hips & Glutes (Y < 0.98).
 */
export function hitToZone(point: THREE.Vector3, bodyType: BodyType | null): ZoneId {
  const { x, y, z } = point;
  const isFemale = bodyType === 'female';
  const isRear = z < -0.02;

  // 1. Head (Y >= 1.56)
  if (y >= 1.56) {
    return 'head';
  }

  // 2. Throat / Neck (Y: 1.44 -> 1.56)
  if (y >= 1.44 && y < 1.56) {
    return 'throat';
  }

  // 3. Shoulders (Y: 1.32 -> 1.44)
  const shoulderX = isFemale ? 0.18 : 0.20;
  if (y >= 1.32 && y < 1.44) {
    if (x > shoulderX) return 'shoulder_l';
    if (x < -shoulderX) return 'shoulder_r';
    return isRear ? 'back' : 'chest';
  }

  // 4. Chest vs Back & Upper Arms (Y: 1.18 -> 1.32)
  const armX = isFemale ? 0.18 : 0.22;
  if (y >= 1.18 && y < 1.32) {
    if (x > armX) return 'arm_l';
    if (x < -armX) return 'arm_r';
    return isRear ? 'back' : 'chest';
  }

  // 5. Stomach vs Back & Arms (Y: 0.98 -> 1.18)
  if (y >= 0.98 && y < 1.18) {
    if (x > armX) return 'arm_l';
    if (x < -armX) return 'arm_r';
    return isRear ? 'back' : 'stomach';
  }

  // 6. Stomach vs Hips & Glutes & Hands (Y: 0.78 -> 0.98)
  const handX = isFemale ? 0.18 : 0.22;
  if (y >= 0.78 && y < 0.98) {
    if (x > handX) return 'hand_l';
    if (x < -handX) return 'hand_r';
    return isRear ? 'hips' : 'stomach';
  }

  // 7. Legs (Y: 0.16 -> 0.78)
  if (y >= 0.16 && y < 0.78) {
    return x >= 0 ? 'leg_l' : 'leg_r';
  }

  // 8. Feet (Y: 0.00 -> 0.16)
  return x >= 0 ? 'foot_l' : 'foot_r';
}

/**
 * Standardizes raw GLB models directly into world coordinates:
 * - Feet sit at Y=0.00
 * - Head sits at Y=1.75
 * - Centered at X=0.00, Z=0.00
 */
export function normalizeGLBScene(scene: THREE.Object3D, targetHeight = 1.75) {
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = size.y > 0 ? targetHeight / size.y : 1;

  scene.scale.set(scale, scale, scale);
  scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  scene.updateMatrixWorld(true);
}
