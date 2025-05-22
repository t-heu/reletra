import dictionary from "../dictionary.json"

const DICTIONARY: Record<string, string[]> = dictionary;

// Pega todas as palavras válidas (flattened)
const getAllWords = () => {
  return Object.values(DICTIONARY).flat();
};

// Pega uma lista de palavras com um tamanho específico
const getWordsOfLength = (length: number): string[] => {
  return DICTIONARY[String(length)] || [];
};

// Gera a palavra do dia baseada na data e tamanho desejado
export const generateDailyWord = (length: number = 5): string => {
  const words = getWordsOfLength(length);
  if (words.length === 0) throw new Error(`Sem palavras de tamanho ${length}`);

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  return words[dayOfYear % words.length];
};

// Gera uma palavra aleatória com tamanho escolhido (ou aleatório se não passar)
export const generateRandomWord = (length?: number): string => {
  let words: string[];

  if (length) {
    words = getWordsOfLength(length);
    if (words.length === 0) throw new Error(`Sem palavras de tamanho ${length}`);
  } else {
    // Tamanho aleatório com pelo menos uma palavra
    const validLengths = Object.entries(DICTIONARY)
      .filter(([_, words]) => words.length > 0)
      .map(([len]) => Number(len));

    const randomLength = validLengths[Math.floor(Math.random() * validLengths.length)];
    words = getWordsOfLength(randomLength);
  }

  return words[Math.floor(Math.random() * words.length)];
};
