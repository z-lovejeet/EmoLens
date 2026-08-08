'use client';

import { BodyPatternMini } from './BodyPatternMini';
import styles from './DictionaryEntry.module.css';

interface BodyPattern {
  zone: string;
  sensations: string[];
  avgIntensity: number;
}

interface Props {
  emotion: string;
  frequency: number;
  bodyPatterns: BodyPattern[];
  effectiveCoping: string[];
  ineffectiveCoping: string[];
  firstIdentified: string;
  lastIdentified: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function formatZoneName(zone: string): string {
  return zone
    .replace(/_l$/, ' L')
    .replace(/_r$/, ' R')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DictionaryEntry({
  emotion,
  frequency,
  bodyPatterns,
  effectiveCoping,
  firstIdentified,
  lastIdentified,
}: Props) {
  const uniqueZones = [...new Set(bodyPatterns.map((p) => p.zone))];

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.emotion}>{emotion}</h3>
          <span className={styles.frequencyBadge}>
            {frequency}&times; identified
          </span>
        </div>

        {/* Body zones text */}
        {uniqueZones.length > 0 && (
          <div className={styles.zones}>
            {uniqueZones.slice(0, 4).map((z) => (
              <span key={z} className={styles.zoneChip}>
                {formatZoneName(z)}
              </span>
            ))}
            {uniqueZones.length > 4 && (
              <span className={styles.zoneMore}>+{uniqueZones.length - 4}</span>
            )}
          </div>
        )}

        {/* Effective coping */}
        {effectiveCoping.length > 0 && (
          <div className={styles.copingSection}>
            <span className={styles.copingLabel}>Helps:</span>
            <div className={styles.copingChips}>
              {effectiveCoping.slice(0, 3).map((c) => (
                <span key={c} className={styles.copingChip}>{c}</span>
              ))}
              {effectiveCoping.length > 3 && (
                <span className={styles.copingMore}>+{effectiveCoping.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className={styles.dates}>
          <span>First: {formatDate(firstIdentified)}</span>
          <span className={styles.dateSep}>&middot;</span>
          <span>Last: {formatDate(lastIdentified)}</span>
        </div>
      </div>

      {/* Body pattern mini-map */}
      <div className={styles.miniMap}>
        <BodyPatternMini patterns={bodyPatterns} />
      </div>
    </article>
  );
}
