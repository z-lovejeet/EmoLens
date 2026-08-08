'use client';

import { useState, useEffect, use } from 'react';
import { Heart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

interface SharedCardData {
  emotion: string;
  intensityLevel: 'mild' | 'moderate' | 'strong';
  whatHelpsMe: string[];
  validationMessage: string;
}

function getIntensityConfig(level: string) {
  switch (level) {
    case 'mild': return { color: '#88d4ab', label: 'Mild', bg: 'rgba(136, 212, 171, 0.15)' };
    case 'moderate': return { color: '#8ecae6', label: 'Moderate', bg: 'rgba(142, 202, 230, 0.15)' };
    case 'strong': return { color: '#d4807a', label: 'Strong', bg: 'rgba(212, 128, 122, 0.15)' };
    default: return { color: '#8ecae6', label: level, bg: 'rgba(142, 202, 230, 0.15)' };
  }
}

export default function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const [card, setCard] = useState<SharedCardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to decode card data from URL search params
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam));
        setCard(decoded);
        setLoading(false);
        return;
      } catch (e) {
        console.error('[CardPage] Failed to decode card data from URL:', e);
      }
    }

    // Try IndexedDB fallback
    async function tryIndexedDB() {
      try {
        const { getCardLocal } = await import('@/lib/db/local/cardOperations');
        const localCard = await getCardLocal(resolvedParams.id);
        if (localCard) {
          setCard({
            emotion: localCard.emotion,
            intensityLevel: localCard.intensity_level,
            whatHelpsMe: localCard.what_helps_me,
            validationMessage: localCard.validation_message ?? '',
          });
        }
      } catch (e) {
        console.error('[CardPage] IndexedDB lookup failed:', e);
      }
      setLoading(false);
    }
    tryIndexedDB();
  }, [searchParams, resolvedParams.id]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingPulse} />
          <p className={styles.loadingText}>Loading card...</p>
        </div>
      </main>
    );
  }

  if (!card) {
    return (
      <main className={styles.page}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>Card Not Found</h1>
          <p className={styles.errorText}>This communication card may have expired or the link is invalid.</p>
        </div>
      </main>
    );
  }

  const intensity = getIntensityConfig(card.intensityLevel);

  return (
    <main className={styles.page}>
      <article
        className={styles.card}
        aria-label={`Communication card for ${card.emotion}`}
        style={{ '--intensity-color': intensity.color, '--intensity-bg': intensity.bg } as React.CSSProperties}
      >
        {/* Label */}
        <p className={styles.label}>I&apos;m feeling</p>

        {/* Emotion Title */}
        <h1 className={styles.emotion}>{card.emotion}</h1>

        {/* Intensity Badge */}
        <span className={styles.badge}>{intensity.label}</span>

        {/* Divider */}
        <div className={styles.divider} />

        {/* What helps me */}
        <div className={styles.helpSection}>
          <h2 className={styles.helpTitle}>What helps me right now:</h2>
          <ul className={styles.helpList}>
            {card.whatHelpsMe.map((item, i) => (
              <li key={i} className={styles.helpItem}>
                <span className={styles.helpDot} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Validation */}
        <p className={styles.validation}>{card.validationMessage}</p>
      </article>

      {/* Powered by */}
      <div className={styles.poweredBy}>
        <Heart size={12} />
        <span>Powered by EmoLens</span>
      </div>
    </main>
  );
}
