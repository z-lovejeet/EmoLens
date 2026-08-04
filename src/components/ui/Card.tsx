'use client';

import { type HTMLAttributes, forwardRef } from 'react';
import styles from './Card.module.css';

type CardVariant = 'default' | 'interactive' | 'glass';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  selected?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', selected, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          styles.card,
          styles[variant],
          selected ? styles.selected : '',
          className || '',
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
