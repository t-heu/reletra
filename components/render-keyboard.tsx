"use client"

import { Delete } from "lucide-react";

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

export function Key({
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
  const isEnter = letra === "ENTER";

  let colorClasses = "bg-transparent border-2 border-[#64748b80]";
  let textColor = "text-[#eee]";

  if (correctLetters.has(letra)) {
    colorClasses = "bg-[#008080] border-2 border-[#008080]";
    textColor = "text-[#eee]";
  } else if (existingLetters.has(letra)) {
    colorClasses = "bg-[#D97706] border-2 border-[#D97706]";
    textColor = "text-[#eee]";
  } else if (wrongLetters.has(letra)) {
    colorClasses = "bg-[#4B5563] border-2 border-[#4B5563]";
    textColor = "text-[#eee]";
  }

  const handleClick = () => {
    if (isEnter) {
      checkGuess();
    } else if (isDelete) {
      setGuess((prev) => prev.slice(0, -1));
    } else {
      setGuess((prev) => (prev.length < word.length ? prev + letra : prev));
    }
  };

  const disabled =
    isCorrect ||
    lose ||
    (isEnter && guess.length !== word.length) ||
    (isDelete && guess.length === 0);

  const baseClasses = `
    rounded font-righteous active:scale-95 transition-all
    flex items-center justify-center
    ${colorClasses} ${textColor}
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeClasses = isSpecial
    ? "w-[65px] sm:w-[65px] md:w-[70px]"
    : "w-[38px] sm:w-[45px] md:w-[48px]";

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} h-14 sm:h-16`}
      aria-label={isDelete ? "Delete" : isEnter ? "Enter" : letra}
      title={letra}
    >
      {isDelete ? (
        <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
      ) : (
        <span className="text-[1.22rem] uppercase" style={{
          fontSize: `${isEnter && '1.1rem'}`
        }}>
          {letra}
        </span>
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
  const rows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["ENTER", ..."ZXCVBNM".split(""), "DELETE"],
  ];

  return (
    <div className="w-full max-w-lg mx-auto space-y-2 rounded-md">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2">
          {row.map((letra) => (
            <Key
              key={letra}
              letra={letra}
              isSpecial={letra === "ENTER" || letra === "DELETE"}
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
      ))}
    </div>
  );
};
