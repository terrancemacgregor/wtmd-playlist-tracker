import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WTMD Playlist Tracker',
  description: 'Track and analyze WTMD 89.7 FM playlist data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}