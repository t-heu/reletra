"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react";

import { getAnalyticsIfSupported } from "../api/firebase";
import { logEvent } from "firebase/analytics";

import { removeAccents } from "../utils/remove-accents"
import {decodeWord} from "../utils/generate-challenge"
import {generateDailyWord, generateRandomWord, getYesterdayWord} from "../utils/generate-words"
import {checkWords, wordWithAccent} from "../utils/check-words"
import {saveGameState, updateStatistics, getGameState} from "../utils/localStorage-utils"

import ButtonComp from "../components/button"
import {renderKeyboard} from "../components/render-keyboard"
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
  const [lettersState, setLettersState] = useState({
    correct: new Set<string>(),
    wrong: new Set<string>(),
    exists: new Set<string>(),
  });
  const [mode, setMode] = useState<"daily" | "free" | "challenge">("daily");
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [statistics, setStatistics] = useState({
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0]
  })
  const [wordLength, setWordLength] = useState<number | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showAlert, setShowAlert] = useState<string | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showCreateChallenge, setShowCreateChallenge] = useState(false)

  const limitAttempts = 6;
  const lose = !isCorrect && attempts.length >= limitAttempts;
  const tentativas = attempts.length

  // Carregar estatísticas do localStorage
  useEffect(() => {
    const estatisticasSalvas = localStorage.getItem("reletra-statistics")
    if (estatisticasSalvas) setStatistics(JSON.parse(estatisticasSalvas))
  }, [])

  // loser
  useEffect(() => {
    if (!lose) return;

    const stored = getGameState();

    if (mode === "daily" && !stored.endGame) {
      saveGameState({ endGame: true });
      updateStatistics(statistics, false, tentativas);
      getAnalyticsIfSupported().then((analytics) => {
        if (analytics) {
          logEvent(analytics, "game_lost", { mode, attempts: tentativas });
        }
      });
    }

    if (mode === "daily") setShowStatistics(true);

    if (mode === "free") {
      getAnalyticsIfSupported().then((analytics) => {
        if (analytics) {
          logEvent(analytics, "game_lost", { mode, attempts: tentativas });
        }
      });
    }

    setIsLose(true);
  }, [lose]);

  // Inicializa o jogo
  useEffect(() => {
    const today = new Date().toLocaleDateString("pt-BR");
    const urlParams = new URLSearchParams(window.location.search);
    const challengeParam = urlParams.get("challenge");

    if (challengeParam) {
      const decoded = decodeWord(challengeParam);
      setWord(decoded.toUpperCase());
      setMode("challenge");
      return;
    }

    const resetState = () => {
      setAttempts([]);
      setIsCorrect(false);
      setIsLose(false);
      setLettersState(prev => ({
        ...prev,
        correct: new Set(),
        wrong: new Set(),
        exists: new Set(),
      }));
    };

    if (mode === "daily") {
      const stored = getGameState(); // Você pode adaptar isso por dificuldade depois se quiser
      const {
        ultimoJogo,
        attempts: savedAttempts = [],
        isCorrect: savedCorrect = false,
        endGame = false,
        letterHints: {
          correct = [],
          wrong = [],
          exists = []
        } = {}
      } = stored || {};

      if (endGame && !savedCorrect) setIsLose(true);
      if (!ultimoJogo) setShowHowToPlay(true);

      if (ultimoJogo === today) {
        setAttempts(savedAttempts);
        setIsCorrect(savedCorrect);
        if (savedCorrect) setShowStatistics(true);
        setLettersState(prev => ({
          ...prev,
          correct: new Set(correct),
          wrong: new Set(wrong),
          exists: new Set(exists),
        }));
      } else {
        const reset = {
          ultimoJogo: today,
          attempts: [],
          isCorrect: false,
          endGame: false,
          letterHints: { correct: [], wrong: [], exists: [] }
        };

        saveGameState(reset);
        resetState();
      }

      setWord(generateDailyWord(difficulty));
    } else {
      const newWord = mode === "free" ? generateRandomWord(difficulty) : "";
      setWord(newWord);
      resetState();
    }
  }, [mode, difficulty]);

  // Verifica o palpite do jogador
  const checkGuess = () => {
    if (guess.length === 0) return;

    const palpiteOriginal = guess.toUpperCase();
    const palpiteNormalizado = removeAccents(palpiteOriginal);
    const palavraNormalizada = removeAccents(word);

    // 🛑 Bloqueia se palavra não estiver na lista
    if (checkWords(palpiteNormalizado)) {
      setShowAlert('Palavra não reconhecida');
      setTimeout(() => {
        setShowAlert(null); // ou '' dependendo de como você esconde o alerta
      }, 3000); // 3 segundos
      return;
    }

    if (attempts.includes(palpiteOriginal) || attempts.includes(word)) {
      setGuess("");
      return;
    }

    const acertou = palpiteNormalizado === palavraNormalizada;

    // Recupera a palavra original com acento da wordList
    const palavraComAcento = wordWithAccent(palpiteNormalizado);

    // Usa a palavra com acento (ou o próprio palpite original, se não achar)
    const palavraFinal = acertou ? word : palavraComAcento?.toUpperCase() || palpiteOriginal;

    const novasTentativas = [...attempts, palavraFinal];
    setAttempts(novasTentativas);

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
    const novasLetrasCorretas = new Set(lettersState.correct);
    const novasLetrasIncorretas = new Set(lettersState.wrong);
    const novasLetrasExistentes = new Set(lettersState.exists);

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

    setLettersState(prev => ({
      ...prev,
      correct: novasLetrasCorretas,
      wrong: novasLetrasIncorretas,
      exists: novasLetrasExistentes,
    }));

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
    setLettersState(prev => ({
      ...prev,
      correct: new Set(),
      wrong: new Set(),
      exists: new Set(),
    }));

    if (mode === 'free' || mode === 'challenge') {
      const novaPalavra = generateRandomWord(difficulty, len)
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
    <main className="h-screen flex flex-col justify-between">
      <Header 
        wordLength={wordLength} 
        setShowCreateChallenge={setShowCreateChallenge} 
        setWordLength={setWordLength} 
        setShowStatistics={setShowStatistics} 
        howToPlay={setShowHowToPlay} 
        restartGame={restartGame} 
        mode={mode} 
        setMode={setMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <div className="flex-1 min-h-0 overflow-y-auto container mx-auto px-2 flex justify-center">
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

        <div className="w-full max-w-[600px]">
          {/* Alert de jogo */}
          {showAlert && (
            <div className="flex w-full justify-center absolute left-0 right-0">
              <div className="font-sans bg-red-500/20 text-red-500 flex items-center gap-2 px-4 py-2 rounded-md animate-bounce">
                <AlertCircle className="h-4 w-4" />
                <span>{showAlert}</span>
              </div>
            </div>
          )}

          {/* Alert de acerto */}
          {(isCorrect || isLose) && (
            <div className="flex justify-center absolute top-[20rem] left-0 right-0">
              <div
                className={`p-2 rounded-sm border-2 text-center ${
                  isCorrect
                    ? "bg-[#22c55e80] border-[#22c55eb3] text-white"
                    : "bg-[#eee] border-[#eee] text-black"
                }`}
              >
                {isCorrect ? (
                  <>
                    <p className="text-sm">
                      <strong>{getFeedback(attempts.length)}</strong> Você acertou a palavra {mode === "daily" ? "do dia" : ""} em {attempts.length} tentativa
                      {attempts.length > 1 ? "s" : ""}!
                    </p>
                  </>
                ) : (
                  <>
                    {mode === "challenge" && (
                      <p className="font-sans">
                        Desafiou era: <strong>{word}</strong>
                      </p>
                    )}
                    {mode === "free" && (
                      <p className="font-sans">
                        Era: <strong>{word}</strong>
                      </p>
                    )}
                    {mode === "daily" && (
                      <p className="font-sans">
                        Ontem era: <strong>{getYesterdayWord(difficulty)}</strong>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Grid de letras */}
          <div className="grid gap-2 sm:gap-2 mb-2 w-full place-items-center">
            {word.length === 0 ? (
              // Mostra skeleton enquanto `word` não está carregada
              Array.from({ length: limitAttempts }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 sm:gap-2 justify-center animate-pulse">
                  {Array.from({ length: 5 }).map((_, colIndex) => ( // usa 5 como placeholder
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="bg-slate-700 border-2 border-slate-600 rounded-sm"
                      style={{
                        width: `clamp(45px, 16vw, 72px)`,
                        height: `clamp(45px, 16vw, 72px)`,
                      }}
                    />
                  ))}
                </div>
              ))
            ) : (
              // Renderização normal quando a palavra existe
              Array.from({ length: limitAttempts }).map((_, index) => (
                <div key={index} className="flex gap-2 sm:gap-2 justify-center">
                  {Array.from({ length: word.length }).map((_, letraIndex) => {
                    if (attempts[index]) {
                      return renderLetter(attempts[index], index, letraIndex, word);
                    }

                    if (index === attempts.length) {
                      const isActive = letraIndex === guess.length;

                      return (
                        <div
                          key={`${index}-${letraIndex}`}
                          className={`font-playpen flex items-center justify-center font-bold transition-none text-black border-2 text-xl sm:text-2xl rounded-sm ${
                            isActive ? "border-[#F57C00] animate-pulse" : "bg-[#fff1d3] border-2 border-[#fff1d3]"
                          }`}
                          style={{
                            width: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
                            height: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
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
                        className="font-playpen flex items-center justify-center font-bold transition-none text-white bg-[#fff1d3] border-2 border-[#fff1d3] text-xl sm:text-2xl rounded-sm"
                        style={{
                          width: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
                          height: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
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
            <div className="flex gap-2 justify-center mb-6">
              <ButtonComp text="Jogar Novamente" press={() => restartGame()} />
            </div>
          )}

          {/* Teclado */}
          {renderKeyboard({
            correctLetters: lettersState.correct,
            existingLetters: lettersState.exists,
            wrongLetters: lettersState.wrong,
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
