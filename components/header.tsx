"use client"

import { Clock, CircleHelp, ChartNoAxesColumnDecreasing } from "lucide-react"

const Header = ({howToPlay, mode, nextWord}: any) => (
  <header className="w-full border-b border-gray-300 py-4 flex items-center justify-between px-4 sm:px-6">
    {/* Título central */}
    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wider flex-1">
      Desletra
    </h1>

    {/* Ícones à direita */}
    <div className="flex items-center gap-4">
      {/* Tema */}
      <button onClick={() => howToPlay(true)} className="text-gray-600 hover:text-black">
        <CircleHelp className="h-7 w-7 text-gray-600" />
      </button>

      {/* Estatísticas */}
      <button className="text-gray-600 hover:text-black">
        <ChartNoAxesColumnDecreasing className="h-7 w-7 text-gray-500" />
      </button>

      {/* Timer no modo daily */}
      {mode === "daily" && (
        <div title="Próxima palavra em" className="flex items-center">
          <Clock className="h-7 w-7 text-gray-500" />
          <div className="text-sm text-gray-500 font-mono ml-2">
            {nextWord}
          </div>
        </div>
      )}
    </div>
  </header>
)

export default Header
