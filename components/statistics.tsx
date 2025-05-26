"use client"

import { Share2, Trophy, Clock } from "lucide-react"

interface EStatisticsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  statistics: {
    jogados: number
    vitorias: number
    sequenciaAtual: number
    sequenciaMaxima: number
    distribuicao: number[]
  }
  ultimaVitoria: boolean
  tentativasUltimaPalavra: number
  nextWord: string
  mode: string
}

export default function Statistics({
  open,
  onOpenChange,
  statistics,
  ultimaVitoria,
  tentativasUltimaPalavra,
  nextWord, 
  mode
}: EStatisticsProps) {
  if (!open) return null

  const porcentagemVitorias =
    statistics.jogados > 0 ? Math.round((statistics.vitorias / statistics.jogados) * 100) : 0

  const maxDistribuicao = Math.max(...statistics.distribuicao, 1);
  const temDistribuicao = statistics.distribuicao?.some((valor) => valor > 0)

  function compartilharResultados() {
    const texto = `LetraMix - Estatísticas
  🎯 ${statistics.jogados} jogos
  🏆 ${porcentagemVitorias}% de vitórias
  🔥 ${statistics.sequenciaAtual} sequência atual
  ⭐ ${statistics.sequenciaMaxima} melhor sequência`

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
      <div className="bg-[#020817] w-full max-w-md rounded-xl p-6 shadow-lg">
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
              <div className="text-2xl text-white font-bold">{statistics.jogados}</div>
              <div className="text-sm text-gray-500">Jogados</div>
            </div>
            <div>
              <div className="text-2xl text-white font-bold">{porcentagemVitorias}</div>
              <div className="text-sm text-gray-500">Vitórias %</div>
            </div>
            <div>
              <div className="text-2xl text-white font-bold">{statistics.sequenciaAtual}</div>
              <div className="text-sm text-gray-500">Sequência Atual</div>
            </div>
            <div>
              <div className="text-2xl text-white font-bold">{statistics.sequenciaMaxima}</div>
              <div className="text-sm text-gray-500">Melhor Sequência</div>
            </div>
          </div>

          {/* Distribuição de tentativas */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Distribuição de Tentativas</h3>
            <div className="space-y-2">
              {statistics.distribuicao.map((count, index) => {
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
                              : "bg-[#0a1121] text-gray-400"
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
          {mode === "daily" && (
            <div className="flex items-center gap-1 text-sm text-white">
              <Clock className="h-4 w-4" />
              <span className="font-mono">Próxima palavra em: {nextWord}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
