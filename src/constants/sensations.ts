/**
 * Sensation vocabulary for the check-in UI.
 * Sourced from User Research Doc §8 (interoception research + alexithymia literature).
 */

import type { ZoneId } from '@/lib/store/checkinStore';

export interface SensationDef {
  type: string;
  description: string;
}

// ── Universal sensations (available for ALL body zones) ──
export const UNIVERSAL_SENSATIONS: SensationDef[] = [
  { type: 'Tight', description: 'Feels squeezed or constricted' },
  { type: 'Heavy', description: 'Feels weighed down' },
  { type: 'Buzzing', description: 'Vibrating or electric feeling' },
  { type: 'Hot', description: 'Warm or burning feeling' },
  { type: 'Cold', description: 'Cool or icy feeling' },
  { type: 'Tingling', description: 'Pins-and-needles feeling' },
  { type: 'Pressure', description: 'Feels like something pushing' },
  { type: 'Numb', description: "Can't feel much in this area" },
  { type: 'Aching', description: 'Dull, persistent discomfort' },
  { type: 'Throbbing', description: 'Pulsing or beating feeling' },
];

// ── Zone-specific additional sensations ──
const ZONE_SPECIFIC: Partial<Record<string, SensationDef[]>> = {
  head: [
    { type: 'Foggy', description: 'Unclear or clouded thinking' },
    { type: 'Spinning', description: 'Dizzy or vertigo feeling' },
    { type: 'Pounding', description: 'Intense rhythmic pain' },
    { type: 'Fuzzy', description: 'Soft static-like feeling' },
    { type: 'Sharp', description: 'Sudden piercing sensation' },
  ],
  throat: [
    { type: 'Lump', description: 'Something stuck in throat' },
    { type: 'Choking', description: 'Throat feels closed' },
    { type: 'Dry', description: 'Parched or scratchy' },
    { type: 'Swollen', description: 'Throat feels enlarged' },
  ],
  chest: [
    { type: 'Racing', description: 'Heart beating fast' },
    { type: 'Fluttery', description: 'Butterfly or flicker feeling' },
    { type: 'Hollow', description: 'Empty or void feeling' },
    { type: 'Burning', description: 'Hot, searing sensation' },
    { type: 'Constricted', description: 'Chest feels squeezed' },
  ],
  stomach: [
    { type: 'Churning', description: 'Stomach turning over' },
    { type: 'Knotted', description: 'Tied up in knots' },
    { type: 'Sinking', description: 'Dropping or falling feeling' },
    { type: 'Nauseous', description: 'Feeling sick' },
    { type: 'Butterflies', description: 'Fluttering sensation' },
  ],
  shoulders: [
    { type: 'Locked', description: 'Frozen in place' },
    { type: 'Raised', description: 'Pulled up toward ears' },
    { type: 'Hunched', description: 'Curled forward' },
    { type: 'Stiff', description: 'Rigid and inflexible' },
  ],
  hands: [
    { type: 'Shaky', description: 'Trembling or vibrating' },
    { type: 'Clenched', description: 'Fists balled tight' },
    { type: 'Sweaty', description: 'Moist palms' },
    { type: 'Restless', description: 'Need to fidget' },
  ],
  back: [
    { type: 'Rigid', description: 'Stiff and unyielding' },
    { type: 'Curling', description: 'Rounding inward' },
    { type: 'Tense', description: 'Muscles pulled tight' },
  ],
  legs: [
    { type: 'Restless', description: 'Need to move or bounce' },
    { type: 'Weak', description: 'Feels like they might give out' },
    { type: 'Jelly', description: 'Wobbly and unstable' },
    { type: 'Bouncing', description: 'Nervous energy moving' },
  ],
  feet: [
    { type: 'Rooted', description: 'Planted firmly, grounded' },
    { type: 'Floating', description: 'Disconnected from ground' },
    { type: 'Tapping', description: 'Rhythmic restless movement' },
  ],
};

// ── Zone ID → sensation group mapping ──
const ZONE_GROUP_MAP: Record<ZoneId, string | null> = {
  head: 'head',
  throat: 'throat',
  chest: 'chest',
  stomach: 'stomach',
  back: 'back',
  hips: null,
  shoulder_l: 'shoulders',
  shoulder_r: 'shoulders',
  upper_arm_l: null,
  upper_arm_r: null,
  elbow_l: null,
  elbow_r: null,
  forearm_l: null,
  forearm_r: null,
  hand_l: 'hands',
  hand_r: 'hands',
  thigh_l: 'legs',
  thigh_r: 'legs',
  hamstring_l: 'legs',
  hamstring_r: 'legs',
  knee_l: 'legs',
  knee_r: 'legs',
  calf_l: 'legs',
  calf_r: 'legs',
  foot_l: 'feet',
  foot_r: 'feet',
};

/**
 * Returns all available sensations for a given body zone.
 * Zone-specific sensations appear first, then universal sensations.
 */
export function getSensationsForZone(zone: ZoneId): SensationDef[] {
  const group = ZONE_GROUP_MAP[zone];
  const zoneSpecific = group ? (ZONE_SPECIFIC[group] ?? []) : [];

  // Deduplicate: if a zone-specific type matches a universal type, skip it from universal
  const zoneTypes = new Set(zoneSpecific.map((s) => s.type));
  const universal = UNIVERSAL_SENSATIONS.filter((s) => !zoneTypes.has(s.type));

  return [...zoneSpecific, ...universal];
}
