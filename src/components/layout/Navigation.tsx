'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, BookOpen, Settings2 } from 'lucide-react';
import { AuthButton } from '@/components/auth/AuthButton';
import { AccessibilityPanel } from './AccessibilityPanel';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Navigation.module.css';

const NAV_ITEMS = [
  { href: '/checkin', label: 'Check In', icon: Scan },
  { href: '/dictionary', label: 'Dictionary', icon: BookOpen },
];

export function Navigation() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [a11yOpen, setA11yOpen] = useState(false);

  return (
    <header className={`${styles.header} ${styles.navTransparent}`}>
      <nav className={styles.nav} role="navigation" aria-label="Main navigation">
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <img src="/logo.jpg" alt="EmoLens Logo" className={styles.logoImg} />
            <span className={styles.logoText}>EmoLens</span>
          </Link>

          {/* Nav links */}
          <div className={styles.links}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    styles.link,
                    isActive ? styles.active : '',
                  ].filter(Boolean).join(' ')}
                >
                  <Icon size={24} strokeWidth={1.75} className={styles.linkIcon} />
                  <span className={styles.linkLabel}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      className={styles.indicator}
                      layoutId="nav-indicator"
                      transition={prefersReducedMotion ? { duration: 0 } : {
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className={styles.rightControls}>
            <button
              className={styles.themeToggle}
              onClick={() => setA11yOpen(true)}
              aria-label="Accessibility settings"
            >
              <Settings2 size={24} />
            </button>
            {/* Auth button (far right) */}
            <AuthButton />
          </div>
        </div>
      </nav>
      
      <AccessibilityPanel isOpen={a11yOpen} onClose={() => setA11yOpen(false)} />
    </header>
  );
}

