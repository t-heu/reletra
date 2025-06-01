import Link from "next/link"
import { Metadata } from 'next'

import { ArrowLeft, X } from "lucide-react"

export const metadata: Metadata = {
  title: 'Sobre - Desletra',
  description: 'Saiba mais sobre o projeto Desletra.',
}

export default function About() {
  return (
    <main className="min-h-screen inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1b2f] text-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <Link href="/">
          <button className="flex items-center text-white hover:text-black hover:bg-white rounded-md px-4 py-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </button>
        </Link>

        <h1 className="text-2xl font-bold mb-4 text-center">Sobre o Desletra</h1>
        <p className="mb-3">
          <strong>Desletra</strong> é um jogo de palavras inspirado em desafios como Wordle,
          mas com uma proposta única: desvendar a palavra oculta usando lógica e tentativas
          limitadas. Cada palpite revela dicas sobre quais letras estão corretas e em qual posição.
          O jogo utiliza um vocabulário vasto e refinado, semelhante ao de um dicionário, e permite,
          no modo livre, escolher entre palavras de <strong>3 a 6 letras</strong>, oferecendo uma experiência
          personalizada e educativa para quem deseja expandir o repertório linguístico enquanto se diverte.
        </p>
        <p className="mb-3">
          Jogue no modo <strong>Diário</strong> para encarar um desafio novo por dia, ou explore o
          modo <strong>Livre</strong> para treinar seu vocabulário sem limites.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2 text-white">Privacidade</h3>
        <p className="text-sm text-gray-400 mb-4">
          O Desletra respeita sua privacidade. Alguns dados anônimos são coletados para fins estatísticos e o jogo pode exibir anúncios durante o uso. Nenhuma informação pessoal ou confidencial é coletada, armazenada ou compartilhada.
        </p>
        <p className="mb-3">
          Desenvolvido com 💙 por um entusiasta de jogos web e desenvolvimento de software.
        </p>
        <p className="text-sm text-gray-400 mt-4 flex items-center gap-1">
          <X className="w-4 h-4" />
          <a
            href="https://x.com/t_h_e_u"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Siga @t_h_e_u
          </a>
        </p>
        <p className="text-sm text-gray-400 text-center mt-4">
          © {new Date().getFullYear()} Desletra
        </p>
      </div>
    </main>
  );
}
