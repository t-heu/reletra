import { removeAccents } from "../utils/remove-accents";
import words_easy from "../words_easy.json";

// Extrair os arrays dos arquivos JSON
const WORDS_EASY: string[] = (words_easy as { words: string[] }).words;

// Juntar os dois arrays em um só
const MERGED_DICTIONARY: string[] = WORDS_EASY;

const ALL_WORDS: { words: string[] } = {
  words: MERGED_DICTIONARY
};

// ✅ Pré-processa a lista só uma vez
const normalizedWordSet = new Set(
  (ALL_WORDS as { words: string[] }).words.map(w =>
    removeAccents(w.toUpperCase())
  )
);

// Usar essa original com acentos ainda para exibir ao jogador:
const wordList = (ALL_WORDS as { words: string[] }).words;

const normalizedWordMap = new Map<string, string>();

wordList.forEach(word => {
  const normalized = removeAccents(word.toUpperCase());
  if (!normalizedWordMap.has(normalized)) {
    normalizedWordMap.set(normalized, word);
  }
});

/**
 * Verifica se a palavra existe na lista normalizada
 */
export function checkWords(word: string) {
  return !normalizedWordSet.has(word); // true se for inválida
}

/**
 * Retorna a palavra original com acento
 */
export function wordWithAccent(word: string) {
  return normalizedWordMap.get(word); // undefined se não achar
}
