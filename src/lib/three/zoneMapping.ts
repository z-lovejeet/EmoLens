import * as THREE from 'three';
import { type ZoneId, type BodyType } from '@/lib/store/checkinStore';

export interface ZoneBounds {
  id: ZoneId;
  minY: number;
  maxY: number;
  center: [number, number, number];
}

// ── MALE ZONE CENTERS ──
export const MALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.66, 0.05],
  throat: [0, 1.48, 0.05],
  shoulder_l: [-0.34, 1.36, 0],
  shoulder_r: [0.34, 1.36, 0],
  chest: [0, 1.18, 0.12],
  stomach: [0, 0.95, 0.12],
  back: [0, 1.15, -0.12],
  hips: [0, 0.76, 0.05],
  arm_l: [-0.38, 1.05, 0],
  arm_r: [0.38, 1.05, 0],
  hand_l: [-0.40, 0.72, 0],
  hand_r: [0.40, 0.72, 0],
  leg_l: [-0.16, 0.44, 0.05],
  leg_r: [0.16, 0.44, 0.05],
  foot_l: [-0.16, 0.08, 0.08],
  foot_r: [0.16, 0.08, 0.08],
};

// ── FEMALE ZONE CENTERS ──
export const FEMALE_ZONE_CENTERS: Record<ZoneId, [number, number, number]> = {
  head: [0, 1.63, 0.05],
  throat: [0, 1.45, 0.05],
  shoulder_l: [-0.28, 1.33, 0],
  shoulder_r: [0.28, 1.33, 0],
  chest: [0, 1.12, 0.14],
  stomach: [0, 0.90, 0.12],
  back: [0, 1.10, -0.12],
  hips: [0, 0.72, 0.06],
  arm_l: [-0.32, 1.00, 0],
  arm_r: [0.32, 1.00, 0],
  hand_l: [-0.34, 0.68, 0],
  hand_r: [0.34, 0.68, 0],
  leg_l: [-0.14, 0.40, 0.05],
  leg_r: [0.14, 0.40, 0.05],
  foot_l: [-0.14, 0.08, 0.08],
  foot_r: [0.14, 0.08, 0.08],
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
 * Maps a 3D hit point to a specific body ZoneId based on gender-specific anatomical thresholds
 */
export function hitToZone(point: THREE.Vector3, bodyType: BodyType | null): ZoneId {
  const { x, y, z } = point;
  const isFemale = bodyType === 'female';

  // Head (top region)
  const headThreshold = isFemale ? 1.52 : 1.55;
  if (y >= headThreshold) {
    return 'head';
  }

  // Throat / Neck
  const throatThreshold = isFemale ? 1.38 : 1.42;
  if (y >= throatThreshold && y < headThreshold) {
    return 'throat';
  }

  // Upper Torso / Shoulders
  const shoulderYMin = isFemale ? 1.22 : 1.25;
  const shoulderXThreshold = isFemale ? 0.20 : 0.22;
  if (y >= shoulderYMin && y < throatThreshold) {
    if (x < -shoulderXThreshold) return 'shoulder_l';
    if (x > shoulderXThreshold) return 'shoulder_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // Mid Torso / Chest / Upper Arms
  const chestYMin = isFemale ? 1.02 : 1.05;
  const armXThreshold = isFemale ? 0.24 : 0.26;
  if (y >= chestYMin && y < shoulderYMin) {
    if (x < -armXThreshold) return 'arm_l';
    if (x > armXThreshold) return 'arm_r';
    return z < -0.02 ? 'back' : 'chest';
  }

  // Lower Torso / Stomach / Forearms
  const stomachYMin = isFemale ? 0.80 : 0.85;
  if (y >= stomachYMin && y < chestYMin) {
    if (x < -armXThreshold) return 'arm_l';
    if (x > armXThreshold) return 'arm_r';
    return z < -0.02 ? 'back' : 'stomach';
  }

  // Hips / Glutes / Hands
  const hipsYMin = isFemale ? 0.65 : 0.70;
  const handXThreshold = isFemale ? 0.24 : 0.26;
  if (y >= hipsYMin && y < stomachYMin) {
    if (x < -handXThreshold) return 'hand_l';
    if (x > handXThreshold) return 'hand_r';
    return 'hips';
  }

  // Legs
  const legYMin = isFemale ? 0.16 : 0.18;
  if (y >= legYMin && y < hipsYMin) {
    return x < 0 ? 'leg_l' : 'leg_r';
  }

  // Feet
  return x < 0 ? 'foot_l' : 'foot_r';
}

/**
 * Normalizes a raw loaded GLB scene
 */
export function normalizeGLBScene(scene: THREE.Object3D, targetHeight = 1.75): { scale: number; offset: THREE.Vector3 } {
  const rawBox = new THREE.Box3().setFromObject(scene);
  const rawSize = new THREE.Vector3();
  rawBox.getSize(rawSize);

  if (rawSize.z > rawSize.y && rawSize.z > rawSize.x) {
    scene.rotation.x = -Math.PI / 2;
    scene.updateMatrixWorld(true);
  }

  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = size.y > 0 ? targetHeight / size.y : 1;
  const offset = new THREE.Vector3(-center.x * scale, -box.min.y * scale, -center.z * scale);

  return { scale, offset };
}
