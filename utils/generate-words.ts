import words_easy from "../words_easy.json";

// O dicionário agora é um array gigante
const WORDS_EASY: string[] = (words_easy as { words: string[] }).words;

// Filtra palavras de 3 a 6 letras
const getWordsOfValidLength = (source: string[]): string[] => {
  return source.filter(word => word.length >= 3 && word.length <= 6);
};

const getWordsOfLength = (length: number, source: string[]): string[] => {
  if (length < 3 || length > 6) return [];
  return source.filter(word => word.length === length);
};

// Palavra do dia baseada no tamanho e data
export const generateDailyWord = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  const lengths = [3, 4, 5, 6];
  const length = lengths[dayOfYear % lengths.length];

  const source = WORDS_EASY;
  const words = getWordsOfLength(length, source);

  return (words[dayOfYear % words.length]).toUpperCase();
};

// Palavra aleatória de 3 a 6 letras
export const generateRandomWord = (length?: number): string => {
  const source = WORDS_EASY;
  let words: string[];

  if (length) {
    words = getWordsOfLength(length, source);
  } else {
    const allValid = getWordsOfValidLength(source);
    return (allValid[Math.floor(Math.random() * allValid.length)]).toUpperCase();
  }

  if (words.length === 0) throw new Error(`Sem palavras de tamanho ${length}`);
  return (words[Math.floor(Math.random() * words.length)]).toUpperCase();
};

const getDayOfYear = (date: Date): number => {
  return Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
    (1000 * 60 * 60 * 24)
  );
};

export const getYesterdayWord = (daysAgo: number = 1): string => {
  const lengths = [3, 4, 5, 6];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - daysAgo);

  const dayOfYear = getDayOfYear(yesterday);
  const length = lengths[dayOfYear % lengths.length];
  const source = WORDS_EASY;
  const words = getWordsOfLength(length, source);

  return (words[dayOfYear % words.length]).toUpperCase();
};
