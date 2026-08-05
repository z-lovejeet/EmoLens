'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import styles from './ZoneLabel.module.css';

interface ZoneLabelProps {
  label: string;
  position: [number, number, number];
}

export function ZoneLabel({ label, position }: ZoneLabelProps) {
  // Elevate label slightly above target center so it floats above sphere highlight
  const labelPosition: [number, number, number] = [
    position[0],
    position[1] + 0.12,
    position[2] + 0.04,
  ];

  return (
    <Html
      position={labelPosition}
      center
      distanceFactor={10}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <motion.div
        className={styles.label}
        initial={{ opacity: 0, y: 6, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
      >
        <span className={styles.dot} />
        <span className={styles.text}>{label}</span>
      </motion.div>
    </Html>
  );
}
