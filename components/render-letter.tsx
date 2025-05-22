const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const renderLetter = (tentativa: string, index: number, letraIndex: number, word: any) => {
  const letra = tentativa[letraIndex]

  const highlightClasses = "flex items-center justify-center p-2 h-12 w-12 sm:h-16 sm:w-16 transition-none font-bold text-white text-xl";

  if (!letra) {
    return <div key={`${index}-${letraIndex}`} className={highlightClasses} />
  }

  // Define classes conforme o status da letra
  let colorClasses = ""
  if (removeAccents(word[letraIndex]) === removeAccents(letra)) {
    colorClasses = "bg-green-500 text-white"
  } else if (word.includes(letra)) {
    colorClasses = "bg-yellow-400 text-white"
  } else {
    colorClasses = "bg-gray-500 text-white" // pode manter o fundo escuro para letra errada
  }

  // Retorna a div com a cor certa e letra
  return (
    <div key={`${index}-${letraIndex}`} className={`${highlightClasses} ${colorClasses}`}>
      {letra}
    </div>
  )
}

export default renderLetter;
