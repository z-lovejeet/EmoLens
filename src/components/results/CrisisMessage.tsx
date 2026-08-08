'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, HeartHandshake } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './CrisisMessage.module.css';

interface Props {
  message: string;
}

export function CrisisMessage({ message }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.6, ease: [0.33, 1, 0.68, 1] }}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.header}>
        <HeartHandshake size={28} className={styles.icon} strokeWidth={1.5} />
        <h2 className={styles.title}>You deserve support right now</h2>
      </div>

      <p className={styles.text}>{message}</p>

      <div className={styles.resources}>
        <a href="tel:988" className={styles.resourceCard}>
          <Phone size={20} />
          <div>
            <strong>988 Suicide &amp; Crisis Lifeline</strong>
            <span>Call or text 988 — available 24/7</span>
          </div>
        </a>
        <a href="sms:741741&body=HOME" className={styles.resourceCard}>
          <MessageCircle size={20} />
          <div>
            <strong>Crisis Text Line</strong>
            <span>Text HOME to 741741</span>
          </div>
        </a>
      </div>
    </motion.div>
  );
}
