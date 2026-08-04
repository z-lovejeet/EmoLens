'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] },
      }}
    >
      {children}
    </motion.div>
  );
}
