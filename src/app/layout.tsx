import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UrFoodBox — Machew devan pot kay ou.',
  description:
    'Machew devan pot kay ou. Order curated grocery food boxes online in USD or HTG and get doorstep delivery.',
  openGraph: {
    title: 'UrFoodBox — Machew devan pot kay ou.',
    description:
      'Machew devan pot kay ou. Order curated grocery food boxes online in USD or HTG and get doorstep delivery.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
