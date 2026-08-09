'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X } from 'lucide-react';
import { useAccessibilityStore } from '@/lib/store/accessibilityStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './AccessibilityPanel.module.css';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const {
    reducedMotion,
    fontSize,
    highContrast,
    toggleReducedMotion,
    setFontSize,
    toggleHighContrast,
  } = useAccessibilityStore();

  const prefersReducedMotion = useReducedMotion();

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const panelVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const transition = prefersReducedMotion || reducedMotion 
    ? { duration: 0 } 
    : { type: 'spring' as const, damping: 25, stiffness: 200 };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className={styles.panel}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={transition}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility Settings"
          >
            <div className={styles.header}>
              <h2 className={styles.title}>
                <Settings2 size={24} />
                Accessibility
              </h2>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close accessibility panel"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.section}>
              <div className={styles.toggleContainer}>
                <div className={styles.sectionHeader}>
                  <span className={styles.label} id="label-reduced-motion">Reduce animations</span>
                  <span className={styles.description}>Minimizes motion throughout the app</span>
                </div>
                <div
                  className={styles.switchWrapper}
                  role="switch"
                  aria-checked={reducedMotion}
                  aria-labelledby="label-reduced-motion"
                  tabIndex={0}
                  onClick={toggleReducedMotion}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleReducedMotion();
                    }
                  }}
                >
                  <div className={styles.switch}>
                    <div className={styles.switchThumb} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.label} id="label-font-size">Font Size</span>
              </div>
              <div className={styles.radioGroup} role="radiogroup" aria-labelledby="label-font-size">
                {(['default', 'large', 'x-large'] as const).map((size) => (
                  <button
                    key={size}
                    role="radio"
                    aria-checked={fontSize === size}
                    className={styles.radioButton}
                    onClick={() => setFontSize(size)}
                  >
                    {size === 'default' ? 'Default' : size === 'large' ? 'Large' : 'Extra Large'}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.toggleContainer}>
                <div className={styles.sectionHeader}>
                  <span className={styles.label} id="label-high-contrast">High contrast</span>
                  <span className={styles.description}>Increases text contrast for readability</span>
                </div>
                <div
                  className={styles.switchWrapper}
                  role="switch"
                  aria-checked={highContrast}
                  aria-labelledby="label-high-contrast"
                  tabIndex={0}
                  onClick={toggleHighContrast}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleHighContrast();
                    }
                  }}
                >
                  <div className={styles.switch}>
                    <div className={styles.switchThumb} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
