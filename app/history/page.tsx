"use client"

import Link from "next/link"
import { CalendarDays, ArrowLeft } from "lucide-react"

import {getYesterdayWord} from "../../utils/generate-words"

function palavrasDaSemana() {
  const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const hoje = new Date();
  
  const palavrasTemp: { dia: string;palavra: string } [] = [];
  
  for (let i = 1; i <= 7; i++) {
    const data = new Date();
    data.setDate(hoje.getDate() - i);
    
    const nomeDia = diasDaSemana[data.getDay()];
    const palavra = getYesterdayWord(i); // usa dias atrás, como no seu código
    
    palavrasTemp.push({ dia: nomeDia, palavra });
  }
  
  // Ordenar os dias na ordem fixa da semana
  const palavrasOrdenadas = diasDaSemana.map((dia) =>
    palavrasTemp.find((p) => p.dia === dia) || { dia, palavra: "" }
  );
  
  return palavrasOrdenadas;
}

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
          {palavrasDaSemana().map(({ dia, palavra }) => (
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
