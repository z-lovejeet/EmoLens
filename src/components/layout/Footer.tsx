'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/checkin') {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Column 1: Brand */}
          <div className={styles.column}>
            <div className={styles.brand}>
              <img src="/logo.jpg" alt="EmoLens Logo" className={styles.logoImg} />
              <span className={styles.logoText}>EmoLens</span>
            </div>
            <p className={styles.tagline}>Map your body. Find your words.</p>
            <p className={styles.description}>
              An AI-powered tool helping neurodivergent youth understand emotions through body sensations.
            </p>
          </div>

          {/* Column 2: Navigate */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Navigate</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/checkin" className={styles.link}>
                  Check In
                </Link>
              </li>
              <li>
                <Link href="/dictionary" className={styles.link}>
                  Dictionary
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Resources</h3>
            <ul className={styles.list}>
              <li>
                <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  988 Suicide &amp; Crisis Lifeline
                </a>
              </li>
              <li>
                <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Crisis Text Line
                </a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Alexithymia" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  About Alexithymia
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className={styles.hr} />

        <div className={styles.bottom}>
          <p className={styles.builtWith}>
            Built with care <Heart size={16} strokeWidth={1.75} className={styles.heart} /> for neurodivergent youth and inclusive communities &middot; 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
