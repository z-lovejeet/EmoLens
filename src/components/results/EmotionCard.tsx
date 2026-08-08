'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './EmotionCard.module.css';

interface Props {
  emotion: string;
  confidence: number;
  category?: string;
  explanation: string;
  possibleCauses?: string[];
  bodyConnection: string;
  isSelected: boolean;
  isDeselected: boolean;
  onSelect: () => void;
}

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },
};

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.75) return 'Strong match';
  if (confidence >= 0.5) return 'Possible match';
  return 'Worth exploring';
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.75) return 'var(--color-intensity-3)';
  if (confidence >= 0.5) return 'var(--color-intensity-2)';
  return 'var(--color-intensity-1)';
}

export function EmotionCard({
  emotion,
  confidence,
  category,
  explanation,
  possibleCauses,
  bodyConnection,
  isSelected,
  isDeselected,
  onSelect,
}: Props) {
  const accentColor = getConfidenceColor(confidence);

  return (
    <motion.button
      className={[
        styles.card,
        isSelected ? styles.selected : '',
        isDeselected ? styles.deselected : '',
      ]
        .filter(Boolean)
        .join(' ')}
      variants={cardReveal}
      onClick={onSelect}
      animate={
        isSelected
          ? { scale: 1.02, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }
          : isDeselected
            ? { opacity: 0.3, scale: 0.97, y: 8, transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as const } }
            : {}
      }
      style={{ '--accent': accentColor } as React.CSSProperties}
      whileHover={!isSelected && !isDeselected ? { translateY: -2 } : undefined}
      type="button"
      role="radio"
      aria-checked={isSelected}
    >
      {/* Left accent bar */}
      <div className={styles.accentBar} />

      <div className={styles.content}>
        {/* Top category row */}
        {category && (
          <div className={styles.topBadgeRow}>
            <span className={styles.categoryBadge}>{category}</span>
          </div>
        )}

        {/* Header row */}
        <div className={styles.header}>
          <h3 className={styles.emotion}>
            This might be <span className={styles.emotionName}>{emotion}</span>
          </h3>
          {isSelected && (
            <motion.div
              className={styles.checkmark}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
            >
              <Check size={18} />
            </motion.div>
          )}
        </div>

        {/* Confidence bar */}
        <div className={styles.confidenceRow}>
          <div className={styles.confidenceTrack}>
            <motion.div
              className={styles.confidenceFill}
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] as const }}
            />
          </div>
          <span className={styles.confidenceLabel}>{getConfidenceLabel(confidence)}</span>
        </div>

        {/* Detailed Explanation / What this is */}
        <div className={styles.detailBlock}>
          <h4 className={styles.detailTitle}>What this feels like:</h4>
          <p className={styles.explanation}>{explanation}</p>
        </div>

        {/* Possible Causes / Triggers */}
        {possibleCauses && possibleCauses.length > 0 && (
          <div className={styles.detailBlock}>
            <h4 className={styles.detailTitle}>Common causes &amp; triggers:</h4>
            <ul className={styles.causeList}>
              {possibleCauses.map((cause, i) => (
                <li key={i} className={styles.causeItem}>
                  {cause}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Body connection */}
        <div className={styles.bodyBlock}>
          <h4 className={styles.bodyTitle}>Your body connection:</h4>
          <p className={styles.bodyConnection}>{bodyConnection}</p>
        </div>

        {/* Select prompt */}
        {!isSelected && !isDeselected && (
          <div className={styles.selectPrompt}>
            <span>This feels right</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
