import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import React from 'react';
import { PT_Sans, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'AdminBoard',
  description: 'A modern, fully functional Admin Dashboard',
};

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", ptSans.variable, spaceGrotesk.variable)} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
