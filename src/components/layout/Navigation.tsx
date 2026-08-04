'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, BookOpen, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getInitialTheme, toggleTheme, type Theme } from '@/lib/theme';
import styles from './Navigation.module.css';

const NAV_ITEMS = [
  { href: '/checkin', label: 'Check In', icon: Scan },
  { href: '/dictionary', label: 'Dictionary', icon: BookOpen },
];

export function Navigation() {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    setThemeState(getInitialTheme());
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setThemeState(next);
  };

  // Don't show nav on landing page
  if (pathname === '/') return null;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo - desktop only */}
        <Link href="/" className={styles.logo}>
          EmoLens
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
                <Icon size={20} strokeWidth={1.75} />
                <span className={styles.linkLabel}>{item.label}</span>
                {isActive && (
                  <motion.div
                    className={styles.indicator}
                    layoutId="nav-indicator"
                    transition={{
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

        {/* Theme toggle */}
        <motion.button
          className={styles.themeToggle}
          onClick={handleToggleTheme}
          whileTap={{ scale: 0.85 }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              {theme === 'dark' ? (
                <Moon size={20} strokeWidth={1.75} />
              ) : (
                <Sun size={20} strokeWidth={1.75} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </nav>
  );
}
