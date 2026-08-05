'use client';

import { useState } from 'react';
import styles from './GenderSelect.module.css';

export type BodyType = 'male' | 'female' | 'neutral';

interface GenderSelectProps {
  onSelect: (bodyType: BodyType) => void;
}

export function GenderSelect({ onSelect }: GenderSelectProps) {
  const [hovered, setHovered] = useState<BodyType | null>(null);
  const [selected, setSelected] = useState<BodyType | null>(null);

  const handleSelect = (type: BodyType) => {
    setSelected(type);
    // Small delay for visual feedback before transitioning
    setTimeout(() => onSelect(type), 400);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome to Check-In</h2>
          <p className={styles.subtitle}>Choose a body map to begin exploring your sensations</p>
        </div>

        <div className={styles.options}>
          {(['male', 'female', 'neutral'] as BodyType[]).map((type) => (
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {type === 'male' && (
                    <>
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
                    </>
                  )}
                  {type === 'female' && (
                    <>
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
                      <path d="M12 11v4" />
                      <path d="M9 15h6" />
                    </>
                  )}
                  {type === 'neutral' && (
                    <>
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
                    </>
                  )}
                </svg>
              </div>
              <span className={styles.label}>
                {type === 'male' ? 'Male' : type === 'female' ? 'Female' : 'Neutral'}
              </span>
            </button>
          ))}
        </div>

        <p className={styles.footnote}>
          This only affects the body visualization. You can change it anytime.
        </p>
      </div>
    </div>
  );
}
