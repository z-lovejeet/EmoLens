'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useCheckinStore, ZONE_LABELS } from '@/lib/store/checkinStore';
import type { ZoneId } from '@/lib/store/checkinStore';
import { getSensationsForZone } from '@/constants/sensations';
import { Chip } from '@/components/ui/Chip';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import styles from './SensationPanel.module.css';

// ── Animation variants from Animation Bible ──

// PANEL-01: Mobile drawer
const drawerVariants = {
  hidden: { y: '100%', x: 0, opacity: 0.8 },
  visible: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 28, stiffness: 300, mass: 0.8 },
  },
  exit: {
    y: '100%',
    x: 0,
    opacity: 0.8,
    transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] },
  },
};

// PANEL-02: Desktop side panel
const sidePanelVariants = {
  hidden: { x: '100%', y: 0, opacity: 0 },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 25, stiffness: 250 },
  },
  exit: {
    x: '100%',
    y: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] },
  },
};

// PANEL-03: Chip stagger container
const chipContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

const chipItemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] },
  },
};

// Backdrop
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Selected item enter/exit
const selectedItemVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: {
    opacity: 1,
    height: 'auto' as const,
    marginBottom: 0,
    transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.2 },
  },
};

// ── Responsive hook ──

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}

// ── Component ──

export function SensationPanel() {
  // ALL hooks called unconditionally at top level
  const {
    activeZone,
    zoneData,
    addSensation,
    removeSensation,
    clearZone,
    deselectZone,
  } = useCheckinStore();

  const [isCustomInput, setIsCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');
  const customInputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useIsDesktop();

  const zone = (activeZone || 'chest') as ZoneId;
  const sensationDefs = activeZone ? getSensationsForZone(zone) : [];
  const currentSensations = activeZone ? (zoneData[zone]?.sensations ?? []) : [];

  const isSensationSelected = useCallback(
    (type: string) => currentSensations.some((s) => s.type === type),
    [currentSensations]
  );

  const handleToggleSensation = useCallback(
    (type: string) => {
      if (!activeZone) return;
      const idx = currentSensations.findIndex((s) => s.type === type);
      if (idx >= 0) {
        removeSensation(zone, idx);
      } else {
        addSensation(zone, { type, intensity: 3 });
      }
    },
    [activeZone, zone, currentSensations, addSensation, removeSensation]
  );

  const handleIntensityChange = useCallback(
    (index: number, newIntensity: number) => {
      if (!activeZone) return;
      const sensation = currentSensations[index];
      if (!sensation) return;
      removeSensation(zone, index);
      addSensation(zone, { type: sensation.type, intensity: newIntensity });
    },
    [activeZone, zone, currentSensations, addSensation, removeSensation]
  );

  const handleCustomSubmit = useCallback(() => {
    if (!activeZone) return;
    const trimmed = customText.trim();
    if (trimmed && !isSensationSelected(trimmed)) {
      addSensation(zone, { type: trimmed, intensity: 3 });
    }
    setCustomText('');
    setIsCustomInput(false);
  }, [activeZone, customText, isSensationSelected, zone, addSensation]);

  const handleApply = useCallback(() => {
    deselectZone();
  }, [deselectZone]);

  const handleClear = useCallback(() => {
    if (!activeZone) return;
    clearZone(zone);
  }, [activeZone, clearZone, zone]);

  // Early return AFTER all hooks have executed
  if (!activeZone) return null;

  const panelVariants = isDesktop ? sidePanelVariants : drawerVariants;

  return (
    <>
      {/* Backdrop (mobile only) */}
      {!isDesktop && (
        <AnimatePresence>
          <motion.div
            className={styles.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={deselectZone}
          />
        </AnimatePresence>
      )}

      {/* Panel */}
      <motion.div
        className={styles.panel}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="region"
        aria-label={`Sensation selection panel for ${ZONE_LABELS[zone]}`}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Escape') deselectZone();
        }}
      >
        {/* Mobile drag handle */}
        <div className={styles.dragHandle}>
          <div className={styles.dragBar} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.zoneName}>{ZONE_LABELS[zone]}</h2>
            <p className={styles.zoneHint}>
              Select what you feel in this area
            </p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={deselectZone}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className={styles.content}>
          {/* Sensation chips */}
          <fieldset className={styles.chipFieldset}>
            <legend className={styles.sectionTitle}>Select sensations for {ZONE_LABELS[zone]}</legend>
            <motion.div
              className={styles.chipGrid}
              variants={chipContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {sensationDefs.map((def) => (
                <motion.div key={def.type} variants={chipItemVariants}>
                  <Chip
                    label={def.type}
                    selected={isSensationSelected(def.type)}
                    onToggle={() => handleToggleSensation(def.type)}
                  />
                </motion.div>
              ))}

              {/* Custom sensation input */}
              <motion.div
                variants={chipItemVariants}
                className={styles.customChipWrapper}
              >
                <AnimatePresence mode="wait">
                  {isCustomInput ? (
                    <motion.div
                      key="input"
                      className={styles.customInputRow}
                      layoutId="custom-chip"
                      transition={{
                        layout: {
                          duration: 0.3,
                          ease: [0.65, 0, 0.35, 1],
                        },
                      }}
                    >
                      <input
                        ref={customInputRef}
                        className={styles.customInput}
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCustomSubmit();
                          if (e.key === 'Escape') {
                            setCustomText('');
                            setIsCustomInput(false);
                          }
                        }}
                        placeholder="Type a sensation…"
                        maxLength={30}
                        autoFocus
                      />
                      <button
                        className={styles.customSubmitBtn}
                        onClick={handleCustomSubmit}
                        disabled={!customText.trim()}
                      >
                        Add
                      </button>
                      <button
                        className={styles.customCancelBtn}
                        onClick={() => {
                          setCustomText('');
                          setIsCustomInput(false);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chip"
                      layoutId="custom-chip"
                      transition={{
                        layout: {
                          duration: 0.3,
                          ease: [0.65, 0, 0.35, 1],
                        },
                      }}
                    >
                      <Chip
                        label="Add your own"
                        icon={<Plus size={14} />}
                        onToggle={() => {
                          setIsCustomInput(true);
                          setTimeout(
                            () => customInputRef.current?.focus(),
                            100
                          );
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </fieldset>

          {/* Selected sensations with intensity sliders */}
          <div>
            <p className={styles.sectionTitle}>
              Selected ({currentSensations.length})
            </p>
            {currentSensations.length === 0 ? (
              <p className={styles.emptyState}>
                Select sensations above to set their intensity
              </p>
            ) : (
              <div className={styles.selectedList}>
                <AnimatePresence>
                  {currentSensations.map((sensation, index) => (
                    <motion.div
                      key={sensation.type}
                      className={styles.selectedItem}
                      variants={selectedItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <div className={styles.selectedItemHeader}>
                        <span className={styles.selectedItemLabel}>
                          {sensation.type}
                        </span>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeSensation(zone, index)}
                          aria-label={`Remove ${sensation.type}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <Slider
                        value={sensation.intensity}
                        onChange={(val) => handleIntensityChange(index, val)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={currentSensations.length === 0}
          >
            Clear
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </motion.div>
    </>
  );
}
