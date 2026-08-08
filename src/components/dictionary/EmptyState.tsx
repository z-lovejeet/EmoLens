'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function EmptyState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'rgba(142, 202, 230, 0.08)',
        border: '1px solid rgba(142, 202, 230, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <BookOpen size={28} color="#8ecae6" strokeWidth={1.5} />
      </div>
      <h2 style={{
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-heading)',
      }}>
        Your emotion dictionary starts here
      </h2>
      <p style={{
        margin: 0,
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        maxWidth: 320,
      }}>
        Check in with your body to begin building your personal emotion map.
      </p>
      <Link
        href="/checkin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 24px',
          borderRadius: 9999,
          background: 'linear-gradient(135deg, rgba(142, 202, 230, 0.15) 0%, rgba(184, 169, 201, 0.15) 100%)',
          border: '1px solid rgba(142, 202, 230, 0.25)',
          color: '#8ecae6',
          fontSize: '0.85rem',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          marginTop: 8,
        }}
      >
        Start a check-in
      </Link>
    </div>
  );
}
