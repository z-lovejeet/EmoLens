'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, Maximize2, Download } from 'lucide-react';
import type { CardData } from '@/lib/ai/state';
import styles from './CommunicationCard.module.css';

interface Props {
  card: CardData;
}

function getIntensityColor(level: string) {
  switch (level) {
    case 'mild': return 'var(--color-intensity-2)';
    case 'moderate': return 'var(--color-intensity-3)';
    case 'strong': return 'var(--color-intensity-4)';
    default: return 'var(--color-intensity-2)';
  }
}

export function CommunicationCard({ card }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const intensityColor = getIntensityColor(card.intensityLevel);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `How I'm feeling: ${card.emotion}`,
          text: `I'm experiencing ${card.emotion} (${card.intensityLevel}). What helps me: ${card.whatHelpsMe.join(', ')}`,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <div className={styles.section}>
      <motion.h3
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        Your communication card
      </motion.h3>

      <motion.div
        ref={cardRef}
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        style={{ '--intensity-color': intensityColor } as React.CSSProperties}
      >
        {/* Emotion title */}
        <h4 className={styles.emotion}>{card.emotion}</h4>

        {/* Intensity badge */}
        <span className={styles.badge}>{card.intensityLevel}</span>

        {/* Divider */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ transformOrigin: 'left center' }}
        />

        {/* What helps me */}
        <div className={styles.helpSection}>
          <h5 className={styles.helpTitle}>What helps me right now:</h5>
          <ul className={styles.helpList}>
            {card.whatHelpsMe.map((item, i) => (
              <motion.li
                key={i}
                className={styles.helpItem}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Validation */}
        <motion.p
          className={styles.validation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          {card.validationMessage}
        </motion.p>
      </motion.div>

      {/* Actions */}
      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <button className={styles.actionBtn} onClick={handleShare} type="button">
          <Share2 size={16} /> Share
        </button>
        <button className={styles.actionBtn} type="button">
          <Maximize2 size={16} /> Full Screen
        </button>
        <button className={styles.actionBtn} type="button">
          <Download size={16} /> Save
        </button>
      </motion.div>
    </div>
  );
}
