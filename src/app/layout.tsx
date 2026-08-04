import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Toast } from '@/components/ui/Toast';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EmoLens — Map Your Body, Find Your Words',
  description:
    'AI-powered tool helping neurodivergent youth identify emotions through body sensations. Body-first, not label-first.',
  keywords: [
    'emotional awareness',
    'neurodivergent',
    'body sensations',
    'alexithymia',
    'interoception',
    'emotion mapping',
    'AI',
  ],
  openGraph: {
    title: 'EmoLens — Map Your Body, Find Your Words',
    description:
      'AI-powered tool helping neurodivergent youth identify emotions through body sensations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('emolens-theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Navigation />
        {children}
        <Toast />
      </body>
    </html>
  );
}
