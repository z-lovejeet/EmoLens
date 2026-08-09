import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityState {
  reducedMotion: boolean;
  fontSize: 'default' | 'large' | 'x-large';
  highContrast: boolean;
  toggleReducedMotion: () => void;
  setFontSize: (size: 'default' | 'large' | 'x-large') => void;
  toggleHighContrast: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      reducedMotion: false,
      fontSize: 'default',
      highContrast: false,
      
      toggleReducedMotion: () => set((state) => {
        const newValue = !state.reducedMotion;
        if (typeof document !== 'undefined') {
          if (newValue) {
            document.documentElement.classList.add('reduced-motion');
          } else {
            document.documentElement.classList.remove('reduced-motion');
          }
        }
        return { reducedMotion: newValue };
      }),
      
      setFontSize: (size) => set(() => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('font-large', 'font-xl');
          if (size === 'large') document.documentElement.classList.add('font-large');
          if (size === 'x-large') document.documentElement.classList.add('font-xl');
        }
        return { fontSize: size };
      }),
      
      toggleHighContrast: () => set((state) => {
        const newValue = !state.highContrast;
        if (typeof document !== 'undefined') {
          if (newValue) {
            document.documentElement.classList.add('high-contrast');
          } else {
            document.documentElement.classList.remove('high-contrast');
          }
        }
        return { highContrast: newValue };
      }),
    }),
    {
      name: 'emolens-a11y',
      onRehydrateStorage: () => (state) => {
        if (typeof document !== 'undefined' && state) {
          if (state.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
          }
          if (state.fontSize === 'large') {
            document.documentElement.classList.add('font-large');
          } else if (state.fontSize === 'x-large') {
            document.documentElement.classList.add('font-xl');
          }
          if (state.highContrast) {
            document.documentElement.classList.add('high-contrast');
          }
        }
      }
    }
  )
);
