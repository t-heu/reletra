import type { Metadata } from 'next'
import './globals.css'

import AdSense from "../components/ad-sense";

export const metadata: Metadata = {
  title: 'Desletra',
  description: 'Desafie-se a desletrar uma nova palavra a cada dia!',
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
        <meta property="og:title" content="Desletra" />
        <meta property="og:description" content="Desafie-se a desletrar uma nova palavra a cada dia!" />
        <meta property="og:image" content="https://desletra.onrender.com/assets/web-app-manifest-192x192.png" />
        <meta property="og:url" content="https://desletra.onrender.com/" />
        <meta property="og:type" content="website" />
        <link rel="apple-touch-icon" href="/assets/apple-icon.png" sizes="180x180" />
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/web-app-manifest-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020817" />
        <meta name="description" content="Desafie-se a desletrar uma nova palavra a cada dia!" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://desletra.onrender.com/" />
        <AdSense pId="ca-pub-7158647172444246"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
