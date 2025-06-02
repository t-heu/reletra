import validWords from "../words.json";
import { removeAccents } from "../utils/remove-accents"

const wordList = (validWords as {words: string[]}).words;

export function checkWords(word: string) {
  const normalizedWordList = wordList.map(w => removeAccents(w.toUpperCase()));
  if (!normalizedWordList.includes(word)) {
    return true;
  }

  return false;
}

export function wordWithAccent(word: string) {
  const found = wordList.find(
    w => removeAccents(w.toUpperCase()) === word
  );

  return found
}
