const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const renderLetter = (tentativa: string, index: number, letraIndex: number, word: any) => {
  const letra = tentativa[letraIndex]

  // Classes base comuns para todas as divs (que não são letras corretas ou amarelas)
  const baseClasses = "flex items-center justify-center rounded-[2px] p-2.5 w-8 sm:w-10 h-10 transition-none cursor-pointer font-medium text-sm"
  const highlightClasses = "flex items-center justify-center rounded-[2px] p-2.5 w-8 sm:w-10 h-10 transition-none cursor-pointer font-medium text-sm font-bold text-white"

  if (!letra) {
    return <div key={`${index}-${letraIndex}`} className={baseClasses} />
  }

  // Define classes conforme o status da letra
  let colorClasses = "bg-[#222]"
  if (removeAccents(word[letraIndex]) === removeAccents(letra)) {
    colorClasses = "bg-green-500"
  } else if (word.includes(letra)) {
    colorClasses = "bg-yellow-500"
  } else {
    colorClasses = "bg-gray-500" // pode manter o fundo escuro para letra errada
  }

  // Retorna a div com a cor certa e letra
  return (
    <div key={`${index}-${letraIndex}`} className={`${highlightClasses} ${colorClasses}`}>
      {letra}
    </div>
  )
}

export default renderLetter;
