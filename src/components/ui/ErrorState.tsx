'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, type LucideIcon } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: LucideIcon;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\u2019t complete that request. Please check your connection and try again.',
  onRetry,
  retryLabel = 'Try Again',
  icon: Icon = AlertTriangle,
}: ErrorStateProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: [0.33, 1, 0.68, 1] }}
      role="alert"
    >
      <div className={styles.iconWrapper}>
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button
          className={styles.retryBtn}
          onClick={onRetry}
          type="button"
        >
          <RefreshCw size={16} strokeWidth={2} />
          {retryLabel}
        </button>
      )}
    </motion.div>
  );
}
