import type { Metadata } from 'next'
import './globals.css'

import AdSense from "../components/ad-sense";

export const metadata: Metadata = {
  title: 'Desletra',
  description: 'Desletra é um jogo de adivinhação de palavras inspirado no clássico como Wordle, mas com um toque único. Nele, você deve descobrir uma palavra secreta digitando palpites e analisando as letras corretas, existentes ou ausentes.',
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
        <meta property="og:title" content="Cruzacifra - Desvende a Palavra-Código!" />
        <meta property="og:description" content="Resolva o desafio de palavras cruzadas criptografadas do dia!" />
        <meta property="og:image" content="https://cruzacifra.onrender.com/assets/web-app-manifest-192x192.png" />
        <meta property="og:url" content="https://cruzacifra.onrender.com/" />
        <meta property="og:type" content="website" />
        <link rel="apple-touch-icon" href="/assets/apple-icon.png" sizes="180x180" />
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/web-app-manifest-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ebc260" />
        <AdSense pId="ca-pub-7158647172444246"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
