import { Delete } from "lucide-react"

export const renderKeyboard = ({
  correctLetters,
  existingLetters,
  wrongLetters,
  setGuess,
  isCorrect,
  lose,
  guess,
  checkGuess,
  word
}: any) => {
    const linhas = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K","L"],
      ["Z", "X", "C", "V", "B", "N", "M"],
    ]

    return (
      <div className="flex flex-col items-center gap-1 mt-4 w-full px-2">
        {linhas.map((linha, i) => (
          <div key={i} className="flex flex-wrap justify-center gap-1 w-full max-w-[500px]">
            {linha.map((letra) => {
              let bgColor = "bg-[#e5e7eb] border border-[#9ca3af]"
              let textColor = "text-black"

              if (correctLetters.has(letra)) {
                bgColor = "bg-green-500"
                textColor = "text-white"
              } else if (existingLetters.has(letra)) {
                bgColor = "bg-yellow-500"
                textColor = "text-white"
              } else if (wrongLetters.has(letra)) {
                bgColor = "bg-gray-500"
                textColor = "text-white"
              }

              return (
                <button
                  key={letra}
                  className={`rounded p-2 h-9 w-9 sm:h-10 sm:w-10 text-sm sm:text-base font-bold ${bgColor} ${textColor}`}
                  onClick={() => setGuess(guess + letra)}
                  disabled={isCorrect || lose}
                >
                  {letra}
                </button>
              )
            })}
          </div>
        ))}
        <div className="flex gap-2 mt-2 justify-center w-full flex-wrap">
          <button
            onClick={() => setGuess(guess.slice(0, -1))}
            disabled={isCorrect || lose || guess.length === 0}
            className={`flex items-center justify-center rounded border border-[#9ca3af] px-3 h-10 text-sm font-bold ${
              isCorrect || guess.length === 0
                ? 'bg-[#e5e7eb] text-[#111]'
                : 'bg-[#e2584d] text-[#eee] hover:bg-[#ab473f]'
            }`}
          >
            <Delete className="h-5 w-5 text-[#111]" />
          </button>
          <button
            onClick={checkGuess}
            disabled={isCorrect || lose || guess.length !== word.length}
            className={`flex items-center justify-center rounded border border-[#9ca3af] px-4 h-10 text-sm font-bold ${
              isCorrect || guess.length !== word.length
                ? 'bg-[#e5e7eb] text-[#111]'
                : 'bg-[#36AA4D] text-white hover:bg-[#008000]'
            }`}
          >
            ENTER
          </button>
        </div>
      </div>
    )
  }