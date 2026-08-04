import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-md)',
  className,
}: SkeletonProps) {
  return (
    <div
      className={[styles.skeleton, className || ''].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={[styles.skeletonCard, className || ''].filter(Boolean).join(' ')}>
      <Skeleton width="60%" height="1.25rem" />
      <Skeleton width="100%" height="0.875rem" />
      <Skeleton width="90%" height="0.875rem" />
      <Skeleton width="75%" height="0.875rem" />
      <Skeleton width="40%" height="2.25rem" borderRadius="var(--radius-md)" />
    </div>
  );
}
