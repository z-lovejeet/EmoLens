'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import styles from './CopingCard.module.css';

interface Props {
  name: string;
  icon: string;
  category: string;
  shortDescription: string;
  fullInstructions: string;
  matchReason: string;
  onFeedback?: (helpful: boolean) => void;
}

function getIconComponent(iconName: string) {
  const PascalName = iconName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[PascalName];
  return Icon ? <Icon size={20} /> : <LucideIcons.Sparkles size={20} />;
}

const copingCardVariant = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },
};

interface ParsedStep {
  stepNum: number;
  text: string;
}

function parseInstructionsSteps(fullInstructions: string): ParsedStep[] {
  if (!fullInstructions) return [];

  // Match "Step 1: ...", "Step 2: ..." or "1. ... 2. ..." pattern
  const stepRegex = /(?:Step\s*(\d+)[\:\.\-\s]*|(\d+)[\:\.\-\s]+)/gi;
  const matches = [...fullInstructions.matchAll(stepRegex)];

  if (matches.length > 0) {
    const steps: ParsedStep[] = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const nextMatch = matches[i + 1];
      const startIdx = match.index! + match[0].length;
      const endIdx = nextMatch ? nextMatch.index! : fullInstructions.length;
      const stepText = fullInstructions.slice(startIdx, endIdx).trim();
      const num = parseInt(match[1] || match[2] || `${i + 1}`, 10);
      if (stepText) {
        steps.push({ stepNum: num, text: stepText });
      }
    }
    if (steps.length > 0) return steps;
  }

  // Fallback: split by newlines
  const lines = fullInstructions.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines.map((line, idx) => ({
      stepNum: idx + 1,
      text: line.replace(/^(?:Step\s*\d+[\:\.\-\s]*|\d+[\:\.\-\s]+)/i, ''),
    }));
  }

  return [{ stepNum: 1, text: fullInstructions }];
}

export function CopingCard({
  name,
  icon,
  category,
  shortDescription,
  fullInstructions,
  matchReason,
  onFeedback,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleFeedback = (helpful: boolean) => {
    setFeedback(helpful);
    onFeedback?.(helpful);
  };

  const parsedSteps = parseInstructionsSteps(fullInstructions);

  return (
    <motion.div className={styles.card} variants={copingCardVariant}>
      {/* Header — always visible */}
      <button
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        type="button"
        aria-expanded={expanded}
      >
        <div className={styles.iconBox}>
          {getIconComponent(icon)}
        </div>
        <div className={styles.headerText}>
          <h4 className={styles.name}>{name}</h4>
          <p className={styles.desc}>{shortDescription}</p>
        </div>
        <div className={styles.categoryBadge}>{category}</div>
        <motion.div
          className={styles.chevron}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.expandedContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className={styles.instructions}>
              <h5 className={styles.instructionsTitle}>How to do it:</h5>
              <div className={styles.stepsList}>
                {parsedSteps.map((step, idx) => (
                  <div key={`step-${idx}-${step.stepNum}`} className={styles.stepRow}>
                    <span className={styles.stepBadge}>Step {step.stepNum}</span>
                    <span className={styles.stepText}>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {matchReason && (
              <div className={styles.matchBox}>
                <div className={styles.matchReason}>
                  <LucideIcons.Sparkles size={14} className={styles.matchIcon} />
                  <span>{matchReason}</span>
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className={styles.feedbackRow}>
              <span className={styles.feedbackLabel}>Was this helpful?</span>
              <div className={styles.feedbackBtns}>
                <button
                  className={`${styles.feedbackBtn} ${feedback === true ? styles.feedbackActive : ''}`}
                  onClick={() => handleFeedback(true)}
                  type="button"
                  aria-label="Helpful"
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  className={`${styles.feedbackBtn} ${feedback === false ? styles.feedbackActive : ''}`}
                  onClick={() => handleFeedback(false)}
                  type="button"
                  aria-label="Not helpful"
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
