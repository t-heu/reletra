import dictionary from "../validWords.json";

// O dicionário agora é um array gigante
const DICTIONARY: string[] = (dictionary as { words: string[] }).words;

// Filtra palavras de 3 a 6 letras
const getWordsOfValidLength = (): string[] => {
  return DICTIONARY.filter(word => word.length >= 3 && word.length <= 6);
};

// Pega palavras de um tamanho específico (3 a 6)
const getWordsOfLength = (length: number): string[] => {
  if (length < 3 || length > 6) return [];
  return DICTIONARY.filter(word => word.length === length);
};

// Palavra do dia baseada no tamanho e data
export const generateDailyWord = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  const lengths = [3, 4, 5, 6];
  const length = lengths[dayOfYear % lengths.length];
  const words = getWordsOfLength(length);

  return words[dayOfYear % words.length];
};

// Palavra aleatória de 3 a 6 letras
export const generateRandomWord = (length?: number): string => {
  let words: string[];

  if (length) {
    words = getWordsOfLength(length);
  } else {
    const allValid = getWordsOfValidLength();
    return allValid[Math.floor(Math.random() * allValid.length)];
  }

  if (words.length === 0) throw new Error(`Sem palavras de tamanho ${length}`);
  return words[Math.floor(Math.random() * words.length)];
};

const getValidWords = (): string[] => {
  return DICTIONARY.filter((word) => word.length >= 3 && word.length <= 6);
};

const getDayOfYear = (date: Date): number => {
  return Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
    (1000 * 60 * 60 * 24)
  );
};

export const getYesterdayWord = (): string => {
  const allWords = getValidWords();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dayOfYear = getDayOfYear(yesterday);
  return allWords[dayOfYear % allWords.length];
};
