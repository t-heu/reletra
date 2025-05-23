import { Delete } from "lucide-react"; // ou ajuste conforme seu ícone de backspace

type KeyProps = {
  letra: string;
  isSpecial?: boolean;
  correctLetters: Set<string>;
  existingLetters: Set<string>;
  wrongLetters: Set<string>;
  setGuess: React.Dispatch<React.SetStateAction<string>>;
  isCorrect: boolean;
  lose: boolean;
  guess: string;
  checkGuess: () => void;
  word: string;
};

function Key({
  letra,
  isSpecial = false,
  correctLetters,
  existingLetters,
  wrongLetters,
  setGuess,
  isCorrect,
  lose,
  guess,
  checkGuess,
  word,
}: KeyProps) {
  const isDelete = letra === "DELETE";

  let bgColor = "bg-transparent border border-[#1e293b]";
  let textColor = "text-[#eee]";

  if (correctLetters.has(letra)) {
    bgColor = "bg-[#22c55e80] border-2 border-[#22c55eb3] hover:bg-[#22c55e99]";
    textColor = "text-white";
  } else if (existingLetters.has(letra)) {
    bgColor = "bg-[#eab30880] border-2 border-[#eab30880] hover:bg-[#eab30899]";
    textColor = "text-white";
  } else if (wrongLetters.has(letra)) {
    bgColor = "bg-[#6b728080] text-white border-2 border-[#9ca3afb3] hover:bg-[#6b728099]";
    textColor = "text-white";
  } else if (letra === "ENTER") {
    bgColor = "text-[9px]! px-2 bg-[#eee] hover:bg-[#eee]";
    textColor = "text-[#1e293b]";
  }

  const handleClick = () => {
    if (letra === "ENTER") {
      checkGuess();
    } else if (letra === "DELETE") {
      setGuess((prev) => prev.slice(0, -1));
    } else {
      setGuess((prev) => (prev.length < word.length ? prev + letra : prev));
    }
  };

  const disabled =
    isCorrect ||
    lose ||
    (letra === "ENTER" && guess.length !== word.length) ||
    (letra === "DELETE" && guess.length === 0);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${bgColor} ${textColor} rounded hover:bg-[#1e293b] font-bold active:scale-95 transition-all
        ${isSpecial 
          ? "w-[48px] sm:w-[56px] md:w-[64px] lg:w-[72px]" 
          : "w-[32px] sm:w-[36px] md:w-[40px] lg:w-[44px]"
        }
        h-12 sm:h-14 md:h-16 lg:h-18
        text-sm sm:text-base md:text-lg lg:text-xl
        flex items-center justify-center font-archivo
      `}
    >
      {isDelete ? (
        <Delete className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
      ) : (
        letra
      )}
    </button>
  );
}

type KeyboardProps = {
  correctLetters: Set<string>;
  existingLetters: Set<string>;
  wrongLetters: Set<string>;
  setGuess: React.Dispatch<React.SetStateAction<string>>;
  isCorrect: boolean;
  lose: boolean;
  guess: string;
  checkGuess: () => void;
  word: string;
};

export const renderKeyboard = ({
  correctLetters,
  existingLetters,
  wrongLetters,
  setGuess,
  isCorrect,
  lose,
  guess,
  checkGuess,
  word,
}: KeyboardProps) => {
  return (
    <div className="flex flex-col items-center gap-1 w-full px-1 sm:px-2 mt-8">
      {/* Linha 1 */}
      <div className="flex justify-center gap-[4px]">
        {"QWERTYUIOP".split("").map((letra) => (
          <Key
            key={letra}
            letra={letra}
            correctLetters={correctLetters}
            existingLetters={existingLetters}
            wrongLetters={wrongLetters}
            setGuess={setGuess}
            isCorrect={isCorrect}
            lose={lose}
            guess={guess}
            checkGuess={checkGuess}
            word={word}
          />
        ))}
      </div>

      {/* Linha 2 com indentação */}
      <div className="flex justify-center gap-[4px] mt-[2px]">
        <div className="w-[6px] sm:w-[12px]" />
        {"ASDFGHJKL".split("").map((letra) => (
          <Key
            key={letra}
            letra={letra}
            correctLetters={correctLetters}
            existingLetters={existingLetters}
            wrongLetters={wrongLetters}
            setGuess={setGuess}
            isCorrect={isCorrect}
            lose={lose}
            guess={guess}
            checkGuess={checkGuess}
            word={word}
          />
        ))}
      </div>

      {/* Linha 3 com ENTER e DELETE */}
      <div className="flex justify-center gap-[4px] mt-[2px]">
        <Key
          letra="ENTER"
          isSpecial
          correctLetters={correctLetters}
          existingLetters={existingLetters}
          wrongLetters={wrongLetters}
          setGuess={setGuess}
          isCorrect={isCorrect}
          lose={lose}
          guess={guess}
          checkGuess={checkGuess}
          word={word}
        />
        {"ZXCVBNM".split("").map((letra) => (
          <Key
            key={letra}
            letra={letra}
            correctLetters={correctLetters}
            existingLetters={existingLetters}
            wrongLetters={wrongLetters}
            setGuess={setGuess}
            isCorrect={isCorrect}
            lose={lose}
            guess={guess}
            checkGuess={checkGuess}
            word={word}
          />
        ))}
        <Key
          letra="DELETE"
          isSpecial
          correctLetters={correctLetters}
          existingLetters={existingLetters}
          wrongLetters={wrongLetters}
          setGuess={setGuess}
          isCorrect={isCorrect}
          lose={lose}
          guess={guess}
          checkGuess={checkGuess}
          word={word}
        />
      </div>
    </div>
  );
};
