"use client"

import {
  HelpCircle,
  Settings,
  Sun,
  Moon,
  Clock,
  ChartNoAxesColumnDecreasing 
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

type Props = {
  howToPlay: (v: boolean) => void
  restartGame: () => void
  //theme: "dark" | "light"
  //setTheme: (t: "dark" | "light") => void
  mode: "daily" | "free"
  nextWord: string
  setMostrarEstatisticas: any
}

export default function Header({
  howToPlay,
  mode,
  nextWord,
  restartGame,
  setMostrarEstatisticas
}: Props) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState('dark')

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
    <header className="w-full flex justify-around items-center mt-6 mb-4 px-4 relative">
      {/* Botão de ajuda */}
      <button
        onClick={() => howToPlay(true)}
        className="p-2 rounded hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
        title="Como jogar"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {/* Título central */}
      <h1 className="text-3xl font-bold text-center font-archivo text-white">
        Desletra
      </h1>

      {/* Botão de configurações */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="p-2 rounded hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
          title="Configurações"
        >
          <Settings className="h-5 w-5" />
        </button>

        <button
          onClick={() => setMostrarEstatisticas(true)}
          className="p-2 rounded hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
          title="Como jogar"
        >
          <ChartNoAxesColumnDecreasing className="h-5 w-5" />
        </button>

        {openDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-[#020817] dark:bg-gray-800 border border-[#1e293b] dark:border-gray-700 rounded shadow-md z-50">
            <button
              onClick={() => {
                restartGame()
                setOpenDropdown(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 text-white"
            >
              Resetar
            </button>
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                setOpenDropdown(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === "dark" ? "Tema Claro" : "Tema Escuro"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Timer (modo diário) */}
      {mode === "daily" && (
        <div className="absolute right-4 bottom-[-1.5rem] flex items-center gap-1 text-sm text-white">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{nextWord}</span>
        </div>
      )}
    </header>
  )
}
