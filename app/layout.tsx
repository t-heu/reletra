import type { Metadata } from 'next'
import './globals.css'

import { Righteous } from 'next/font/google';

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
});

import AdSense from "../components/ad-sense";

export const metadata: Metadata = {
  title: 'Reletra',
  description: 'Desafie seu vocabulário.',
  generator: 'theu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#020817" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://reletra.onrender.com/" />
        <meta name="keywords" content="reletra, palavras, wordle, palavra" />
        <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Reletra" />
        <meta name="application-name" content="Reletra" />
        {/* Open Graph */}
        <meta property="og:title" content="Reletra" />
        <meta property="og:description" content="Desafie seu vocabulário." />
        <meta property="og:image" content="https://reletra.onrender.com/assets/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://reletra.onrender.com/" />
        <meta property="og:type" content="website" />
        {/* PWA / Icons */}
        <link rel="apple-touch-icon" href="/assets/apple-icon.png" sizes="180x180" />
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/web-app-manifest-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* AdSense */}
        <AdSense pId="ca-pub-7158647172444246"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
