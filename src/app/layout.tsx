import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/ui/Toast';
import { AuthProvider } from '@/components/auth/AuthProvider';
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
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
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
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
      </head>
      <body>
        <AuthProvider>
          <Navigation />
          {children}
          <Footer />
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
