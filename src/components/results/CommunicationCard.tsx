'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Maximize2, Download, X, Sparkles, Check, HeartHandshake } from 'lucide-react';
import type { CardData } from '@/lib/ai/state';
import { useToastStore } from '@/lib/store/toastStore';
import { exportCardAsPng } from '@/lib/utils/cardExport';
import { saveCardLocal } from '@/lib/db/local/cardOperations';
import styles from './CommunicationCard.module.css';

interface Props {
  card: CardData;
}

function getIntensityColor(level: string) {
  switch (level.toLowerCase()) {
    case 'mild':
      return { bg: 'rgba(136, 212, 171, 0.15)', border: 'rgba(136, 212, 171, 0.3)', text: '#88d4ab', label: 'Mild Intensity' };
    case 'moderate':
      return { bg: 'rgba(142, 202, 230, 0.15)', border: 'rgba(142, 202, 230, 0.3)', text: '#8ecae6', label: 'Moderate Intensity' };
    case 'strong':
    case 'high':
    case 'intense':
      return { bg: 'rgba(212, 128, 122, 0.15)', border: 'rgba(212, 128, 122, 0.3)', text: '#d4807a', label: 'Strong Intensity' };
    default:
      return { bg: 'rgba(184, 169, 201, 0.15)', border: 'rgba(184, 169, 201, 0.3)', text: '#b8a9c9', label: level };
  }
}

export function CommunicationCard({ card }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const showToast = useToastStore((state) => state.show);

  const intensity = getIntensityColor(card.intensityLevel);

  // Close full screen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Share handler
  const handleShare = async () => {
    const shareText = `EmoLens Communication Card\nEmotion: ${card.emotion} (${card.intensityLevel})\n\nWhat helps me right now:\n${card.whatHelpsMe.map((item) => `• ${item}`).join('\n')}\n\nNote: ${card.validationMessage || ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `EmoLens Card — ${card.emotion}`,
          text: shareText,
        });
        showToast('Card shared successfully', 'success');
        return;
      } catch {
        // User cancelled or share failed — fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Card details copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy card details', 'error');
    }
  };

  // Full Screen handler
  const handleFullScreen = () => {
    setIsFullscreen(true);
    showToast('Hold-up Mode active — press Esc or tap X to close', 'info');
  };

  // Save handler
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Save locally to IndexedDB
      await saveCardLocal({
        id: card.id || crypto.randomUUID(),
        checkin_id: null,
        emotion: card.emotion,
        intensity_level: (card.intensityLevel as 'mild' | 'moderate' | 'strong') || 'moderate',
        what_helps_me: card.whatHelpsMe,
        validation_message: card.validationMessage || null,
        created_at: card.generatedAt || new Date().toISOString(),
        synced: false,
        synced_at: null,
      });

      // Export card as PNG image
      if (cardRef.current) {
        await exportCardAsPng(cardRef.current, `emolens-card-${card.emotion.toLowerCase()}.png`);
      }

      showToast('Card saved as image & stored in your cards!', 'success');
    } catch (err) {
      console.error('Save failed:', err);
      showToast('Card saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.section}>
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className={styles.sectionTitle}>Communication Card</h3>
        <p className={styles.sectionSubtitle}>
          Show this to teachers, parents, or friends when you prefer not to speak
        </p>
      </motion.div>

      {/* Main Card View */}
      <motion.div
        ref={cardRef}
        className={styles.card}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* Card Top Label */}
        <div className={styles.cardMeta}>
          <span className={styles.metaBadge}>
            <Sparkles size={12} />
            EMOLENS CARD
          </span>
          <span
            className={styles.intensityBadge}
            style={{
              background: intensity.bg,
              borderColor: intensity.border,
              color: intensity.text,
            }}
          >
            {intensity.label}
          </span>
        </div>

        {/* Emotion title */}
        <h4 className={styles.emotion}>{card.emotion}</h4>

        {/* Divider */}
        <div className={styles.divider} />

        {/* What helps me */}
        <div className={styles.helpSection}>
          <h5 className={styles.helpTitle}>What helps me right now:</h5>
          <ul className={styles.helpList}>
            {card.whatHelpsMe.map((item, i) => (
              <li key={i} className={styles.helpItem}>
                <span className={styles.bulletPoint} style={{ background: intensity.text }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Validation / Reader note */}
        {card.validationMessage && (
          <div className={styles.validationBox}>
            <HeartHandshake size={16} className={styles.validationIcon} />
            <p className={styles.validation}>{card.validationMessage}</p>
          </div>
        )}
      </motion.div>

      {/* Actions toolbar */}
      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <button
          className={styles.actionBtn}
          onClick={handleShare}
          type="button"
          title="Share or copy card text"
        >
          {copied ? <Check size={16} color="#88d4ab" /> : <Share2 size={16} />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleFullScreen}
          type="button"
          title="Open Full Screen Hold-up Mode for displaying to others"
        >
          <Maximize2 size={16} />
          <span>Full Screen</span>
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleSave}
          disabled={saving}
          type="button"
          title="Save as PNG image & store locally"
        >
          <Download size={16} />
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </motion.div>

      {/* Hold-up Mode Full Screen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className={styles.fullscreenOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.fullscreenHeader}>
              <span className={styles.fullscreenLabel}>EMOLENS HOLD-UP MODE</span>
              <button
                className={styles.closeBtn}
                onClick={() => setIsFullscreen(false)}
                type="button"
                aria-label="Close full screen"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.fullscreenCard}>
              <span
                className={styles.fullscreenIntensity}
                style={{
                  background: intensity.bg,
                  borderColor: intensity.border,
                  color: intensity.text,
                }}
              >
                {intensity.label}
              </span>

              <h2 className={styles.fullscreenEmotion}>{card.emotion}</h2>

              <div className={styles.fullscreenHelpSection}>
                <h3 className={styles.fullscreenHelpTitle}>WHAT HELPS ME RIGHT NOW:</h3>
                <ul className={styles.fullscreenHelpList}>
                  {card.whatHelpsMe.map((item, i) => (
                    <li key={i} className={styles.fullscreenHelpItem}>
                      <span className={styles.fullscreenBullet} style={{ background: intensity.text }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {card.validationMessage && (
                <div className={styles.fullscreenValidation}>
                  <p>{card.validationMessage}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
