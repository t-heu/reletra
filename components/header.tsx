"use client"

import Link from "next/link"
import {
  HelpCircle,
  Settings,
  RotateCcw,
  ChartNoAxesColumnDecreasing,
  CirclePlus,
  CircleAlert,
  Milestone
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

type Props = {
  howToPlay: (v: boolean) => void
  restartGame: (len?: number) => void
  wordLength: any
  setWordLength: any
  mode: "daily" | "free" | "challenge"
  setShowStatistics: any
  setShowCreateChallenge: any
}

export default function Header({
  howToPlay,
  mode,
  restartGame,
  setShowStatistics,
  wordLength,
  setWordLength,
  setShowCreateChallenge
}: Props) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="w-full flex justify-around items-center mt-4 mb-2">
      <div className="w-full max-w-[500px] flex justify-between items-center px-2">
        {/* Botão de ajuda */}
        <div>
          <button
            onClick={() => howToPlay(true)}
            className="border-2 border-[#1e293b] p-2 rounded hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
            title="Como jogar"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowCreateChallenge(true)}
            className="border-2 border-[#1e293b] mx-1 p-2 rounded hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
            title="Desafiar seu amigo"
          >
            <CirclePlus className="h-5 w-5" />
          </button>
        </div>

        {/* Título central */}
        <h1 className="text-3xl font-bold text-center font-code text-white">
          DESLETRA
        </h1>

        {/* Botão de configurações */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowStatistics(true)}
            className="border-2 border-[#1e293b] mx-1 p-2 rounded hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
            title="Estatísticas"
          >
            <ChartNoAxesColumnDecreasing className="h-5 w-5" />
          </button>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="border-2 border-[#1e293b] p-2 rounded hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
            title="Configurações"
          >
            <Settings className="h-5 w-5" />
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#020817] dark:bg-gray-800 border border-[#1e293b] dark:border-gray-700 rounded shadow-md z-50">
              <>
                <Link href="/changelog">
                  <button 
                    className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
                    <Milestone className="h-5 w-5" />
                    Changelog
                  </button>
                </Link>
                <Link href="/about">
                  <button 
                    className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
                    <CircleAlert className="h-5 w-5" />
                    Sobre
                  </button>
                </Link>
                {mode === 'free' && (
                  <button 
                    onClick={() => restartGame()}
                    className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
                    <RotateCcw className="h-5 w-5" />
                    Resetar tema
                  </button>
                )}
              </>
              {mode === 'free' && (
                <>
                  <span className="flex p-4 py-2 text-xm text-[#eee]">Nível de dificuldade:</span>
                  <button
                    onClick={() => {
                      setWordLength(null)
                      restartGame()
                      setOpenDropdown(false)
                    }}
                    className={`w-full text-sm text-left px-8 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white ${
                      wordLength === null ? "bg-[#1e293b] dark:bg-gray-700" : ""
                    }`}
                  >
                    Nenhum (Aleatório)
                  </button>
                    {[3, 4, 5, 6].map((len) => (
                      <button
                        key={len}
                        onClick={() => {
                          setWordLength(len)
                          restartGame(len)
                          setOpenDropdown(false)
                        }}
                        className={`w-full text-sm text-left px-8 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white ${
                          wordLength === len ? "bg-[#1e293b] dark:bg-gray-700" : ""
                        }`}
                      >
                        {len} Letras
                      </button>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
