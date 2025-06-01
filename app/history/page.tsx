"use client"

import Link from "next/link"
import { CalendarDays, ArrowLeft } from "lucide-react"

import {getYesterdayWord} from "../../utils/generate-words"

const diasDaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const palavrasDaSemana = Array.from({ length: 7 }, (_, i) => {
  const hoje = new Date();
  const diaDaSemanaAtual = hoje.getDay(); // 0 (domingo) até 6 (sábado)

  // Calcula quantos dias atrás foi o início da semana
  // Ex: se hoje é terça (2), começamos pegando domingo (2 dias atrás)
  // se hoje é domingo (0), pegamos o domingo da semana anterior (7 dias atrás)
  const diasAtras = (diaDaSemanaAtual + 7 - i) % 7 + (i === 0 && diaDaSemanaAtual === 0 ? 7 : 0);

  const data = new Date();
  data.setDate(hoje.getDate() - diasAtras);

  const nomeDia = diasDaSemana[data.getDay()];

  return {
    dia: nomeDia,
    palavra: getYesterdayWord(diasAtras),
  };
});

export default function History() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-[#111] w-full max-w-md rounded-xl p-6 shadow-lg">
        <Link href="/">
          <button title="Voltar" className="flex w-full justify-center items-center text-white hover:text-black hover:bg-white rounded-md py-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </button>
        </Link>

        <div className="flex justify-between items-center mt-2 mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-blue-400" />
            Histórico da Semana
          </h1>
        </div>

        <ul className="divide-y divide-[#1e293b]">
          {palavrasDaSemana.map(({ dia, palavra }) => (
            <li key={dia} className="py-3 flex justify-between items-center">
              <span className="text-white">{dia}</span>
              <span className="text-sm text-gray-400 font-mono bg-[#1e293b] px-2 py-1 rounded">
                {palavra}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            As palavras são atualizadas diariamente às 00h.
          </p>
        </div>
      </div>
    </div>
  )
}
