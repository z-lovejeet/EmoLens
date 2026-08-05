'use client';

import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ZoneBadge.module.css';

interface ZoneBadgeProps {
  count: number;
  position: [number, number, number];
}

export function ZoneBadge({ count, position }: ZoneBadgeProps) {
  return (
    <Html
      position={position}
      center
      distanceFactor={5}
      sprite
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <AnimatePresence>
        <motion.div
          className={styles.badge}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {count}
        </motion.div>
      </AnimatePresence>
    </Html>
  );
}
