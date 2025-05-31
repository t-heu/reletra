"use client"

import { useState } from "react"
import { X, Check, AlertTriangle, Copy } from "lucide-react"

import {checkWords} from "../utils/check-words"
import {generateChallengeLink} from "../utils/generate-challenge"

interface DesafioModalProps {
  onClose: () => void
}

export default function challengeModal({ onClose }: DesafioModalProps) {
  const [word, setWord] = useState("")
  const [isValid, setIsValid] = useState<null | boolean>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [url, setUrl] = useState<null | string>(null)

  async function handleSubmit() {
    setIsSubmitting(true)
    if (!word) return;

    if (checkWords(word.toUpperCase())) {
      setIsValid(false)
      setIsSubmitting(false)
      return;
    }
    setIsValid(true)
    const link = generateChallengeLink(word.toUpperCase());
    setUrl(link)
    setIsSubmitting(false)
  }

  function copy() {
    if (url)
      navigator.clipboard.writeText(url);
      alert("Link copiado! Envie para seu amigo.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#020817] w-full max-w-sm rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Desafiar um amigo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Digite uma palavra válida para gerar um desafio personalizado. A palavra tem que ter de 3 a 6 letras.
        </p>

        <input
          type="text"
          value={word}
          onChange={(e) => {
            setWord(e.target.value)
            setIsValid(null)
          }}
          placeholder="Digite a palavra..."
          className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isValid === false && (
          <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
            <AlertTriangle className="w-4 h-4" />
            Palavra inválida. Tente outra.
          </div>
        )}

        {isValid === true && (
          <div className="flex items-center gap-2 mt-2 text-sm text-green-400">
            <Check className="w-4 h-4" />
            Palavra válida!
          </div>
        )}

        {isValid && (
          <div className="mt-6">
            <label className="block text-sm text-gray-400 mb-2">Link do Desafio:</label>
            <div className="flex items-center bg-[#0f172a] border border-[#334155] rounded-md overflow-hidden">
              <input
                readOnly
                className="flex-1 px-3 py-2 text-white bg-transparent outline-none text-sm"
                value={`${url}`}
              />
              <button
                onClick={() => copy()}
                className="px-3 py-2 hover:bg-[#1e293b] text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Envie esse link para seu amigo tentar adivinhar a palavra!
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || word.length === 0}
          className="w-full mt-6 bg-white text-[#222] font-semibold py-2 rounded-md hover:bg-[#ddd] transition"
        >
          {isSubmitting ? "Verificando..." : "Criar Desafio"}
        </button>
      </div>
    </div>
  )
}
