"use client"

import Link from "next/link"
import {
  HelpCircle,
  Settings,
  RotateCcw,
  ChartNoAxesColumnDecreasing,
  CirclePlus,
  CircleAlert,
  Milestone,
  History,
  X
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

import ToggleMode from "../components/toggle-mode"

type Props = {
  howToPlay: (v: boolean) => void
  restartGame: (len?: number) => void
  wordLength: any
  setWordLength: any
  mode: "daily" | "free" | "challenge"
  setShowStatistics: any
  setShowCreateChallenge: any
  setMode: any
  difficulty: any
  setDifficulty: any
}

export default function Header({
  howToPlay,
  mode,
  restartGame,
  setShowStatistics,
  wordLength,
  setWordLength,
  setShowCreateChallenge,
  setMode,
  difficulty,
  setDifficulty
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
    <header className="w-full flex flex-col justify-around items-center mt-4 mb-4">
      <div className="w-full max-w-[600px] flex flex-row justify-between items-center px-2 [@media(max-width:500px)]:flex-col">
        {/* Título central */}
        <h1 className="text-3xl font-bold text-center font-montserrat text-white">
          RELETRA
        </h1>

        <div className="w-full max-w-[500px] flex justify-around items-center px-2">
          {/* Botão 1 */}
          <div>
            {mode === "challenge" ? (
              <Link href="/">
                <button onClick={() => setMode('daily')} className="flex items-center text-[#eee] text-sm font-medium hover:text-black hover:bg-white rounded-md px-4 py-2">
                  <X className="mr-2 h-4 w-4" />
                  Sair do Desafio
                </button>
              </Link>
            ): (
              <ToggleMode
                value={mode}
                onChange={setMode}
                logKey="mode_switched"
                options={[
                  { value: "daily", label: "Diário" },
                  { value: "free", label: "Livre" }
                ]}
              />
            )}
          </div>

          {/* Botão 2 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => howToPlay(true)}
              className="border-2 border-[#64748b80] m-1 p-2 rounded hover:bg-[#64748b80] dark:hover:bg-gray-700 text-white"
              title="Como jogar"
            >
              <HelpCircle color="#E05C5C"  className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowCreateChallenge(true)}
              className="border-2 border-[#64748b80] p-2 rounded hover:bg-[#64748b80] dark:hover:bg-gray-700 text-white"
              title="Desafiar seu amigo"
            >
              <CirclePlus color="#00C896" className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowStatistics(true)}
              className="border-2 border-[#64748b80] m-1 p-2 rounded hover:bg-[#64748b80] dark:hover:bg-gray-700 text-white"
              title="Estatísticas"
            >
              <ChartNoAxesColumnDecreasing color="#4EA1D3" className="h-5 w-5" />
            </button>
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="border-2 border-[#64748b80] p-2 rounded hover:bg-[#64748b80] dark:hover:bg-gray-700 text-white"
              title="Configurações"
            >
              <Settings color="#6E7D92" className="h-5 w-5" />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#121213] border border-[#1e293b] dark:border-gray-700 rounded shadow-md z-50">
                <Link href="/changelog">
                  <button 
                    title="Changelog"
                    className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
                    <Milestone className="h-5 w-5" />
                    Changelog
                  </button>
                </Link>
                <Link href="/about">
                  <button 
                    title="Sobre"
                    className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
                    <CircleAlert className="h-5 w-5" />
                    Sobre
                  </button>
                </Link>
                <Link href="/history ">
                  <button 
                    title="Histórico"
                    className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
                    <History className="h-5 w-5" />
                    Histórico
                  </button>
                </Link>
                <div className="my-4">
                  <ToggleMode
                    value={difficulty}
                    onChange={setDifficulty}
                    logKey="mode_switched"
                    options={[
                      { value: "easy", label: "Fácil" },
                      { value: "hard", label: "Difícil" }
                    ]}
                  />
                  <span className="px-4 pt-2 block text-sm text-[#ccc]">Selecione o nível de dificuldade desejado</span>
                </div>
                {mode === 'free' && (
                  <>
                    <button 
                      title="Resetar tema"
                      onClick={() => restartGame()}
                      className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
                      <RotateCcw className="h-5 w-5" />
                      Resetar tema
                    </button>
                    <span className="flex p-4 py-2 text-sm text-[#ccc]">Nível de dificuldade em letras:</span>
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
      </div>
    </header>
  )
}
