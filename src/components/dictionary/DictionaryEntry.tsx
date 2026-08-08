'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Activity, Sparkles, Calendar } from 'lucide-react';
import { getAllCardsLocal, saveCardLocal } from '@/lib/db/local/cardOperations';
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
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  const handleCardClick = async () => {
    if (opening) return;
    setOpening(true);

    try {
      // Look for existing saved card for this emotion
      const cards = await getAllCardsLocal();
      const existing = cards.find(
        (c) => c.emotion.toLowerCase() === emotion.toLowerCase()
      );

      if (existing) {
        router.push(`/card/${existing.id}`);
        return;
      }

      // Generate a new card entry dynamically if none exists
      const newCardId = crypto.randomUUID();
      const newCard = {
        id: newCardId,
        checkin_id: null,
        emotion: emotion,
        intensity_level: 'moderate' as const,
        what_helps_me:
          effectiveCoping.length > 0
            ? effectiveCoping
            : ['Deep breathing', 'Taking a quiet pause', 'Grounding exercise'],
        validation_message: `When experiencing ${emotion.toLowerCase()}, taking a brief pause and acknowledging body signals helps bring clarity.`,
        created_at: new Date().toISOString(),
        synced: false,
        synced_at: null,
      };

      await saveCardLocal(newCard);
      router.push(`/card/${newCardId}`);
    } catch (err) {
      console.error('[DictionaryEntry] Failed to open card:', err);
    } finally {
      setOpening(false);
    }
  };

  // Collect unique zone-sensation summary
  const zoneSummary = bodyPatterns.map((p) => {
    const formattedZone = formatZoneName(p.zone);
    const sensationStr = p.sensations.length > 0 ? p.sensations.slice(0, 2).join(', ') : '';
    return sensationStr ? `${formattedZone} (${sensationStr})` : formattedZone;
  });

  return (
    <article
      className={styles.card}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View detailed communication card for ${emotion}`}
    >
      <div className={styles.topGlow} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h3 className={styles.emotion}>{emotion}</h3>
            <span className={styles.frequencyBadge}>
              {frequency}&times; identified
            </span>
          </div>

          <div className={styles.arrowBadge}>
            <ArrowUpRight size={18} className={styles.arrowIcon} />
          </div>
        </div>

        {/* Body Signals */}
        {zoneSummary.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              <Activity size={12} />
              Body Signals
            </span>
            <div className={styles.chips}>
              {zoneSummary.slice(0, 3).map((z, idx) => (
                <span key={idx} className={styles.zoneChip}>
                  {z}
                </span>
              ))}
              {zoneSummary.length > 3 && (
                <span className={styles.moreChip}>+{zoneSummary.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Effective Coping */}
        {effectiveCoping.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              <Sparkles size={12} />
              What Helps
            </span>
            <div className={styles.chips}>
              {effectiveCoping.slice(0, 3).map((c) => (
                <span key={c} className={styles.copingChip}>
                  {c}
                </span>
              ))}
              {effectiveCoping.length > 3 && (
                <span className={styles.moreCopingChip}>+{effectiveCoping.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className={styles.footer}>
          <div className={styles.dates}>
            <Calendar size={12} />
            <span>First: {formatDate(firstIdentified)}</span>
            <span className={styles.dateSep}>&middot;</span>
            <span>Last: {formatDate(lastIdentified)}</span>
          </div>

          <span className={styles.actionHint}>
            {opening ? 'Opening card...' : 'Tap for Card'}
          </span>
        </div>
      </div>
    </article>
  );
}
