"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react";

import { removeAccents } from "../utils/remove-accents"

import ButtonComp from "../components/button"
import {renderKeyboard} from "../components/render-keyboard"
import ToggleMode from "../components/toggle-mode"
import renderLetter from "../components/render-letter"
import HowToPlay from "../components/how-to-play"
import Footer from "../components/footer"
import Header from "../components/header"
import Statistics from "../components/statistics"

import validWords from "../validWords.json";
import {generateDailyWord, generateRandomWord, getYesterdayWord} from "../utils/generateWords"
import {formatRemainingTime} from "../utils/formatRemainingTime "

export default function Page() {
  const [word, setWord] = useState("")
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [nextWord, setNextWord] = useState("")
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set())
  const [existingLetters, setExistingLetters] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<"daily" | "free">("daily")
  const [showHowToPlay, setShowHowToPlay] = useState(true)
  const [showAlert, setShowAlert] = useState<string | null>(null)
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(false)
  const [estatisticas, setEstatisticas] = useState({
    jogados: 0,
    vitorias: 0,
    sequenciaAtual: 0,
    sequenciaMaxima: 0,
    distribuicao: [0, 0, 0, 0, 0, 0]
  })

  const limitAttempts = 6;
  const lose = !isCorrect && attempts.length >= limitAttempts;
  const wordList = (validWords as {words: string[]}).words;

  useEffect(() => {
    const endGameStatus = localStorage.getItem("endGame")
    console.log(endGameStatus)
    if (lose) {
      if (mode === "daily" && !endGameStatus) {
        localStorage.setItem("endGame", "true");
        atualizarEstatisticas(false, attempts.length)
      }

      if (mode === 'daily') setMostrarEstatisticas(true)
    }
  }, [lose, attempts.length])

  // Inicializa o jogo
  useEffect(() => {
    const today = new Date().toLocaleDateString("pt-BR")

    if (mode === "daily") {
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

  // Carregar estatísticas do localStorage
  useEffect(() => {
    const estatisticasSalvas = localStorage.getItem("letramix-estatisticas")
    if (estatisticasSalvas) {
      setEstatisticas(JSON.parse(estatisticasSalvas))
    }
  }, [])

  // Salvar estatísticas no localStorage
  function salvarEstatisticas(novasEstatisticas: typeof estatisticas) {
    setEstatisticas(novasEstatisticas)
    localStorage.setItem("letramix-estatisticas", JSON.stringify(novasEstatisticas))
  }

  // Atualizar estatísticas quando o jogo termina
  function atualizarEstatisticas(ganhou: boolean, tentativasUsadas: number) {
    const novasEstatisticas = { ...estatisticas }

    novasEstatisticas.jogados += 1

    if (ganhou) {
      novasEstatisticas.vitorias += 1
      novasEstatisticas.sequenciaAtual += 1
      novasEstatisticas.sequenciaMaxima = Math.max(novasEstatisticas.sequenciaMaxima, novasEstatisticas.sequenciaAtual)
      novasEstatisticas.distribuicao[tentativasUsadas] += 1
    } else {
      novasEstatisticas.sequenciaAtual = 0
    }
    salvarEstatisticas(novasEstatisticas)
  }

  // Verifica o palpite do jogador
  const checkGuess = () => {
  if (guess.length === 0) return;

  const palpiteOriginal = guess.toUpperCase();
  const palpiteNormalizado = removeAccents(palpiteOriginal);
  const palavraNormalizada = removeAccents(word);

  // 🛑 Bloqueia se palavra não estiver na lista
  const normalizedWordList = wordList.map(w => removeAccents(w.toUpperCase()));
  if (!normalizedWordList.includes(palpiteNormalizado)) {
    setShowAlert('Palavra não reconhecida');
    return;
  }

  if (attempts.includes(palpiteOriginal) || attempts.includes(word)) {
    setGuess("");
    return;
  }

  const acertou = palpiteNormalizado === palavraNormalizada;

  // Recupera a palavra original com acento da wordList
  const palavraComAcento = wordList.find(
    w => removeAccents(w.toUpperCase()) === palpiteNormalizado
  );

  // Usa a palavra com acento (ou o próprio palpite original, se não achar)
  const palavraFinal = acertou ? word : palavraComAcento?.toUpperCase() || palpiteOriginal;

  const novasTentativas = [...attempts, palavraFinal];
  setAttempts(novasTentativas);
  setShowAlert(null);

  if (acertou) {
    setIsCorrect(true);
    atualizarEstatisticas(true, attempts.length);
    setMostrarEstatisticas(true);

    if (mode === "daily") {
      localStorage.setItem("isCorrect", "true");
      localStorage.setItem("endGame", "true");
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

    if (mode === 'free') {
      const novaPalavra = generateRandomWord()
      setWord(novaPalavra)
    }
  }

  const feedbackByAttempt: Record<number, string> = {
      1: "UAU!",
      2: "IMPRESSIONANTE!",
      3: "ÓTIMO!",
      4: "BOM TRABALHO!",
      5: "DEU CERTO!",
      6: "QUASE!",
    };

  const getFeedback = (attempts: number) =>
    feedbackByAttempt[attempts] || "Boa!";

  return (
    <>
      <Header setMostrarEstatisticas={setMostrarEstatisticas} howToPlay={setShowHowToPlay} restartGame={restartGame} mode={mode} />

      <div className="container mx-auto px-4 py-4 flex justify-center">
        {showHowToPlay && <HowToPlay mode={mode} nextWord={nextWord} onClose={() => setShowHowToPlay(false)} />}

        <Statistics
          open={mostrarEstatisticas}
          onOpenChange={setMostrarEstatisticas}
          estatisticas={estatisticas}
          ultimaVitoria={isCorrect}
          tentativasUltimaPalavra={(isCorrect || lose) ? attempts.length : 0}
        />
        <div className="w-full max-w-[500px]">
          <div className="flex gap-2 mb-1 justify-center">
            <ToggleMode mode={mode} setMode={setMode} />
          </div>

          {/* Alert de jogo */}
          {showAlert && (
            <div className="flex w-full justify-center mb-2 mt-2">
              <div className="bg-red-500/20 text-red-500 flex items-center gap-2 px-4 py-2 rounded-md animate-bounce">
                <AlertCircle className="h-4 w-4" />
                <span>{showAlert}</span>
              </div>
            </div>
          )}

          {/* Grid de letras */}
          <div className="grid gap-1 sm:gap-1 mb-4 w-full place-items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex gap-1 sm:gap-1 justify-center">
                {Array.from({ length: word.length }).map((_, letraIndex) =>
                  attempts[index] ? (
                    renderLetter(attempts[index], index, letraIndex, word)
                  ) : (
                    <div
                      key={`${index}-${letraIndex}`}
                      className="font-archivo flex items-center justify-center font-bold transition-none text-white border-2 border-[#1e293b] text-xl sm:text-2xl"
                      style={{
                        width: `clamp(30px, ${100 / word.length}vw, 50px)`,
                        height: `clamp(30px, ${100 / word.length}vw, 50px)`,
                        fontSize: `clamp(1rem, ${6 / word.length}vw, 2rem)`
                      }}
                    />
                  )
                )}
              </div>
            ))}
          </div>

          {/* Alert de acerto */}
          {(isCorrect || lose) && (
            <div className="text-center justify-center mb-4 flex items-start gap-3">
              <h3
                className={`font-semibold p-3 rounded-lg ${
                  isCorrect ? ' bg-[#22c55e80] border-2 border-[#22c55eb3] text-white' : 'bg-[#eee] text-black border-2 border-[#aaa]'
                }`}
              >
                {isCorrect ? (
                  <>
                    <span className="block text-xl">{getFeedback(attempts.length)}</span>
                    <span className="block text-sm">Você acertou a palavra {mode === 'daily' ? 'do dia' : null} em {attempts.length} tentativa{attempts.length > 1 ? 's' : ''}!</span>
                  </>
                ) : (
                  <div>
                    <span className="block text-xl">QUE PENA!</span>
                      {mode === 'daily' && (
                        <>
                          <p>Volte amanhã para uma nova palavra!</p>
                          <p>A palavra de ontem era: <strong>{getYesterdayWord()}</strong></p>
                        </>
                      )}
                  </div>
                )}
              </h3>
            </div>
          )}

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
                className="w-10/12 bg-transparent border-2 border-[#1e293b] rounded-md px-3 py-2 text-center uppercase focus:outline-none text-[#16a34a] font-bold"
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
        </div>
      </div>

      <Footer />
    </>
  )
}
