import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DURATION, EASE } from './tokens';

// Register plugins
gsap.registerPlugin(useGSAP);

// Global defaults
gsap.defaults({
  ease: EASE.out,
  duration: DURATION.normal,
  overwrite: 'auto',
});

// Global config
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

export { gsap, useGSAP };
