import * as THREE from 'three';
import { type ZoneId, type Gender } from '@/lib/store/checkinStore';

export interface ZoneGeometryDef {
  id: ZoneId;
  geometry: THREE.BufferGeometry;
  center: [number, number, number];
}

/**
 * Creates gender-specific body geometries.
 * Male: broader shoulders, wider chest, narrower hips, thicker limbs.
 * Female: narrower shoulders, curved waist, wider hips, softer proportions.
 */
export function createBodyGeometries(gender: Gender = 'male'): ZoneGeometryDef[] {
  const isMale = gender === 'male';
  const zones: ZoneGeometryDef[] = [];

  // ── HEAD ──
  const headGeo = new THREE.SphereGeometry(isMale ? 0.16 : 0.15, 48, 36);
  headGeo.scale(1, 1.1, 0.98);
  headGeo.translate(0, 1.72, 0);
  zones.push({ id: 'head', geometry: headGeo, center: [0, 1.72, 0] });

  // ── THROAT ──
  const throatR = isMale ? 0.075 : 0.06;
  const throatGeo = new THREE.CylinderGeometry(throatR * 0.85, throatR, 0.12, 24);
  throatGeo.translate(0, 1.55, 0);
  zones.push({ id: 'throat', geometry: throatGeo, center: [0, 1.55, 0] });

  // ── SHOULDERS ──
  const shoulderX = isMale ? 0.36 : 0.28;
  const shoulderR = isMale ? 0.105 : 0.085;

  const shoulderLGeo = new THREE.SphereGeometry(shoulderR, 32, 24);
  shoulderLGeo.scale(1.15, 0.8, 0.9);
  shoulderLGeo.translate(-shoulderX, 1.4, 0);
  zones.push({ id: 'shoulder_l', geometry: shoulderLGeo, center: [-shoulderX, 1.4, 0] });

  const shoulderRGeo = new THREE.SphereGeometry(shoulderR, 32, 24);
  shoulderRGeo.scale(1.15, 0.8, 0.9);
  shoulderRGeo.translate(shoulderX, 1.4, 0);
  zones.push({ id: 'shoulder_r', geometry: shoulderRGeo, center: [shoulderX, 1.4, 0] });

  // ── CHEST ──
  const chestProfile = isMale
    ? [
        // Male: wide, flat, angular
        new THREE.Vector2(0, 0.2),
        new THREE.Vector2(0.27, 0.17),
        new THREE.Vector2(0.3, 0.08),
        new THREE.Vector2(0.29, 0),
        new THREE.Vector2(0.27, -0.08),
        new THREE.Vector2(0.24, -0.16),
        new THREE.Vector2(0.22, -0.2),
      ]
    : [
        // Female: narrower top, gentle curve outward at bust, tapering
        new THREE.Vector2(0, 0.18),
        new THREE.Vector2(0.2, 0.16),
        new THREE.Vector2(0.23, 0.1),
        new THREE.Vector2(0.24, 0.03),
        new THREE.Vector2(0.23, -0.04),
        new THREE.Vector2(0.2, -0.12),
        new THREE.Vector2(0.17, -0.18),
      ];
  const chestGeo = new THREE.LatheGeometry(chestProfile, 40);
  chestGeo.translate(0, 1.18, 0);
  zones.push({ id: 'chest', geometry: chestGeo, center: [0, 1.18, 0] });

  // ── STOMACH ──
  const stomachProfile = isMale
    ? [
        // Male: straight, blocky midsection
        new THREE.Vector2(0, 0.14),
        new THREE.Vector2(0.22, 0.12),
        new THREE.Vector2(0.23, 0.04),
        new THREE.Vector2(0.22, -0.02),
        new THREE.Vector2(0.21, -0.08),
        new THREE.Vector2(0.2, -0.14),
      ]
    : [
        // Female: narrow waist (hourglass)
        new THREE.Vector2(0, 0.14),
        new THREE.Vector2(0.16, 0.12),
        new THREE.Vector2(0.155, 0.04),
        new THREE.Vector2(0.15, -0.02),
        new THREE.Vector2(0.16, -0.08),
        new THREE.Vector2(0.17, -0.14),
      ];
  const stomachGeo = new THREE.LatheGeometry(stomachProfile, 40);
  stomachGeo.translate(0, 0.86, 0);
  zones.push({ id: 'stomach', geometry: stomachGeo, center: [0, 0.86, 0] });

  // ── BACK ──
  const backW = isMale ? 0.48 : 0.38;
  const backGeo = new THREE.BoxGeometry(backW, 0.52, 0.1, 8, 8, 1);
  const backPos = backGeo.attributes.position;
  for (let i = 0; i < backPos.count; i++) {
    const y = backPos.getY(i);
    const z = backPos.getZ(i);
    backPos.setZ(i, z - 0.025 * y * y);
  }
  backGeo.translate(0, 1.1, -0.22);
  zones.push({ id: 'back', geometry: backGeo, center: [0, 1.1, -0.24] });

  // ── HIPS / GLUTES ──
  const hipsProfile = isMale
    ? [
        // Male: narrower hips, straighter
        new THREE.Vector2(0, 0.1),
        new THREE.Vector2(0.18, 0.08),
        new THREE.Vector2(0.19, 0),
        new THREE.Vector2(0.18, -0.06),
        new THREE.Vector2(0.15, -0.1),
      ]
    : [
        // Female: significantly wider hips, rounder
        new THREE.Vector2(0, 0.12),
        new THREE.Vector2(0.2, 0.1),
        new THREE.Vector2(0.24, 0.02),
        new THREE.Vector2(0.25, -0.04),
        new THREE.Vector2(0.22, -0.1),
        new THREE.Vector2(0.18, -0.12),
      ];
  const hipsGeo = new THREE.LatheGeometry(hipsProfile, 40);
  hipsGeo.translate(0, 0.65, 0);
  zones.push({ id: 'hips', geometry: hipsGeo, center: [0, 0.65, 0] });

  // ── UPPER ARMS ──
  const armR = isMale ? 0.06 : 0.048;
  const armLen = isMale ? 0.32 : 0.3;
  const armX = isMale ? 0.5 : 0.4;
  const armAngle = isMale ? 0.1 : 0.08;

  const armLGeo = new THREE.CapsuleGeometry(armR, armLen, 12, 24);
  armLGeo.rotateZ(Math.PI * armAngle);
  armLGeo.translate(-armX, 1.08, 0);
  zones.push({ id: 'arm_l', geometry: armLGeo, center: [-armX, 1.08, 0] });

  const armRGeo = new THREE.CapsuleGeometry(armR, armLen, 12, 24);
  armRGeo.rotateZ(-Math.PI * armAngle);
  armRGeo.translate(armX, 1.08, 0);
  zones.push({ id: 'arm_r', geometry: armRGeo, center: [armX, 1.08, 0] });

  // ── HANDS ──
  const handR = isMale ? 0.055 : 0.045;
  const handX = isMale ? 0.56 : 0.46;
  const handY = isMale ? 0.78 : 0.8;

  const handLGeo = new THREE.SphereGeometry(handR, 20, 16);
  handLGeo.scale(0.9, 1.3, 0.65);
  handLGeo.translate(-handX, handY, 0);
  zones.push({ id: 'hand_l', geometry: handLGeo, center: [-handX, handY, 0] });

  const handRGeo = new THREE.SphereGeometry(handR, 20, 16);
  handRGeo.scale(0.9, 1.3, 0.65);
  handRGeo.translate(handX, handY, 0);
  zones.push({ id: 'hand_r', geometry: handRGeo, center: [handX, handY, 0] });

  // ── LEGS ──
  const legR = isMale ? 0.075 : 0.065;
  const legLen = isMale ? 0.44 : 0.42;
  const legX = isMale ? 0.13 : 0.12;

  const legLGeo = new THREE.CapsuleGeometry(legR, legLen, 12, 24);
  legLGeo.translate(-legX, 0.25, 0);
  zones.push({ id: 'leg_l', geometry: legLGeo, center: [-legX, 0.25, 0] });

  const legRGeo = new THREE.CapsuleGeometry(legR, legLen, 12, 24);
  legRGeo.translate(legX, 0.25, 0);
  zones.push({ id: 'leg_r', geometry: legRGeo, center: [legX, 0.25, 0] });

  // ── FEET ──
  const footR = isMale ? 0.06 : 0.05;

  const footLGeo = new THREE.SphereGeometry(footR, 16, 12);
  footLGeo.scale(0.85, 0.45, 1.5);
  footLGeo.translate(-legX, -0.02, 0.04);
  zones.push({ id: 'foot_l', geometry: footLGeo, center: [-legX, -0.02, 0.04] });

  const footRGeo = new THREE.SphereGeometry(footR, 16, 12);
  footRGeo.scale(0.85, 0.45, 1.5);
  footRGeo.translate(legX, -0.02, 0.04);
  zones.push({ id: 'foot_r', geometry: footRGeo, center: [legX, -0.02, 0.04] });

  return zones;
}
