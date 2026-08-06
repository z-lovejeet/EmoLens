'use client';

import { Sparkles } from 'lucide-react';
import { useCheckinStore } from '@/lib/store/checkinStore';
import styles from './ContextInput.module.css';

export function ContextInput() {
  const { context, setContext } = useCheckinStore();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Sparkles size={15} className={styles.icon} />
          <label className={styles.label} htmlFor="context-input">
            What&apos;s happening right now?
          </label>
        </div>
        <span className={styles.optional}>optional</span>
      </div>

      <textarea
        id="context-input"
        className={styles.textarea}
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="e.g. Just had a difficult conversation, about to take a test…"
        maxLength={200}
        rows={3}
      />

      <div className={styles.footer}>
        <span className={styles.counter}>{context.length} / 200</span>
      </div>
    </div>
  );
}
