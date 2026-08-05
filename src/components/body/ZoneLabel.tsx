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
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <motion.div
        className={styles.label}
        initial={{ opacity: 0, scale: 0.9, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
      >
        {label}
      </motion.div>
    </Html>
  );
}
