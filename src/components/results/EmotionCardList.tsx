'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionCard } from './EmotionCard';
import type { EmotionSuggestion } from '@/lib/ai/state';
import styles from './EmotionCardList.module.css';

interface Props {
  suggestions: EmotionSuggestion[];
  onSelect: (emotion: string) => void;
  onReject: (reason?: string) => void;
  remapCount: number;
  isLoading: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

export function EmotionCardList({
  suggestions,
  onSelect,
  onReject,
  remapCount,
  isLoading,
}: Props) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');
  const showFreeText = remapCount >= 2;

  const handleSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    // Small delay so user sees the selection animation
    setTimeout(() => onSelect(emotion), 600);
  };

  const handleFreeTextSubmit = () => {
    if (freeText.trim()) {
      onSelect(freeText.trim());
    }
  };

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={suggestions.map((s) => s.emotion).join(',')}
          className={styles.list}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          role="radiogroup"
          aria-label="Emotion suggestions — select the emotion that best matches how you feel"
        >
          {suggestions.map((suggestion) => (
            <EmotionCard
              key={suggestion.emotion}
              emotion={suggestion.emotion}
              confidence={suggestion.confidence}
              category={suggestion.category}
              explanation={suggestion.explanation}
              possibleCauses={suggestion.possibleCauses}
              bodyConnection={suggestion.bodyConnection}
              isSelected={selectedEmotion === suggestion.emotion}
              isDeselected={selectedEmotion !== null && selectedEmotion !== suggestion.emotion}
              onSelect={() => handleSelect(suggestion.emotion)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Rejection / Free-text area */}
      {!selectedEmotion && (
        <motion.div
          className={styles.rejectArea}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {showFreeText ? (
            <div className={styles.freeTextBox}>
              <p className={styles.freeTextLabel}>
                Tell us in your own words — what do you think you might be feeling?
              </p>
              <div className={styles.freeTextRow}>
                <input
                  type="text"
                  className={styles.freeTextInput}
                  placeholder="In my own words, I think I feel..."
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
                  maxLength={100}
                />
                <button
                  className={styles.freeTextSubmit}
                  onClick={handleFreeTextSubmit}
                  disabled={!freeText.trim()}
                  type="button"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <button
              className={styles.rejectBtn}
              onClick={() => onReject()}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? (
                <span className={styles.loadingDots}>
                  <span /><span /><span />
                </span>
              ) : (
                'None of these feel right'
              )}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
