// Reduced motion helpers for GSAP animations
// Reference: 08_animation_bible.md Section 4

import { DURATION } from './tokens';

/**
 * Returns instant duration if reduced motion is active.
 */
export function getDuration(base: number, reduced: boolean): number {
  return reduced ? DURATION.instant : base;
}

/**
 * Returns 'none' easing if reduced motion is active.
 */
export function getEase(base: string, reduced: boolean): string {
  return reduced ? 'none' : base;
}
