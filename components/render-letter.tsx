import { removeAccents } from "../utils/remove-accents"

const renderLetter = (tentativa: string, index: number, letraIndex: number, word: any) => {
  const letra = tentativa[letraIndex]

  const highlightClasses =
    "font-archivo flex items-center justify-center font-bold transition-none text-white text-xl sm:text-2xl";

  const dynamicStyle = {
    width: `clamp(30px, ${100 / word.length}vw, 50px)`,
    height: `clamp(30px, ${100 / word.length}vw, 50px)`,
    fontSize: `clamp(1rem, ${6 / word.length}vw, 2rem)`
  };

  if (!letra) {
    return <div key={`${index}-${letraIndex}`} className={highlightClasses} />
  }

  // Define classes conforme o status da letra
  let colorClasses = ""
  if (removeAccents(word[letraIndex]) === removeAccents(letra)) {
    colorClasses = "bg-[#22c55e80] border-2 border-[#22c55eb3] text-white"
  } else if (word.includes(letra)) {
    colorClasses = "bg-[#eab30880] border-2 border-[#eab30880] text-white"
  } else {
    colorClasses = "bg-[#6b728080] text-white border-2 border-[#9ca3afb3]" // pode manter o fundo escuro para letra errada
  }

  // Retorna a div com a cor certa e letra
  return (
    <div key={`${index}-${letraIndex}`} style={dynamicStyle} className={`${highlightClasses} ${colorClasses}`}>
      {letra}
    </div>
  )
}

export default renderLetter;
