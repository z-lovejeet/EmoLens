'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import styles from './ValidationMessage.module.css';

interface Props {
  message: string;
}

const validationAppear = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function ValidationMessage({ message }: Props) {
  return (
    <motion.div
      className={styles.container}
      variants={validationAppear}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.iconWrapper}>
        <Sparkles size={18} className={styles.icon} />
      </div>
      <p className={styles.text}>{message}</p>
    </motion.div>
  );
}
