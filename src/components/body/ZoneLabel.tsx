'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import styles from './ZoneLabel.module.css';

interface ZoneLabelProps {
  label: string;
  position: [number, number, number];
}

export function ZoneLabel({ label, position }: ZoneLabelProps) {
  return (
    <Html
      position={position}
      center
      distanceFactor={6}
      sprite
      style={{ pointerEvents: 'none' }}
    >
      <motion.div
        className={styles.label}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
      >
        {label}
      </motion.div>
    </Html>
  );
}
