const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const renderLetter = (tentativa: string, index: number, letraIndex: number, word: any) => {
  const letra = tentativa[letraIndex]

  const highlightClasses = "font-code flex items-center justify-center font-bold transition-none text-white text-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-xl sm:text-2xl md:text-3xl";

  if (!letra) {
    return <div key={`${index}-${letraIndex}`} className={highlightClasses} />
  }

  // Define classes conforme o status da letra
  let colorClasses = ""
  if (removeAccents(word[letraIndex]) === removeAccents(letra)) {
    colorClasses = "bg-[#16a34a] text-white"
  } else if (word.includes(letra)) {
    colorClasses = "bg-[#eab308] text-white"
  } else {
    colorClasses = "bg-[#787c7e] text-white" // pode manter o fundo escuro para letra errada
  }

  // Retorna a div com a cor certa e letra
  return (
    <div key={`${index}-${letraIndex}`} className={`${highlightClasses} ${colorClasses}`}>
      {letra}
    </div>
  )
}

export default renderLetter;
