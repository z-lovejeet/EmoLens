'use client';

import styles from './Slider.module.css';

const INTENSITY_LABELS = [
  { value: 1, label: 'Barely there', color: 'var(--color-intensity-1)' },
  { value: 2, label: 'Mild', color: 'var(--color-intensity-2)' },
  { value: 3, label: 'Moderate', color: 'var(--color-intensity-3)' },
  { value: 4, label: 'Strong', color: 'var(--color-intensity-4)' },
  { value: 5, label: 'Overwhelming', color: 'var(--color-intensity-5)' },
];

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({ value, onChange, className }: SliderProps) {
  // Map continuous value (1.0 to 5.0) to closest label (0 to 4)
  const closestIndex = Math.min(
    4,
    Math.max(0, Math.round(value) - 1)
  );
  const current = INTENSITY_LABELS[closestIndex];

  return (
    <div className={[styles.wrapper, className || ''].filter(Boolean).join(' ')}>
      <div className={styles.trackWrapper}>
        <input
          type="range"
          min={1}
          max={5}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={styles.slider}
          style={{ '--thumb-color': current.color } as React.CSSProperties}
          aria-label="Sensation intensity"
          aria-valuetext={`${current.label} (${value.toFixed(1)})`}
          aria-valuemin={1}
          aria-valuemax={5}
        />
        <div className={styles.ticks} aria-hidden="true">
          {[1, 2, 3, 4, 5].map((step) => (
            <span
              key={step}
              className={[
                styles.tick,
                Math.round(value) === step ? styles.tickActive : '',
              ].filter(Boolean).join(' ')}
            />
          ))}
        </div>
      </div>

      <div className={styles.labels}>
        <span className={styles.labelMin}>Barely there</span>
        <span className={styles.labelMax}>Overwhelming</span>
      </div>

      <div className={styles.current}>
        <span
          className={styles.dot}
          style={{ backgroundColor: current.color, boxShadow: `0 0 10px ${current.color}` }}
          aria-hidden="true"
        />
        <span className={styles.currentLabel} style={{ color: current.color }}>
          {current.label}
        </span>
      </div>
    </div>
  );
}
