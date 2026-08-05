'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './AuthButton.module.css';

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthButton() {
  const { user, isLoading, isAuthenticated, signInWithGoogle, signOut } =
    useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  // Not authenticated — show sign-in button
  if (!isAuthenticated || !user) {
    return (
      <div className={styles.authContainer}>
        <motion.button
          className={styles.signInButton}
          onClick={signInWithGoogle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <GoogleIcon />
          <span className={styles.signInLabel}>Sign in</span>
        </motion.button>
      </div>
    );
  }

  // Authenticated — show avatar + dropdown
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.authContainer} ref={dropdownRef}>
      <motion.button
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className={styles.avatar}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className={styles.dropdownHeader}>
              <div className={styles.userName}>{displayName}</div>
              {user.email && (
                <div className={styles.userEmail}>{user.email}</div>
              )}
            </div>

            <button
              className={`${styles.dropdownItem} ${styles.signOutItem}`}
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
