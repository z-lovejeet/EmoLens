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

// ── MALE ZONE CENTERS (Measured directly from male mesh geometry) ──
export const MALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.643, 0.02],
  throat: [0, 1.494, 0.02],
  shoulder_l: [-0.260, 1.380, 0.0],
  shoulder_r: [0.260, 1.380, 0.0],
  chest: [0, 1.245, 0.06],
  stomach: [0, 1.096, 0.05],
  back: [0, 1.235, -0.08],
  hips: [0, 0.894, 0.02],
  arm_l: [-0.280, 1.120, 0.0],
  arm_r: [0.280, 1.120, 0.0],
  hand_l: [-0.310, 0.840, 0.0],
  hand_r: [0.310, 0.840, 0.0],
  leg_l: [-0.100, 0.520, 0.02],
  leg_r: [0.100, 0.520, 0.02],
  foot_l: [-0.100, 0.080, 0.06],
  foot_r: [0.100, 0.080, 0.06],
};

// ── FEMALE ZONE CENTERS (Measured directly from female mesh geometry) ──
export const FEMALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.616, 0.04],
  throat: [0, 1.493, 0.01],
  shoulder_l: [-0.220, 1.360, 0.0],
  shoulder_r: [0.220, 1.360, 0.0],
  chest: [0, 1.263, 0.08],
  stomach: [0, 1.084, 0.05],
  back: [0, 1.236, -0.08],
  hips: [0, 0.887, 0.02],
  arm_l: [-0.262, 1.083, -0.01],
  arm_r: [0.261, 1.084, -0.01],
  hand_l: [-0.326, 0.861, -0.01],
  hand_r: [0.326, 0.861, -0.01],
  leg_l: [-0.101, 0.557, 0.01],
  leg_r: [0.101, 0.561, 0.01],
  foot_l: [-0.075, 0.055, 0.05],
  foot_r: [0.075, 0.054, 0.05],
};

export function getZoneCenter(zoneId: ZoneId, bodyType: BodyType | null): [number, number, number] {
  if (bodyType === 'female') {
    return FEMALE_ZONE_CENTERS[zoneId];
  }
  return MALE_ZONE_CENTERS[zoneId];
}

/**
 * Maps a 3D hit point in normalized model coordinates (Y 0..1.75) to body ZoneId
 */
export function hitToZone(point: THREE.Vector3, bodyType: BodyType | null): ZoneId {
  const { x, y, z } = point;
  const isFemale = bodyType === 'female';

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
    if (x < -shoulderX) return 'shoulder_l';
    if (x > shoulderX) return 'shoulder_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // 4. Chest / Upper Arms (Y: 1.18 -> 1.32)
  const armX = isFemale ? 0.20 : 0.22;
  if (y >= 1.18 && y < 1.32) {
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

  // 6. Hips / Glutes / Hands (Y: 0.78 -> 0.98)
  const handX = isFemale ? 0.20 : 0.22;
  if (y >= 0.78 && y < 0.98) {
    if (x < -handX) return 'hand_l';
    if (x > handX) return 'hand_r';
    return z < -0.02 ? 'back' : 'hips';
  }

  // 7. Legs (Y: 0.16 -> 0.78)
  if (y >= 0.16 && y < 0.78) {
    return x < 0 ? 'leg_l' : 'leg_r';
  }

  // 8. Feet (Y: 0.00 -> 0.16)
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
