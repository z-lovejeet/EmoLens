'use client';

import { useCheckinStore, type Gender } from '@/lib/store/checkinStore';
import styles from './GenderSelect.module.css';

/**
 * Male silhouette — clean, minimal SVG.
 * Broader shoulders, straighter torso.
 */
function MaleIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.icon}
    >
      {/* Head */}
      <circle cx="20" cy="7.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Torso — broad shoulders, straight */}
      <path
        d="M10 15.5C10 14 13 13 20 13C27 13 30 14 30 15.5V24C30 25 28 26 20 26C12 26 10 25 10 24V15.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Arms */}
      <path d="M10 16L5 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 16L35 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <path d="M15 26L13 37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M25 26L27 37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Female silhouette — clean, minimal SVG.
 * Narrower shoulders, curved waist, wider hips.
 */
function FemaleIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.icon}
    >
      {/* Head */}
      <circle cx="20" cy="7.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Torso — narrower shoulders, curved waist, wider hips */}
      <path
        d="M13 15C13 14 15 13 20 13C25 13 27 14 27 15V18C27 19 25 19.5 24 20C23 20.5 22 21.5 22 23V26C22 26.5 24 27 28 27.5C29 27.7 29 28.5 29 29H11C11 28.5 11 27.7 12 27.5C16 27 18 26.5 18 26V23C18 21.5 17 20.5 16 20C15 19.5 13 19 13 18V15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Arms */}
      <path d="M13 16L8 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M27 16L32 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <path d="M16 29L14 37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 29L26 37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Premium liquid-glass gender selector.
 * Appears before the body model loads.
 */
export function GenderSelect() {
  const setGender = useCheckinStore((s) => s.setGender);

  const handleSelect = (gender: Gender) => {
    setGender(gender);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Select your body type</h2>
          <p className={styles.subtitle}>
            Choose the silhouette that best represents you for body-sensation mapping
          </p>
        </div>

        {/* Gender options */}
        <div className={styles.options}>
          <button
            className={styles.glassBtn}
            onClick={() => handleSelect('male')}
            aria-label="Select male body"
          >
            <div className={styles.iconWrap}>
              <MaleIcon size={36} />
            </div>
            <span className={styles.label}>Male</span>
          </button>

          <button
            className={styles.glassBtn}
            onClick={() => handleSelect('female')}
            aria-label="Select female body"
          >
            <div className={styles.iconWrap}>
              <FemaleIcon size={36} />
            </div>
            <span className={styles.label}>Female</span>
          </button>
        </div>
      </div>
    </div>
  );
}
