import * as THREE from 'three';
import { type ZoneId, type BodyType } from '@/lib/store/checkinStore';

export interface ZoneBounds {
  id: ZoneId;
  minY: number;
  maxY: number;
  center: [number, number, number];
}

// ── PER-ZONE SPHERE RADIUS (Tightly scaled to clean joint/muscle sizes) ──
export const ZONE_SPHERE_RADIUS: Record<ZoneId, number> = {
  head: 0.075,
  throat: 0.040,
  shoulder_l: 0.055,
  shoulder_r: 0.055,
  chest: 0.100,
  stomach: 0.090,
  back: 0.110,
  hips: 0.100,
  arm_l: 0.060,
  arm_r: 0.060,
  hand_l: 0.045,
  hand_r: 0.045,
  leg_l: 0.080,
  leg_r: 0.080,
  foot_l: 0.045,
  foot_r: 0.045,
};

// ── MALE ZONE CENTERS (Measured directly from male mesh geometry) ──
export const MALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.643, 0.02],
  throat: [0, 1.494, 0.02],
  shoulder_l: [0.210, 1.380, 0.02],  // Model Left (Viewer Right)
  shoulder_r: [-0.210, 1.380, 0.02], // Model Right (Viewer Left)
  chest: [0, 1.300, 0.08],
  stomach: [0, 1.080, 0.05],
  back: [0, 1.235, -0.08],
  hips: [0, 0.894, -0.08],
  arm_l: [0.260, 1.120, 0.0],
  arm_r: [-0.260, 1.120, 0.0],
  hand_l: [0.290, 0.840, 0.0],
  hand_r: [-0.290, 0.840, 0.0],
  leg_l: [0.100, 0.520, 0.02],
  leg_r: [-0.100, 0.520, 0.02],
  foot_l: [0.100, 0.080, 0.06],
  foot_r: [-0.100, 0.080, 0.06],
};

// ── FEMALE ZONE CENTERS (Measured directly from female mesh geometry) ──
export const FEMALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.620, 0.04],
  throat: [0, 1.499, 0.00],
  shoulder_l: [0.170, 1.380, 0.02],  // Model Left (Viewer Right: +X)
  shoulder_r: [-0.170, 1.380, 0.02], // Model Right (Viewer Left: -X)
  chest: [0, 1.280, 0.08],
  stomach: [0, 1.083, 0.04],
  back: [0, 1.280, -0.06],
  hips: [0, 0.895, -0.06],
  arm_l: [0.220, 1.100, -0.01],
  arm_r: [-0.220, 1.100, -0.01],
  hand_l: [0.280, 0.850, -0.01],
  hand_r: [-0.280, 0.850, -0.01],
  leg_l: [0.090, 0.530, 0.01],
  leg_r: [-0.090, 0.530, 0.01],
  foot_l: [0.075, 0.050, 0.05],
  foot_r: [-0.075, 0.050, 0.05],
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

  // 3. Shoulders (Y: 1.30 -> 1.46)
  const shoulderX = isFemale ? 0.12 : 0.14;
  if (y >= 1.30 && y < 1.46) {
    if (x > shoulderX) return 'shoulder_l';
    if (x < -shoulderX) return 'shoulder_r';
    return isRear ? 'back' : 'chest';
  }

  // 4. Chest vs Back & Upper Arms (Y: 1.18 -> 1.30)
  const armX = isFemale ? 0.17 : 0.20;
  if (y >= 1.18 && y < 1.30) {
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
  const handX = isFemale ? 0.17 : 0.20;
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
