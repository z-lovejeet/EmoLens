export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        padding: 'var(--space-8)',
        textAlign: 'center',
        gap: 'var(--space-6)',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-outfit), system-ui, sans-serif',
          fontSize: 'var(--text-4xl)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-tight)',
          lineHeight: 'var(--leading-tight)',
        }}
      >
        EmoLens
      </h1>
      <p
        style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--text-secondary)',
          maxWidth: '480px',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        Map your body. Find your words.
      </p>
      <a
        href="/checkin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-3) var(--space-8)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--interactive-primary)',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: 'var(--text-base)',
          boxShadow: 'var(--shadow-sm)',
          textDecoration: 'none',
          transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
        }}
      >
        Start Check-In
      </a>
    </main>
  );
}
