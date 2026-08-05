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
  shoulder_l: 0.068,
  shoulder_r: 0.068,
  chest: 0.100,
  stomach: 0.090,
  back: 0.110,
  hips: 0.100,
  upper_arm_l: 0.065,
  upper_arm_r: 0.065,
  elbow_l: 0.050,
  elbow_r: 0.050,
  forearm_l: 0.060,
  forearm_r: 0.060,
  hand_l: 0.045,
  hand_r: 0.045,
  thigh_l: 0.095,
  thigh_r: 0.095,
  hamstring_l: 0.095,
  hamstring_r: 0.095,
  knee_l: 0.055,
  knee_r: 0.055,
  calf_l: 0.075,
  calf_r: 0.075,
  foot_l: 0.045,
  foot_r: 0.045,
};

// ── MALE ZONE CENTERS (Measured directly from male mesh geometry) ──
export const MALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.643, 0.06],
  throat: [0, 1.494, 0.02],
  shoulder_l: [0.210, 1.380, 0.02],  // Model Left (Viewer Right)
  shoulder_r: [-0.210, 1.380, 0.02], // Model Right (Viewer Left)
  chest: [0, 1.300, 0.08],
  stomach: [0, 1.080, 0.05],
  back: [0, 1.235, -0.08],
  hips: [0, 0.894, -0.08],
  upper_arm_l: [0.230, 1.240, 0.00],
  upper_arm_r: [-0.230, 1.240, 0.00],
  elbow_l: [0.250, 1.150, 0.00],
  elbow_r: [-0.250, 1.150, 0.00],
  forearm_l: [0.280, 1.000, 0.01],
  forearm_r: [-0.280, 1.000, 0.01],
  hand_l: [0.320, 0.830, 0.0],
  hand_r: [-0.320, 0.830, 0.0],
  thigh_l: [0.100, 0.720, 0.05],
  thigh_r: [-0.100, 0.720, 0.05],
  hamstring_l: [0.100, 0.700, -0.06],
  hamstring_r: [-0.100, 0.700, -0.06],
  knee_l: [0.095, 0.480, 0.05],
  knee_r: [-0.095, 0.480, 0.05],
  calf_l: [0.095, 0.280, 0.03],
  calf_r: [-0.095, 0.280, 0.03],
  foot_l: [0.100, 0.080, 0.06],
  foot_r: [-0.100, 0.080, 0.06],
};

// ── FEMALE ZONE CENTERS (Measured directly from female mesh geometry) ──
export const FEMALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.620, 0.06],
  throat: [0, 1.499, 0.00],
  shoulder_l: [0.170, 1.380, 0.02],  // Model Left (Viewer Right: +X)
  shoulder_r: [-0.170, 1.380, 0.02], // Model Right (Viewer Left: -X)
  chest: [0, 1.280, 0.08],
  stomach: [0, 1.083, 0.04],
  back: [0, 1.280, -0.06],
  hips: [0, 0.895, -0.06],
  upper_arm_l: [0.190, 1.240, 0.00],
  upper_arm_r: [-0.190, 1.240, 0.00],
  elbow_l: [0.210, 1.150, 0.00],
  elbow_r: [-0.210, 1.150, 0.00],
  forearm_l: [0.270, 1.000, 0.01],
  forearm_r: [-0.270, 1.000, 0.01],
  hand_l: [0.330, 0.830, -0.01],
  hand_r: [-0.330, 0.830, -0.01],
  thigh_l: [0.090, 0.720, 0.04],
  thigh_r: [-0.090, 0.720, 0.04],
  hamstring_l: [0.090, 0.700, -0.05],
  hamstring_r: [-0.090, 0.700, -0.05],
  knee_l: [0.085, 0.480, 0.04],
  knee_r: [-0.085, 0.480, 0.04],
  calf_l: [0.085, 0.280, 0.02],
  calf_r: [-0.085, 0.280, 0.02],
  foot_l: [0.075, 0.050, 0.05],
  foot_r: [-0.075, 0.050, 0.05],
};

