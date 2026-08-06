'use client';

import { useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Send, Loader2, ArrowRight } from 'lucide-react';
import { useCheckinStore } from '@/lib/store/checkinStore';
import styles from './CheckInButton.module.css';

interface CheckInButtonProps {
  onSubmit: () => void;
}

export function CheckInButton({ onSubmit }: CheckInButtonProps) {
  const { zoneData, isZoomed, isProcessing } = useCheckinStore();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic cursor physics
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { damping: 14, stiffness: 140, mass: 0.1 };
  const magneticX = useSpring(rawX, springConfig);
  const magneticY = useSpring(rawY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Magnet pull range: 0.35x displacement
    rawX.set(distanceX * 0.35);
    rawY.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const zonesWithData = Object.values(zoneData).filter(
    (z) => z.sensations.length > 0
  ).length;

  const totalSensations = Object.values(zoneData).reduce(
    (acc, z) => acc + z.sensations.length,
    0
  );

  const shouldShow = totalSensations > 0 && !isZoomed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <div className={styles.container}>
          <motion.button
            ref={buttonRef}
            className={styles.button}
            onClick={onSubmit}
            disabled={isProcessing}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: magneticX, y: magneticY }}
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.85 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            whileTap={{ scale: 0.94 }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <span className={styles.btnText}>Check In</span>
                <span className={styles.badge}>
                  {zonesWithData} {zonesWithData === 1 ? 'zone' : 'zones'}
                </span>
                <div className={styles.arrowIcon}>
                  <ArrowRight size={15} />
                </div>
              </>
            )}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
