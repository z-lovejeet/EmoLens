'use client';

import styles from './BodyPatternMini.module.css';

interface BodyPattern {
  zone: string;
  sensations: string[];
  avgIntensity: number;
}

interface Props {
  patterns: BodyPattern[];
}

function getIntensityColor(intensity: number): string {
  if (intensity <= 1) return '#88d4ab';
  if (intensity <= 2) return '#8ecae6';
  if (intensity <= 3) return '#b8a9c9';
  if (intensity <= 4) return '#e6a97e';
  return '#d4807a';
}

function getZoneOpacity(intensity: number): number {
  return Math.min(0.3 + (intensity / 5) * 0.6, 0.9);
}

// Map zone IDs to body region groups
function getRegionForZone(zone: string): string {
  const map: Record<string, string> = {
    head: 'head',
    throat: 'throat',
    chest: 'chest',
    stomach: 'stomach',
    back: 'chest',  // back maps to torso area visually
    shoulder_l: 'shoulders',
    shoulder_r: 'shoulders',
    upper_arm_l: 'arms',
    upper_arm_r: 'arms',
    elbow_l: 'arms',
    elbow_r: 'arms',
    forearm_l: 'arms',
    forearm_r: 'arms',
    hand_l: 'hands',
    hand_r: 'hands',
    hips: 'hips',
    thigh_l: 'legs',
    thigh_r: 'legs',
    hamstring_l: 'legs',
    hamstring_r: 'legs',
    knee_l: 'legs',
    knee_r: 'legs',
    calf_l: 'calves',
    calf_r: 'calves',
    foot_l: 'feet',
    foot_r: 'feet',
  };
  return map[zone] || 'unknown';
}

export function BodyPatternMini({ patterns }: Props) {
  // Build a region -> (color, opacity) map from the highest intensity per region
  const regionMap = new Map<string, { color: string; opacity: number }>();

  for (const p of patterns) {
    const region = getRegionForZone(p.zone);
    const existing = regionMap.get(region);
    if (!existing || p.avgIntensity > (existing.opacity - 0.3) / 0.6 * 5) {
      regionMap.set(region, {
        color: getIntensityColor(p.avgIntensity),
        opacity: getZoneOpacity(p.avgIntensity),
      });
    }
  }

  const getRegionStyle = (region: string) => {
    const data = regionMap.get(region);
    if (!data) return { fill: 'rgba(255,255,255,0.04)', opacity: 1 };
    return { fill: data.color, opacity: data.opacity };
  };

  return (
    <div className={styles.container}>
      <svg
        viewBox="0 0 80 120"
        className={styles.svg}
        aria-label="Body pattern visualization"
        role="img"
      >
        {/* Body outline (subtle) */}
        <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none">
          {/* Head */}
          <ellipse cx="40" cy="14" rx="10" ry="12" />
          {/* Neck / Throat */}
          <rect x="36" y="25" width="8" height="5" rx="2" />
          {/* Torso */}
          <path d="M28 30 Q25 32 24 40 L24 60 Q24 64 28 66 L52 66 Q56 64 56 60 L56 40 Q55 32 52 30 Z" />
          {/* Arms */}
          <path d="M24 34 L16 50 L14 62 L18 62 L22 52 L24 42" />
          <path d="M56 34 L64 50 L66 62 L62 62 L58 52 L56 42" />
          {/* Hands */}
          <ellipse cx="16" cy="65" rx="3" ry="4" />
          <ellipse cx="64" cy="65" rx="3" ry="4" />
          {/* Hips */}
          <path d="M28 66 Q26 70 28 74 L52 74 Q54 70 52 66" />
          {/* Legs */}
          <path d="M30 74 L28 96 L26 104 L34 104 L34 96 L36 74" />
          <path d="M44 74 L46 96 L48 104 L54 104 L52 96 L50 74" />
          {/* Feet */}
          <ellipse cx="30" cy="107" rx="5" ry="3" />
          <ellipse cx="50" cy="107" rx="5" ry="3" />
        </g>

        {/* Highlighted regions */}
        <g>
          {/* Head */}
          <ellipse cx="40" cy="14" rx="9" ry="11" {...getRegionStyle('head')} />
          {/* Throat */}
          <rect x="36.5" y="25.5" width="7" height="4" rx="2" {...getRegionStyle('throat')} />
          {/* Shoulders */}
          <ellipse cx="26" cy="33" rx="5" ry="3" {...getRegionStyle('shoulders')} />
          <ellipse cx="54" cy="33" rx="5" ry="3" {...getRegionStyle('shoulders')} />
          {/* Chest (upper torso) */}
          <rect x="28" y="32" width="24" height="14" rx="3" {...getRegionStyle('chest')} />
          {/* Stomach (lower torso) */}
          <rect x="28" y="48" width="24" height="16" rx="3" {...getRegionStyle('stomach')} />
          {/* Arms */}
          <path d="M24 36 L17 50 L15 60 L19 60 L22 50 L24 40 Z" {...getRegionStyle('arms')} />
          <path d="M56 36 L63 50 L65 60 L61 60 L58 50 L56 40 Z" {...getRegionStyle('arms')} />
          {/* Hands */}
          <ellipse cx="16" cy="64" rx="3" ry="4" {...getRegionStyle('hands')} />
          <ellipse cx="64" cy="64" rx="3" ry="4" {...getRegionStyle('hands')} />
          {/* Hips */}
          <path d="M29 66 Q27 70 29 73 L51 73 Q53 70 51 66 Z" {...getRegionStyle('hips')} />
          {/* Legs */}
          <path d="M31 74 L29 95 L27 103 L33 103 L33 95 L35 74 Z" {...getRegionStyle('legs')} />
          <path d="M45 74 L47 95 L49 103 L53 103 L51 95 L49 74 Z" {...getRegionStyle('legs')} />
          {/* Calves - overlap with legs but lower */}
          <rect x="27" y="90" width="6" height="13" rx="2" {...getRegionStyle('calves')} />
          <rect x="47" y="90" width="6" height="13" rx="2" {...getRegionStyle('calves')} />
          {/* Feet */}
          <ellipse cx="30" cy="107" rx="4.5" ry="2.5" {...getRegionStyle('feet')} />
          <ellipse cx="50" cy="107" rx="4.5" ry="2.5" {...getRegionStyle('feet')} />
        </g>
      </svg>
    </div>
  );
}
