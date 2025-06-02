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
  const resultado: {
    dia: string;
    easy: string;
    hard: string;
  }[] = [];

  for (let i = 1; i <= 7; i++) {
    const data = new Date();
    data.setDate(hoje.getDate() - i);
    const diaNome = diasDaSemana[data.getDay()];

    const easy = getYesterdayWord("easy", i);
    const hard = getYesterdayWord("hard", i);

    resultado.push({ dia: diaNome, easy, hard });
  }

  // Ordenar os dias na ordem da semana fixa
  return diasDaSemana.map((dia) => {
    const encontrado = resultado.find((d) => d.dia === dia);
    return encontrado || { dia, easy: "", hard: "" };
  });
}

export default function History() {
  const historico = palavrasDaSemana();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-[#111] w-full max-w-md rounded-xl p-6 shadow-lg">
        <Link href="/">
          <button
            title="Voltar"
            className="flex w-full justify-center items-center text-white hover:text-black hover:bg-white rounded-md py-2"
          >
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead>
              <tr className="text-white border-b border-[#1e293b] text-center">
                <th className="py-2">Dia</th>
                <th className="py-2">Fácil</th>
                <th className="py-2">Difícil</th>
              </tr>
            </thead>
            <tbody>
              {historico.map(({ dia, easy, hard }) => (
                <tr key={dia} className="border-b border-[#1e293b]">
                  <td className="py-2">{dia}</td>
                  <td className="py-2 font-mono bg-[#1e293b] px-2 text-center">{easy}</td>
                  <td className="py-2 font-mono bg-[#1e293b] px-2 text-center">{hard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            As palavras são atualizadas diariamente às 00h.
          </p>
        </div>
      </div>
    </div>
  );
}
