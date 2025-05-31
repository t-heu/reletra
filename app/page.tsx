"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react";

import { getAnalyticsIfSupported } from "../api/firebase";
import { logEvent } from "firebase/analytics";

import { removeAccents } from "../utils/remove-accents"
import {decodeWord} from "../utils/generate-challenge"
import {generateDailyWord, generateRandomWord, getYesterdayWord} from "../utils/generate-words"
import {checkWords} from "../utils/check-words"
import {saveGameState, updateStatistics} from "../utils/localStorage-utils"

import validWords from "../validWords.json";

import ButtonComp from "../components/button"
import {renderKeyboard} from "../components/render-keyboard"
import ToggleMode from "../components/toggle-mode"
import renderLetter from "../components/render-letter"
import HowToPlay from "../components/how-to-play"
import Header from "../components/header"
import Statistics from "../components/statistics"
import AdBanner from "../components/ad-banner"
import ChallengeModal from "../components/challenge-modal"

export default function Page() {
  const [word, setWord] = useState("")
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLose, setIsLose] = useState(false)
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set())
  const [existingLetters, setExistingLetters] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<"daily" | "free" | "challenge">("daily");
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showAlert, setShowAlert] = useState<string | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showCreateChallenge, setShowCreateChallenge] = useState(false)
  const [statistics, setStatistics] = useState({
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0]
  })
  const [wordLength, setWordLength] = useState<number | null>(null);

  const limitAttempts = 6;
  const lose = !isCorrect && attempts.length >= limitAttempts;
  const wordList = (validWords as {words: string[]}).words;
  const tentativas = attempts.length

  // Carregar estatísticas do localStorage
  useEffect(() => {
    const estatisticasSalvas = localStorage.getItem("desletra-statistics")
    if (estatisticasSalvas) {
      setStatistics(JSON.parse(estatisticasSalvas))
    }
  }, [])

  // loser
  useEffect(() => {
    if (lose) {
      const save: any = localStorage.getItem("gameStored");
      const stored = JSON.parse(save)
      
      if (mode === "daily" && !stored.endGame) {
        saveGameState({ endGame: true });
        
        updateStatistics(statistics, false, tentativas)

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
      }

      setIsLose(true);
    }
  }, [lose])

  // Inicializa o jogo
  useEffect(() => {
    const today = new Date().toLocaleDateString("pt-BR")

    const urlParams = new URLSearchParams(window.location.search);
    const challengeParam = urlParams.get("challenge");

    if (challengeParam) {
      const decoded = decodeWord(challengeParam);
      setWord(decoded.toUpperCase());
      setMode("challenge");
      return;
    }

    if (mode === "daily") {
      const stored = localStorage.getItem("gameStored");

      const {
        ultimoJogo,
        attempts: tentativasSalvas,
        isCorrect: acertouSalvo,
        endGame,
        letterHints: {
          correct = [],
          wrong = [],
          exists = []
        } = {}
      } = stored ? JSON.parse(stored) : {
        ultimoJogo: "",
        attempts: [],
        isCorrect: false,
        endGame: false,
        letterHints: { correct: [], wrong: [], exists: [] }
      };

      if (endGame && !acertouSalvo) {
        setIsLose(true);
      }

      if (!ultimoJogo) setShowHowToPlay(true)

      if (ultimoJogo === today) {
        setAttempts(tentativasSalvas)
        setIsCorrect(acertouSalvo)

        if (acertouSalvo) setShowStatistics(true);

        const lettersC = new Set<string>(correct);
        const lettersI = new Set<string>(wrong);
        const lettersE = new Set<string>(exists);

        setCorrectLetters(lettersC)
        setWrongLetters(lettersI)
        setExistingLetters(lettersE)
      } else {
        const clearSave = {
          ultimoJogo: today,
          attempts: [],
          isCorrect: false,
          endGame: false,
          letterHints: {
            correct: [],
            wrong: [],
            exists: []
          }
        };

        localStorage.setItem("gameStored", JSON.stringify(clearSave));

        setAttempts([])
        setIsCorrect(false)
        setIsLose(false)
        setCorrectLetters(new Set())
        setWrongLetters(new Set())
        setExistingLetters(new Set())
      }

      const palavraDoDia = generateDailyWord()
      setWord(palavraDoDia)
    } else if (mode === "free") {
      const novaPalavra = generateRandomWord()
      setWord(novaPalavra)
      setAttempts([])
      setIsCorrect(false)
      setIsLose(false)
      setCorrectLetters(new Set())
      setWrongLetters(new Set())
      setExistingLetters(new Set())
    } else {
      setAttempts([]);
      setIsCorrect(false);
      setIsLose(false);
      setCorrectLetters(new Set());
      setWrongLetters(new Set());
      setExistingLetters(new Set());
    }
  }, [mode]);

  // Verifica o palpite do jogador
  const checkGuess = () => {
    if (guess.length === 0) return;

    const palpiteOriginal = guess.toUpperCase();
    const palpiteNormalizado = removeAccents(palpiteOriginal);
    const palavraNormalizada = removeAccents(word);

    // 🛑 Bloqueia se palavra não estiver na lista
    if (checkWords(palpiteNormalizado)) {
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
      updateStatistics(statistics, true, attempts.length);
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
        saveGameState({ isCorrect: true, endGame: true });
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
      const letterHints = {
        attempts: novasTentativas,
        correct: [...novasLetrasCorretas],
        wrong: [...novasLetrasIncorretas],
        exists: [...novasLetrasExistentes]
      };

      saveGameState({
        attempts: letterHints.attempts,
        letterHints: {
          correct: letterHints.correct,
          wrong: letterHints.wrong,
          exists: letterHints.exists
        }
      });
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

    if (mode === 'free' || mode === 'challenge') {
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
    <main> 
      <Header wordLength={wordLength} setShowCreateChallenge={setShowCreateChallenge} setWordLength={setWordLength} setShowStatistics={setShowStatistics} howToPlay={setShowHowToPlay} restartGame={restartGame} mode={mode} />

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

        {showCreateChallenge && (
          <ChallengeModal
            onClose={() => setShowCreateChallenge(false)}
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
          {(isCorrect || isLose) && (
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
            {word.length === 0 ? (
              // Mostra skeleton enquanto `word` não está carregada
              Array.from({ length: limitAttempts }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 sm:gap-1 justify-center animate-pulse">
                  {Array.from({ length: 5 }).map((_, colIndex) => ( // usa 5 como placeholder
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="bg-slate-700 rounded border-2 border-slate-600"
                      style={{
                        width: `clamp(45px, 16vw, 62px)`,
                        height: `clamp(45px, 16vw, 62px)`,
                      }}
                    />
                  ))}
                </div>
              ))
            ) : (
              // Renderização normal quando a palavra existe
              Array.from({ length: limitAttempts }).map((_, index) => (
                <div key={index} className="flex gap-1 sm:gap-1 justify-center">
                  {Array.from({ length: word.length }).map((_, letraIndex) => {
                    if (attempts[index]) {
                      return renderLetter(attempts[index], index, letraIndex, word);
                    }

                    if (index === attempts.length) {
                      const isActive = letraIndex === guess.length;

                      return (
                        <div
                          key={`${index}-${letraIndex}`}
                          className={`font-playpen flex items-center justify-center font-bold transition-none text-white border-2 text-xl sm:text-2xl ${
                            isActive ? "border-[#F57C00] animate-pulse" : "border-[#1e293b]"
                          }`}
                          style={{
                            width: `clamp(45px, ${80 / word.length}vw, 62px)`,
                            height: `clamp(45px, ${80 / word.length}vw, 62px)`,
                            fontSize: `2rem`
                          }}
                        >
                          {guess[letraIndex] ?? ""}
                        </div>
                      );
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
              ))
            )}
          </div>

          {/* Botões para jogar novamente / sair, aparecem se mode = "livre" e jogo terminou */}
          {mode === "free" && (isCorrect || isLose) && (
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
            lose: isLose,
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
    </main>
  )
}
