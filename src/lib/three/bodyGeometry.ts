import * as THREE from 'three';
import { type ZoneId } from '@/lib/store/checkinStore';

export interface ZoneGeometryDef {
  id: ZoneId;
  geometry: THREE.BufferGeometry;
  center: [number, number, number];
}

/**
 * Creates a stylized human body from primitives.
 * Model is ~2 units tall, centered at origin.
 * Head top ~1.8, feet at ~-0.2.
 * Low-poly, gender-neutral, approachable.
 */
export function createBodyGeometries(): ZoneGeometryDef[] {
  const zones: ZoneGeometryDef[] = [];

  // HEAD — sphere, slightly elongated vertically
  const headGeo = new THREE.SphereGeometry(0.14, 24, 20);
  headGeo.scale(1, 1.15, 0.95);
  headGeo.translate(0, 1.65, 0);
  zones.push({ id: 'head', geometry: headGeo, center: [0, 1.65, 0] });

  // THROAT — small cylinder
  const throatGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.12, 16);
  throatGeo.translate(0, 1.45, 0);
  zones.push({ id: 'throat', geometry: throatGeo, center: [0, 1.45, 0] });

  // CHEST — rounded box / tapered cylinder
  const chestGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.32, 20, 1);
  chestGeo.translate(0, 1.2, 0);
  zones.push({ id: 'chest', geometry: chestGeo, center: [0, 1.2, 0] });

  // STOMACH — slightly narrower cylinder
  const stomachGeo = new THREE.CylinderGeometry(0.15, 0.14, 0.24, 18, 1);
  stomachGeo.translate(0, 0.9, 0);
  zones.push({ id: 'stomach', geometry: stomachGeo, center: [0, 0.9, 0] });

  // BACK — flat box behind torso
  const backGeo = new THREE.BoxGeometry(0.3, 0.5, 0.06, 4, 6, 1);
  backGeo.translate(0, 1.05, -0.12);
  zones.push({ id: 'back', geometry: backGeo, center: [0, 1.05, -0.15] });

  // ARM LEFT — capsule shape (cylinder + sphere caps)
  const armLGeo = new THREE.CapsuleGeometry(0.05, 0.3, 8, 12);
  armLGeo.rotateZ(Math.PI * 0.15); // slight angle
  armLGeo.translate(-0.32, 1.15, 0);
  zones.push({ id: 'arm_l', geometry: armLGeo, center: [-0.32, 1.15, 0] });

  // ARM RIGHT
  const armRGeo = new THREE.CapsuleGeometry(0.05, 0.3, 8, 12);
  armRGeo.rotateZ(-Math.PI * 0.15);
  armRGeo.translate(0.32, 1.15, 0);
  zones.push({ id: 'arm_r', geometry: armRGeo, center: [0.32, 1.15, 0] });

  // HAND LEFT — small sphere
  const handLGeo = new THREE.SphereGeometry(0.055, 12, 10);
  handLGeo.scale(1, 1.1, 0.7);
  handLGeo.translate(-0.42, 0.85, 0);
  zones.push({ id: 'hand_l', geometry: handLGeo, center: [-0.42, 0.85, 0] });

  // HAND RIGHT
  const handRGeo = new THREE.SphereGeometry(0.055, 12, 10);
  handRGeo.scale(1, 1.1, 0.7);
  handRGeo.translate(0.42, 0.85, 0);
  zones.push({ id: 'hand_r', geometry: handRGeo, center: [0.42, 0.85, 0] });

  // LEG LEFT — capsule
  const legLGeo = new THREE.CapsuleGeometry(0.065, 0.45, 8, 12);
  legLGeo.translate(-0.1, 0.38, 0);
  zones.push({ id: 'leg_l', geometry: legLGeo, center: [-0.1, 0.38, 0] });

  // LEG RIGHT
  const legRGeo = new THREE.CapsuleGeometry(0.065, 0.45, 8, 12);
  legRGeo.translate(0.1, 0.38, 0);
  zones.push({ id: 'leg_r', geometry: legRGeo, center: [0.1, 0.38, 0] });

  // FOOT LEFT — elongated sphere
  const footLGeo = new THREE.SphereGeometry(0.055, 10, 8);
  footLGeo.scale(0.9, 0.5, 1.4);
  footLGeo.translate(-0.1, 0.07, 0.03);
  zones.push({ id: 'foot_l', geometry: footLGeo, center: [-0.1, 0.07, 0.03] });

  // FOOT RIGHT
  const footRGeo = new THREE.SphereGeometry(0.055, 10, 8);
  footRGeo.scale(0.9, 0.5, 1.4);
  footRGeo.translate(0.1, 0.07, 0.03);
  zones.push({ id: 'foot_r', geometry: footRGeo, center: [0.1, 0.07, 0.03] });

  return zones;
}
