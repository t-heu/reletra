"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"

import ButtonComp from "../components/button"
import {renderKeyboard} from "../components/render-keyboard"
import ToggleMode from "../components/toggle-mode"
import renderLetter from "../components/render-letter"
import HowToPlay from "../components/how-to-play"
import Footer from "../components/footer"
import Header from "../components/header"

import {generateDailyWord, generateRandomWord} from "../utils/generateWords"
import {formatRemainingTime} from "../utils/formatRemainingTime "

export default function Page() {
  const [word, setWord] = useState("")
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const [nextWord, setNextWord] = useState("")
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set())
  const [existingLetters, setExistingLetters] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<"daily" | "free">("daily")
  const [showHowToPlay, setShowHowToPlay] = useState(true)

  const limitAttempts = 6;
  const lose = !isCorrect && attempts.length >= limitAttempts;

  // Inicializa o jogo
  useEffect(() => {
    const today = new Date().toLocaleDateString("pt-BR")

    if (mode === "daily") {
      setCurrentDate(today)

      const ultimoJogo = localStorage.getItem("ultimoJogo")
      const tentativasSalvas = JSON.parse(localStorage.getItem("attempts") || "[]")
      const acertouSalvo = localStorage.getItem("isCorrect") === "true"

      if (ultimoJogo === today) {
        setAttempts(tentativasSalvas)
        setIsCorrect(acertouSalvo)

        const lettersC = new Set<string>(JSON.parse(localStorage.getItem("correctLetters") || "[]"))
        const lettersI = new Set<string>(JSON.parse(localStorage.getItem("wrongLetters") || "[]"))
        const lettersE = new Set<string>(JSON.parse(localStorage.getItem("existingLetters") || "[]"))

        setCorrectLetters(lettersC)
        setWrongLetters(lettersI)
        setExistingLetters(lettersE)
      } else {
        localStorage.setItem("ultimoJogo", today)
        localStorage.setItem("attempts", JSON.stringify([]))
        localStorage.setItem("isCorrect", "false")
        localStorage.setItem("correctLetters", JSON.stringify([]))
        localStorage.setItem("wrongLetters", JSON.stringify([]))
        localStorage.setItem("existingLetters", JSON.stringify([]))

        setAttempts([])
        setIsCorrect(false)
        setCorrectLetters(new Set())
        setWrongLetters(new Set())
        setExistingLetters(new Set())
      }

      const palavraDoDia = generateDailyWord()
      setWord(palavraDoDia)

      const amanha = new Date()
      amanha.setDate(amanha.getDate() + 1)
      amanha.setHours(0, 0, 0, 0)
      setNextWord(formatRemainingTime(amanha.getTime() - Date.now()))

      const intervalo = setInterval(() => {
        const agora = new Date()
        const amanha = new Date()
        amanha.setDate(amanha.getDate() + 1)
        amanha.setHours(0, 0, 0, 0)
        setNextWord(formatRemainingTime(amanha.getTime() - agora.getTime()))
      }, 1000)

      return () => clearInterval(intervalo)
    } else {
      // mode livre
      const novaPalavra = generateRandomWord()
      setWord(novaPalavra)
      setAttempts([])
      setIsCorrect(false)
      setCorrectLetters(new Set())
      setWrongLetters(new Set())
      setExistingLetters(new Set())
      setNextWord("")
    }
  }, [mode]);

  const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Verifica o palpite do jogador
  const checkGuess = () => {
    if (guess.length === 0) return;

    const palpiteOriginal = guess.toUpperCase();
    const palpiteNormalizado = removeAccents(palpiteOriginal);
    const palavraNormalizada = removeAccents(word);

    if (attempts.includes(palpiteOriginal) || attempts.includes(word)) {
      setGuess("");
      return;
    }

    const acertou = palpiteNormalizado === palavraNormalizada;
    const novaEntrada = acertou ? word : palpiteOriginal;
    const novasTentativas = [...attempts, novaEntrada];
    setAttempts(novasTentativas);

    if (acertou) {
      setIsCorrect(true);
      if (mode === "daily") {
        localStorage.setItem("isCorrect", "true");
      }
    }

    // Atualiza os sets de letras
    const novasLetrasCorretas = new Set(correctLetters);
    const novasLetrasIncorretas = new Set(wrongLetters);
    const novasLetrasExistentes = new Set(existingLetters);

    for (let i = 0; i < palpiteNormalizado.length; i++) {
      const letraNormalizada = palpiteNormalizado[i];
      const letraOriginal = palpiteOriginal[i];

      if (palavraNormalizada.includes(letraNormalizada)) {
        if (palavraNormalizada[i] === letraNormalizada) {
          novasLetrasCorretas.add(letraOriginal);
        } else {
          novasLetrasExistentes.add(letraOriginal);
        }
      } else {
        novasLetrasIncorretas.add(letraOriginal);
      }
    }

    setCorrectLetters(novasLetrasCorretas);
    setWrongLetters(novasLetrasIncorretas);
    setExistingLetters(novasLetrasExistentes);

    if (mode === "daily") {
      localStorage.setItem("attempts", JSON.stringify(novasTentativas));
      localStorage.setItem("correctLetters", JSON.stringify([...novasLetrasCorretas]));
      localStorage.setItem("wrongLetters", JSON.stringify([...novasLetrasIncorretas]));
      localStorage.setItem("existingLetters", JSON.stringify([...novasLetrasExistentes]));
    }

    setGuess("");
  };

  const restartGame = () => {
    setGuess("");
    setIsCorrect(false);
    setAttempts([]);
    setCorrectLetters(new Set());
    setWrongLetters(new Set());
    setExistingLetters(new Set());
  }

  return (
    <>
      <Header howToPlay={setShowHowToPlay} mode={mode} nextWord={nextWord} />

      <div className="container mx-auto px-4 py-4 flex justify-center">
        {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
        <div className="w-full max-w-[500px]">
          <div className="flex gap-2 mb-1 justify-center">
            <ToggleMode mode={mode} setMode={setMode} />
          </div>

          {/* Alert de acerto */}
          {isCorrect && (
            <div className="mb-4 border border-green-200 bg-green-50 text-green-800 p-4 rounded-lg flex items-start gap-3">
              <Check className="h-5 w-5 mt-1 text-green-600" />
              <div>
                <h3 className="font-semibold">Parabéns!</h3>
                <p>Você acertou a palavra do dia em {attempts.length} tentativas!</p>
              </div>
            </div>
          )}

          {lose && (
            <div className="mb-4 border border-red-200 bg-red-50 text-red-800 p-4 rounded-lg flex items-start gap-3">
              <X className="h-5 w-5 mt-1 text-red-600" />
              <div>
                <h3 className="font-semibold">Fim de Jogo</h3>
                <p>Você não acertou a palavra do dia. Tente novamente amanhã!</p>
              </div>
            </div>
          )}

          {/* Grid de letras */}
          <div className="grid gap-2 mb-4 w-full place-items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex gap-1">
                {Array.from({ length: word.length }).map((_, letraIndex) =>
                  attempts[index] ? (
                    renderLetter(attempts[index], index, letraIndex, word)
                  ) : (
                    <div
                      key={`${index}-${letraIndex}`}
                      className="p-2 h-12 w-12 sm:h-16 sm:w-16 font-bold border-2 border-[#222]"
                    ></div>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Input de guess */}
          {!isCorrect && !lose && (
            <div className="flex gap-2 mb-4 items-center justify-center">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value.toUpperCase())}
                disabled
                maxLength={word.length}
                placeholder={`palavra de ${word.length} letras`}
                className="w-10/12 border-2 border-[#222] rounded-md px-3 py-2 text-center uppercase focus:outline-none text-[#111] font-bold"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && guess.length === word.length) {
                    checkGuess();
                  }
                }}
              />
            </div>
          )}

          {/* Botões para jogar novamente / sair, aparecem se mode = "livre" e jogo terminou */}
          {mode === "free" && (isCorrect || lose) && (
            <div className="flex gap-2 mt-4 justify-center">
              <ButtonComp text="Jogar Novamente" press={() => restartGame()} />
            </div>
          )}

          {/* Teclado */}
          {renderKeyboard({
            correctLetters,
            existingLetters,
            wrongLetters,
            setGuess,
            isCorrect,
            lose,
            guess,
            checkGuess,
            word
          })}

          <div className="flex justify-between text-sm text-[#545454] mt-4">
            <span>{attempts.length}/6 tentativas</span>
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
