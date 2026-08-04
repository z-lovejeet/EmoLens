'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertTriangle, Info } from 'lucide-react';
import { useToastStore } from '@/lib/store/toastStore';
import styles from './Toast.module.css';

export function Toast() {
  const { id, message, type, visible, dismiss } = useToastStore();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, id, dismiss]);

  const Icon = type === 'success' ? Check : type === 'error' ? AlertTriangle : Info;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={id}
          className={styles.toast}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] } }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
          role="alert"
          aria-live="polite"
        >
          <Icon className={`${styles.icon} ${styles[type]}`} size={18} />
          <span className={styles.message}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
