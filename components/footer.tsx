"use client"

import Link from "next/link"

const Footer = () => (
  <footer className="max-w-2xl mx-auto py-4 text-center text-sm text-white">
    <p className="mb-1">2025 Desletra</p>
    <div className="flex justify-center gap-6 text-white">
      <Link href="/changelog" className="hover:underline">Changelog</Link>
      <Link href="/about" className="hover:underline">Sobre</Link>
      <Link href="/contact" className="hover:underline">Contato</Link>
    </div>
  </footer>
)

export default Footer
