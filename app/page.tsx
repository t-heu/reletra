"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react";

import { getAnalyticsIfSupported } from "../api/firebase";
import { logEvent } from "firebase/analytics";

import { removeAccents } from "../utils/remove-accents"

import ButtonComp from "../components/button"
import {renderKeyboard} from "../components/render-keyboard"
import ToggleMode from "../components/toggle-mode"
import renderLetter from "../components/render-letter"
import HowToPlay from "../components/how-to-play"
import Header from "../components/header"
import Statistics from "../components/statistics"
import AdBanner from "../components/ad-banner"

import validWords from "../validWords.json";
import {generateDailyWord, generateRandomWord, getYesterdayWord} from "../utils/generateWords"

export default function Page() {
  const [word, setWord] = useState("")
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLoser, setIsLose] = useState(false)
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set())
  const [existingLetters, setExistingLetters] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<"daily" | "free">("daily")
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showAlert, setShowAlert] = useState<string | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [statistics, setStatistics] = useState({
    jogados: 0,
    vitorias: 0,
    sequenciaAtual: 0,
    sequenciaMaxima: 0,
    distribuicao: [0, 0, 0, 0, 0, 0]
  })
  const [wordLength, setWordLength] = useState<number | null>(null);

  const limitAttempts = 6;
  const lose = !isCorrect && attempts.length >= limitAttempts;
  const wordList = (validWords as {words: string[]}).words;

  const tentativas = attempts.length

  // Carregar estatísticas do localStorage
  useEffect(() => {
    const estatisticasSalvas = localStorage.getItem("letramix-statistics")
    if (estatisticasSalvas) {
      setStatistics(JSON.parse(estatisticasSalvas))
    }
  }, [])

  useEffect(() => {
    if (lose) {
      const endGameStatus = localStorage.getItem("endGame")
      if (mode === "daily" && !endGameStatus) {
        localStorage.setItem("endGame", "true");
        atualizarEstatisticas(false, tentativas)

        getAnalyticsIfSupported().then((analytics) => {
          if (analytics) {
            logEvent(analytics, "game_lost", {
              mode,
              attempts: attempts.length,
            });
          }
        });
      }

      if (mode === 'daily') setShowStatistics(true);

      if (mode === 'free') {
        getAnalyticsIfSupported().then((analytics) => {
          if (analytics) {
            logEvent(analytics, "game_lost", {
              mode,
              attempts: attempts.length,
            });
          }
        });

        setIsLose(true);
      }
    }
  }, [lose])

  // Inicializa o jogo
  useEffect(() => {
    const today = new Date().toLocaleDateString("pt-BR")

    if (mode === "daily") {
      const ultimoJogo = localStorage.getItem("ultimoJogo")
      const tentativasSalvas = JSON.parse(localStorage.getItem("attempts") || "[]")
      const acertouSalvo = localStorage.getItem("isCorrect") === "true"
      const loseSalve = localStorage.getItem("endGame") === "true"

      if (loseSalve && !acertouSalvo) {
        setIsLose(true);
      }

      if (!ultimoJogo) setShowHowToPlay(true)

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
        setIsLose(false)
        setCorrectLetters(new Set())
        setWrongLetters(new Set())
        setExistingLetters(new Set())
      }

      const palavraDoDia = generateDailyWord()
      setWord(palavraDoDia)
    } else {
      const novaPalavra = generateRandomWord()
      setWord(novaPalavra)
      setAttempts([])
      setIsCorrect(false)
      setIsLose(false)
      setCorrectLetters(new Set())
      setWrongLetters(new Set())
      setExistingLetters(new Set())
    }
  }, [mode]);

  // Salvar estatísticas no localStorage
  function salvarEstatisticas(novasEstatisticas: typeof statistics) {
    setStatistics(novasEstatisticas)
    localStorage.setItem("letramix-statistics", JSON.stringify(novasEstatisticas))
  }

  // Atualizar estatísticas quando o jogo termina
  function atualizarEstatisticas(ganhou: boolean, tentativasUsadas: number) {
    const novasEstatisticas = { ...statistics }

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
    setShowAlert(null)

    if (acertou) {
      setIsCorrect(true);
      atualizarEstatisticas(true, attempts.length);
      setShowStatistics(true);

      getAnalyticsIfSupported().then((analytics) => {
        if (analytics) {
          logEvent(analytics, "word_guessed", {
            attempts: attempts.length,
            mode,
          });
        }
      });

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

  const restartGame = (len?: number) => {
    setGuess("");
    setIsCorrect(false);
    setIsLose(false)
    setAttempts([]);
    setCorrectLetters(new Set());
    setWrongLetters(new Set());
    setExistingLetters(new Set());

    if (mode === 'free') {
      const novaPalavra = generateRandomWord(len)
      setWord(novaPalavra);

      getAnalyticsIfSupported().then((analytics) => {
        if (analytics) {
          logEvent(analytics, "game_restarted", {
            mode,
          });
        }
      });
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

  const getFeedback = (attempts: number) => feedbackByAttempt[attempts] || "Boa!";
  
  return (
    <> 
      <Header wordLength={wordLength} setWordLength={setWordLength} setShowStatistics={setShowStatistics} howToPlay={setShowHowToPlay} restartGame={restartGame} mode={mode} />

      <div className="container mx-auto px-4 py-4 flex justify-center">
        {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}

        {showStatistics && (
          <Statistics
            onOpenChange={setShowStatistics}
            statistics={statistics}
            ultimaVitoria={isCorrect}
            tentativasUltimaPalavra={tentativas}
          />
        )}
        <div className="w-full max-w-[500px]">
          <div className="flex gap-2 justify-center">
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

          {/* Alert de acerto */}
          {(isCorrect || isLoser) && (
            <div className="flex w-full justify-center mb-5">
              <div
                className={`font-semibold p-2 rounded-lg border-2 text-center ${
                  isCorrect
                    ? "bg-[#22c55e80] border-[#22c55eb3] text-white"
                    : "bg-[#eee] border-[#aaa] text-black"
                }`}
              >
                {isCorrect ? (
                  <>
                    <h3 className="text-xl mb-1">{getFeedback(attempts.length)}</h3>
                    <p className="text-sm">
                      Você acertou a palavra {mode === "daily" ? "do dia" : ""} em {attempts.length} tentativa
                      {attempts.length > 1 ? "s" : ""}!
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl mb-1">QUE PENA!</h3>
                    {mode === "free" && (
                      <p>
                        A palavra era: <strong>{word}</strong>
                      </p>
                    )}
                    {mode === "daily" && (
                      <p>
                        A palavra de ontem era: <strong>{getYesterdayWord()}</strong>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Grid de letras */}
          <div className="grid gap-1 sm:gap-1 mb-4 w-full place-items-center">
            {Array.from({ length: limitAttempts }).map((_, index) => (
              <div key={index} className="flex gap-1 sm:gap-1 justify-center">
                {Array.from({ length: word.length }).map((_, letraIndex) => {
                  if (attempts[index]) {
                    return renderLetter(attempts[index], index, letraIndex, word);
                  }

                  // Exibir `guess` atual (linha ativa)
                  if (index === attempts.length) {
                    return renderLetter(guess.padEnd(word.length), index, letraIndex, word, false);
                  }

                  return (
                    <div
                      key={`${index}-${letraIndex}`}
                      className="font-playpen flex items-center justify-center font-bold transition-none text-white border-2 border-[#1e293b] text-xl sm:text-2xl"
                      style={{
                        width: `clamp(45px, ${80 / word.length}vw, 62px)`,
                        height: `clamp(45px, ${80 / word.length}vw, 62px)`,
                        fontSize: `2rem`
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Botões para jogar novamente / sair, aparecem se mode = "livre" e jogo terminou */}
          {mode === "free" && (isCorrect || isLoser) && (
            <div className="flex gap-2 justify-center">
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
            lose: isLoser,
            guess,
            checkGuess,
            word
          })}
        </div>
      </div>

      <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="9380851329"
      />
    </>
  )
}
