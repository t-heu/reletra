import dictionary from "../dictionary.json"

const PALAVRAS = dictionary.words;

// Função para obter a palavra do dia baseada na data
export const generateDailyWord = () => {
  const hoje = new Date()
  const diaDoAno = Math.floor(
    (hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return PALAVRAS[diaDoAno % PALAVRAS.length]
}

export const generateRandomWord = () => {
  return PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)]
}
