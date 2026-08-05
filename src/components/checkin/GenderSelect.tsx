'use client';

import { useState } from 'react';
import styles from './GenderSelect.module.css';
import { type BodyType } from '@/lib/store/checkinStore';

interface GenderSelectProps {
  onSelect: (bodyType: BodyType) => void;
}

export function GenderSelect({ onSelect }: GenderSelectProps) {
  const [hovered, setHovered] = useState<BodyType | null>(null);
  const [selected, setSelected] = useState<BodyType | null>(null);

  const handleSelect = (type: BodyType) => {
    setSelected(type);
    setTimeout(() => onSelect(type), 350);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome to Check-In</h2>
          <p className={styles.subtitle}>Choose your body map to begin exploring sensations</p>
        </div>

        <div className={styles.options}>
          {(['male', 'female'] as BodyType[]).map((type) => (
            <button
              key={type}
              className={`${styles.option} ${hovered === type ? styles.optionHovered : ''} ${selected === type ? styles.optionSelected : ''}`}
              onClick={() => handleSelect(type)}
              onMouseEnter={() => setHovered(type)}
              onMouseLeave={() => setHovered(null)}
              disabled={selected !== null}
            >
              <div className={styles.iconWrap}>
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {type === 'male' ? (
                    <>
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
                    </>
                  ) : (
                    <>
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
                      <path d="M12 11v4" />
                      <path d="M9 15h6" />
                    </>
                  )}
                </svg>
              </div>
              <span className={styles.label}>
                {type === 'male' ? 'Male Body' : 'Female Body'}
              </span>
            </button>
          ))}
        </div>

        <p className={styles.footnote}>
          Select male or female for tailored anatomical visualization.
        </p>
      </div>
    </div>
  );
}
