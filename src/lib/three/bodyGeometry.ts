import * as THREE from 'three';
import { type ZoneId } from '@/lib/store/checkinStore';

export interface ZoneGeometryDef {
  id: ZoneId;
  geometry: THREE.BufferGeometry;
  center: [number, number, number];
}

/**
 * Premium stylized mannequin body — smooth, gender-neutral, 16 zones.
 * Total height ~1.85 units. Centered vertically ~0.85.
 * Uses LatheGeometry for organic torso, high-segment capsules for limbs.
 */
export function createBodyGeometries(): ZoneGeometryDef[] {
  const zones: ZoneGeometryDef[] = [];

  // ── HEAD — smooth sphere, subtly elongated ──
  const headGeo = new THREE.SphereGeometry(0.155, 48, 36);
  headGeo.scale(1, 1.12, 0.98);
  headGeo.translate(0, 1.72, 0);
  zones.push({ id: 'head', geometry: headGeo, center: [0, 1.72, 0] });

  // ── THROAT — tapered cylinder connecting head to shoulders ──
  const throatGeo = new THREE.CylinderGeometry(0.065, 0.085, 0.14, 24);
  throatGeo.translate(0, 1.53, 0);
  zones.push({ id: 'throat', geometry: throatGeo, center: [0, 1.53, 0] });

  // ── SHOULDERS — rounded spheres at shoulder joints ──
  const shoulderLGeo = new THREE.SphereGeometry(0.1, 32, 24);
  shoulderLGeo.scale(1.1, 0.85, 0.9);
  shoulderLGeo.translate(-0.32, 1.38, 0);
  zones.push({ id: 'shoulder_l', geometry: shoulderLGeo, center: [-0.32, 1.38, 0] });

  const shoulderRGeo = new THREE.SphereGeometry(0.1, 32, 24);
  shoulderRGeo.scale(1.1, 0.85, 0.9);
  shoulderRGeo.translate(0.32, 1.38, 0);
  zones.push({ id: 'shoulder_r', geometry: shoulderRGeo, center: [0.32, 1.38, 0] });

  // ── CHEST — LatheGeometry for smooth organic torso ──
  // Profile: cross-section from center outward, rotated around Y axis
  const chestProfile = [
    new THREE.Vector2(0, 0.2),    // top center
    new THREE.Vector2(0.22, 0.18), // top-shoulder transition
    new THREE.Vector2(0.26, 0.1),  // chest widest
    new THREE.Vector2(0.25, 0),    // mid
    new THREE.Vector2(0.22, -0.12),// narrowing toward stomach
    new THREE.Vector2(0.2, -0.18), // bottom
  ];
  const chestGeo = new THREE.LatheGeometry(chestProfile, 36);
  chestGeo.translate(0, 1.18, 0);
  zones.push({ id: 'chest', geometry: chestGeo, center: [0, 1.18, 0] });

  // ── STOMACH — LatheGeometry, slightly narrower ──
  const stomachProfile = [
    new THREE.Vector2(0, 0.15),
    new THREE.Vector2(0.2, 0.12),
    new THREE.Vector2(0.21, 0.05),
    new THREE.Vector2(0.2, -0.03),
    new THREE.Vector2(0.18, -0.1),
    new THREE.Vector2(0.17, -0.15),
  ];
  const stomachGeo = new THREE.LatheGeometry(stomachProfile, 36);
  stomachGeo.translate(0, 0.86, 0);
  zones.push({ id: 'stomach', geometry: stomachGeo, center: [0, 0.86, 0] });

  // ── BACK — curved plate behind upper torso ──
  const backGeo = new THREE.BoxGeometry(0.42, 0.5, 0.1, 6, 8, 1);
  // Bend it slightly to follow spine curve
  const backPositions = backGeo.attributes.position;
  for (let i = 0; i < backPositions.count; i++) {
    const y = backPositions.getY(i);
    const z = backPositions.getZ(i);
    backPositions.setZ(i, z - 0.02 * y * y); // subtle concavity
  }
  backGeo.translate(0, 1.12, -0.2);
  zones.push({ id: 'back', geometry: backGeo, center: [0, 1.12, -0.22] });

  // ── HIPS / GLUTES — wide LatheGeometry at pelvis level ──
  const hipsProfile = [
    new THREE.Vector2(0, 0.1),
    new THREE.Vector2(0.18, 0.08),
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.19, -0.06),
    new THREE.Vector2(0.16, -0.1),
  ];
  const hipsGeo = new THREE.LatheGeometry(hipsProfile, 36);
  hipsGeo.translate(0, 0.65, 0);
  zones.push({ id: 'hips', geometry: hipsGeo, center: [0, 0.65, 0] });

  // ── UPPER ARMS — smooth capsules, angled naturally ──
  const armLGeo = new THREE.CapsuleGeometry(0.055, 0.3, 12, 24);
  armLGeo.rotateZ(Math.PI * 0.08);
  armLGeo.translate(-0.46, 1.1, 0);
  zones.push({ id: 'arm_l', geometry: armLGeo, center: [-0.46, 1.1, 0] });

  const armRGeo = new THREE.CapsuleGeometry(0.055, 0.3, 12, 24);
  armRGeo.rotateZ(-Math.PI * 0.08);
  armRGeo.translate(0.46, 1.1, 0);
  zones.push({ id: 'arm_r', geometry: armRGeo, center: [0.46, 1.1, 0] });

  // ── HANDS — rounded ellipsoids ──
  const handLGeo = new THREE.SphereGeometry(0.055, 20, 16);
  handLGeo.scale(0.9, 1.3, 0.65);
  handLGeo.translate(-0.52, 0.82, 0);
  zones.push({ id: 'hand_l', geometry: handLGeo, center: [-0.52, 0.82, 0] });

  const handRGeo = new THREE.SphereGeometry(0.055, 20, 16);
  handRGeo.scale(0.9, 1.3, 0.65);
  handRGeo.translate(0.52, 0.82, 0);
  zones.push({ id: 'hand_r', geometry: handRGeo, center: [0.52, 0.82, 0] });

  // ── LEGS — long smooth capsules ──
  const legLGeo = new THREE.CapsuleGeometry(0.072, 0.42, 12, 24);
  legLGeo.translate(-0.12, 0.26, 0);
  zones.push({ id: 'leg_l', geometry: legLGeo, center: [-0.12, 0.26, 0] });

  const legRGeo = new THREE.CapsuleGeometry(0.072, 0.42, 12, 24);
  legRGeo.translate(0.12, 0.26, 0);
  zones.push({ id: 'leg_r', geometry: legRGeo, center: [0.12, 0.26, 0] });

  // ── FEET — flattened ellipsoids ──
  const footLGeo = new THREE.SphereGeometry(0.06, 16, 12);
  footLGeo.scale(0.85, 0.45, 1.5);
  footLGeo.translate(-0.12, -0.02, 0.04);
  zones.push({ id: 'foot_l', geometry: footLGeo, center: [-0.12, -0.02, 0.04] });

  const footRGeo = new THREE.SphereGeometry(0.06, 16, 12);
  footRGeo.scale(0.85, 0.45, 1.5);
  footRGeo.translate(0.12, -0.02, 0.04);
  zones.push({ id: 'foot_r', geometry: footRGeo, center: [0.12, -0.02, 0.04] });

  return zones;
}