export function getZoneCenter(zoneId: ZoneId, bodyType: BodyType | null, isRear = false): [number, number, number] {
  const centers = bodyType === 'female' ? FEMALE_ZONE_CENTERS : MALE_ZONE_CENTERS;
  const base = centers[zoneId];

  // Positions highlight sphere on front vs rear mesh surface for multi-directional arm & leg zones
  if (isRear && (
    zoneId === 'upper_arm_l' || zoneId === 'upper_arm_r' ||
    zoneId === 'elbow_l' || zoneId === 'elbow_r' ||
    zoneId === 'forearm_l' || zoneId === 'forearm_r' ||
    zoneId === 'calf_l' || zoneId === 'calf_r'
  )) {
    return [base[0], base[1], -Math.abs(base[2]) - 0.03];
  }

  if (!isRear && (
    zoneId === 'upper_arm_l' || zoneId === 'upper_arm_r' ||
    zoneId === 'elbow_l' || zoneId === 'elbow_r' ||
    zoneId === 'forearm_l' || zoneId === 'forearm_r'
  )) {
    return [base[0], base[1], Math.abs(base[2]) + 0.02];
  }

  return base;
}

/**
 * Maps a world raycast hit point (Y 0..1.75) to exact body ZoneId.
 * - Upper Arms (Upper Arm L/R): Y: 1.20 -> 1.30 (Selectable from Front & Rear)
 * - Elbows (Elbow L/R): Y: 1.10 -> 1.20 (Selectable from Front & Rear)
 * - Forearms (Forearm L/R): Y: 0.95 -> 1.10 (Selectable from Front & Rear)
 */
export function hitToZone(point: THREE.Vector3, bodyType: BodyType | null): ZoneId {
  const { x, y, z } = point;
  const isFemale = bodyType === 'female';
  const isRear = z < -0.05;

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

  // 4. Upper Arms vs Chest/Back (Y: 1.20 -> 1.30)
  const armX = isFemale ? 0.16 : 0.18;
  if (y >= 1.20 && y < 1.30) {
    if (x > armX) return 'upper_arm_l';
    if (x < -armX) return 'upper_arm_r';
    return isRear ? 'back' : 'chest';
  }

  // 5. Elbows vs Stomach/Back (Y: 1.10 -> 1.20)
  if (y >= 1.10 && y < 1.20) {
    if (x > armX) return 'elbow_l';
    if (x < -armX) return 'elbow_r';
    return isRear ? 'back' : 'stomach';
  }

  // 6. Forearms vs Stomach/Back (Y: 0.95 -> 1.10)
  if (y >= 0.95 && y < 1.10) {
    if (x > armX) return 'forearm_l';
    if (x < -armX) return 'forearm_r';
    return isRear ? 'back' : 'stomach';
  }

  // 7. Hands vs Stomach / Hips & Glutes (Y: 0.78 -> 0.95)
  const handX = isFemale ? 0.16 : 0.18;
  if (y >= 0.78 && y < 0.95) {
    if (x > handX) return 'hand_l';
    if (x < -handX) return 'hand_r';
    return isRear ? 'hips' : 'stomach';
  }

  // 8. Thighs / Hamstrings (Y: 0.54 -> 0.78)
  if (y >= 0.54 && y < 0.78) {
    if (isRear) {
      return x >= 0 ? 'hamstring_l' : 'hamstring_r';
    }
    return x >= 0 ? 'thigh_l' : 'thigh_r';
  }

  // 9. Knees (Front) vs Hamstrings (Rear) (Y: 0.42 -> 0.54)
  if (y >= 0.42 && y < 0.54) {
    if (isRear) {
      return x >= 0 ? 'hamstring_l' : 'hamstring_r';
    }
    return x >= 0 ? 'knee_l' : 'knee_r';
  }

  // 10. Lower Legs / Calves (Y: 0.16 -> 0.42)
  if (y >= 0.16 && y < 0.42) {
    return x >= 0 ? 'calf_l' : 'calf_r';
  }

  // 11. Feet (Y: 0.00 -> 0.16)
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
