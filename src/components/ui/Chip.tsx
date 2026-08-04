'use client';

import { motion } from 'framer-motion';
import styles from './Chip.module.css';
import type { ReactNode } from 'react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  icon?: ReactNode;
  className?: string;
}

export function Chip({ label, selected = false, onToggle, icon, className }: ChipProps) {
  return (
    <motion.button
      type="button"
      className={[
        styles.chip,
        selected ? styles.selected : '',
        className || '',
      ].filter(Boolean).join(' ')}
      onClick={() => onToggle?.(!selected)}
      whileTap={{ scale: 0.95 }}
      aria-pressed={selected}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
}
