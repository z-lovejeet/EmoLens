'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useDictionaryStore } from '@/lib/store/dictionaryStore';
import { DictionaryEntry } from '@/components/dictionary/DictionaryEntry';
import { EmptyState } from '@/components/dictionary/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Timeline } from '@/components/dictionary/Timeline';
import styles from './page.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  },
};

export default function DictionaryPage() {
  const { entries, isLoaded, isLoading, loadFromLocal } = useDictionaryStore();

  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  return (
    <main className={styles.page}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className={styles.headerIcon}>
          <BookOpen size={22} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className={styles.title}>My Emotion Dictionary</h1>
          <p className={styles.subtitle}>
            {isLoaded && entries.length > 0
              ? `${entries.length} emotion${entries.length !== 1 ? 's' : ''} identified`
              : 'Your personal body-emotion vocabulary'}
          </p>
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className={styles.grid}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty state */}
      {isLoaded && entries.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <EmptyState />
        </motion.div>
      )}

      {/* Timeline */}
      {isLoaded && entries.length >= 2 && <Timeline entries={entries} />}

      {/* Entry grid */}
      {isLoaded && entries.length > 0 && (
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {entries.map((entry) => (
            <motion.div key={entry.id} variants={itemVariants}>
              <DictionaryEntry
                emotion={entry.emotion}
                frequency={entry.frequency}
                bodyPatterns={entry.body_patterns}
                effectiveCoping={entry.effective_coping}
                ineffectiveCoping={entry.ineffective_coping}
                firstIdentified={entry.first_identified}
                lastIdentified={entry.last_identified}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
