'use client';

import { motion } from 'framer-motion';
import { CopingCard } from './CopingCard';
import type { CopingStrategy } from '@/lib/ai/state';
import styles from './CopingCardList.module.css';

interface Props {
  strategies: CopingStrategy[];
  onFeedback?: (strategyName: string, helpful: boolean) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

export function CopingCardList({ strategies, onFeedback }: Props) {
  return (
    <div className={styles.section}>
      <motion.h3
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        Things that might help
      </motion.h3>
      <motion.div
        className={styles.list}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {strategies.map((strategy) => (
          <CopingCard
            key={strategy.name}
            {...strategy}
            onFeedback={(helpful) => onFeedback?.(strategy.name, helpful)}
          />
        ))}
      </motion.div>
    </div>
  );
}
