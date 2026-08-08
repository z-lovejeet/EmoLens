'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Template({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: reducedMotion ? 0.01 : 0.4,
          ease: reducedMotion ? 'linear' : [0.33, 1, 0.68, 1], // power2.out
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: reducedMotion ? 0.01 : 0.2,
          ease: reducedMotion ? 'linear' : [0.32, 0, 0.67, 0], // power2.in
        },
      }}
    >
      {children}
    </motion.div>
  );
}
