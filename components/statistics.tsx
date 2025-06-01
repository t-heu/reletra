"use client"

import { Share2, Trophy } from "lucide-react"

import {NextWordTimer} from "./next-word-timer"

interface EStatisticsProps {
  onOpenChange: (open: boolean) => void
  statistics: {
    played: number
    wins: number
    currentStreak: number
    maxStreak: number
    distribution: number[]
  }
  ultimaVitoria: boolean
  tentativasUltimaPalavra: number
}

export default function Statistics({
  onOpenChange,
  statistics,
  ultimaVitoria,
  tentativasUltimaPalavra, 
}: EStatisticsProps) {
  const porcentagemVitorias =
    statistics.played > 0 ? Math.round((statistics.wins / statistics.played) * 100) : 0

  const maxDistribuicao = Math.max(...statistics.distribution, 1);
  const temDistribuicao = statistics.distribution?.some((valor) => valor > 0)

  function compartilharResultados() {
    const texto = `LetraMix - Estatísticas
  🎯 ${statistics.played} jogos
  🏆 ${porcentagemVitorias}% de vitórias
  🔥 ${statistics.currentStreak} sequência atual
  ⭐ ${statistics.maxStreak} melhor sequência`

    if (navigator.share) {
      navigator.share({
        title: "LetraMix - Minhas Estatísticas",
        text: texto,
      })
    } else {
      navigator.clipboard.writeText(texto)
      alert("Estatísticas copiadas para a área de transferência!")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#121213] w-full max-w-md rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-center w-full text-white">
            {ultimaVitoria ? (
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Parabéns!
              </div>
            ) : (
              "Estatísticas"
            )}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            onClick={() => onOpenChange(false)}
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl text-white font-bold">{statistics.played}</div>
              <div className="text-sm text-gray-500">Jogados</div>
            </div>
            <div>
              <div className="text-2xl text-white font-bold">{porcentagemVitorias}</div>
              <div className="text-sm text-gray-500">Vitórias %</div>
            </div>
            <div>
              <div className="text-2xl text-white font-bold">{statistics.currentStreak}</div>
              <div className="text-sm text-gray-500">Sequência Atual</div>
            </div>
            <div>
              <div className="text-2xl text-white font-bold">{statistics.maxStreak}</div>
              <div className="text-sm text-gray-500">Melhor Sequência</div>
            </div>
          </div>

          {/* Distribuição de tentativas */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Distribuição de Tentativas</h3>
            <div className="space-y-2">
              {statistics.distribution.map((count, index) => {
                const tentativa = index + 1
                const porcentagem = maxDistribuicao > 0 ? (count / maxDistribuicao) * 100 : 0
                const isUltimaTentativa = ultimaVitoria && tentativasUltimaPalavra === tentativa
                
                return (
                  <div key={tentativa} className="flex items-center gap-2">
                    <span className="w-4 text-sm font-medium text-white">{tentativa}</span>
                    <div className="flex-1 relative">
                      <div
                        className={`h-6 rounded flex items-center justify-end px-2 text-sm font-medium transition-all duration-500 ${
                          isUltimaTentativa
                            ? "bg-green-500 text-white"
                            : count > 0
                              ? "bg-white text-black"
                              : "bg-[#64748b80] text-gray-400"
                        }`}
                        style={{ width: `${Math.max(porcentagem, count > 0 ? 15 : 8)}%` }}
                      >
                        {count > 0 && <span>{count}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Botão de compartilhar */}
          {temDistribuicao && (
            <div className="flex justify-center">
              <button
                onClick={compartilharResultados}
                className="flex items-center gap-2 bg-white text-[#222] px-4 py-2 rounded-md hover:bg-[#ddd] transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar Estatísticas
              </button>
            </div>
          )}

          {/* Timer (modo diário) */}
          <NextWordTimer />
        </div>
      </div>
    </div>
  )
}
