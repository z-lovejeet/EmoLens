'use client';

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, Calendar, Activity } from 'lucide-react';
import type { DictionaryLocalEntry } from '@/lib/store/dictionaryStore';
import styles from './Timeline.module.css';

interface TimelineProps {
  entries: DictionaryLocalEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  const { sortedEntries, totalCheckins, dateRange } = useMemo(() => {
    if (!entries || entries.length < 2) {
      return { sortedEntries: [], totalCheckins: 0, dateRange: '' };
    }

    const sorted = [...entries].sort(
      (a, b) => new Date(a.first_identified).getTime() - new Date(b.first_identified).getTime()
    );

    const total = entries.reduce((sum, entry) => sum + entry.frequency, 0);

    const formatDate = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const firstDate = formatDate(sorted[0].first_identified);
    const lastDate = formatDate(sorted[sorted.length - 1].last_identified);
    const range = firstDate === lastDate ? firstDate : `${firstDate} - ${lastDate}`;

    return {
      sortedEntries: sorted,
      totalCheckins: total,
      dateRange: range,
    };
  }, [entries]);

  if (sortedEntries.length < 2) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <TrendingUp className={styles.titleIcon} size={20} strokeWidth={2} />
          <h2 className={styles.title}>Your Emotional Journey</h2>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statPill}>
            <Activity size={14} style={{ marginRight: '4px' }} />
            {entries.length} Emotions
          </span>
          <span className={styles.statPill}>
            {totalCheckins} Check-ins
          </span>
          <span className={styles.statPill}>
            <Calendar size={14} style={{ marginRight: '4px' }} />
            {dateRange}
          </span>
        </div>
      </div>

      <motion.div
        className={styles.timelineContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {sortedEntries.map((entry, index) => {
          const isLast = index === sortedEntries.length - 1;
          const dotColor = `var(--color-intensity-${(index % 5) + 1})`;
          const dateStr = new Date(entry.first_identified).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <motion.div
              key={entry.id}
              className={styles.nodeWrapper}
              variants={prefersReducedMotion ? undefined : itemVariants}
            >
              {!isLast && <div className={styles.connector} />}
              <div className={styles.dotContainer}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: dotColor, color: dotColor }}
                />
              </div>
              <div className={styles.card}>
                <h3 className={styles.emotionName}>{entry.emotion}</h3>
                <p className={styles.date}>{dateStr}</p>
                <span className={styles.badge}>{entry.frequency}x</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
