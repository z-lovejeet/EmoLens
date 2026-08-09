'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './BreathingExercise.module.css';

interface BreathingExerciseProps {
  onSkip: () => void;
}

export function BreathingExercise({ onSkip }: BreathingExerciseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === 'inhale') {
      timeout = setTimeout(() => setPhase('hold'), 4000); // Inhale 4s
    } else if (phase === 'hold') {
      timeout = setTimeout(() => setPhase('exhale'), 7000); // Hold 7s
    } else if (phase === 'exhale') {
      timeout = setTimeout(() => setPhase('inhale'), 8000); // Exhale 8s
    }

    return () => clearTimeout(timeout);
  }, [phase]);

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe out...';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
    }
  };

  const getDuration = () => {
    switch (phase) {
      case 'inhale': return 4;
      case 'hold': return 7;
      case 'exhale': return 8;
    }
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.title}>
        <Wind className={styles.icon} size={24} />
        Take a moment
      </h2>
      
      <div className={styles.exerciseArea}>
        {!prefersReducedMotion && (
          <motion.div
            className={styles.circle}
            animate={{ scale: getCircleScale() }}
            transition={{ 
              duration: getDuration(), 
              ease: "easeInOut" 
            }}
          />
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            className={styles.instruction}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {getInstruction()}
          </motion.div>
        </AnimatePresence>
      </div>

      <button className={styles.skipBtn} onClick={onSkip}>
        Skip
      </button>
    </motion.div>
  );
}
