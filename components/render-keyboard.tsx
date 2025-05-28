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
  const isEnter = letra === "ENTER";

  // Determine key colors based on state
  let bgColor = "bg-transparent";
  let borderColor = "border border-[#1e293b]";
  let textColor = "text-[#eee]";

  if (correctLetters.has(letra)) {
    bgColor = "bg-[#22c55e80] hover:bg-[#22c55e99]";
    borderColor = "border-2 border-[#22c55eb3]";
  } else if (existingLetters.has(letra)) {
    bgColor = "bg-[#eab30880] hover:bg-[#eab30899]";
    borderColor = "border-2 border-[#eab30880]";
  } else if (wrongLetters.has(letra)) {
    bgColor = "bg-[#6b728080] hover:bg-[#6b728099]";
    borderColor = "border-2 border-[#9ca3afb3]";
    textColor = "text-white";
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

  // Base classes for all keys
  const baseClasses = `
    rounded font-bold active:scale-95 transition-all
    flex items-center justify-center
    border-2 ${borderColor}
    ${textColor} ${bgColor}
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Size classes based on key type
  const sizeClasses = isSpecial
    ? "w-12 sm:w-16 md:w-20 px-2"
    : "w-8 sm:w-10 md:w-12";

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
        <span className="text-sm sm:text-base md:text-lg">
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
    ["ENTER", ..."ZXCVBNM".split(""), "DELETE"]
  ];

  return (
    <div className="w-full max-w-lg mx-auto p-2 space-y-2">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center gap-1 sm:gap-2"
          style={{
            paddingLeft: rowIndex === 0 ? 0 : rowIndex === 1 ? '0.5rem' : '1.5rem'
          }}
        >
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
