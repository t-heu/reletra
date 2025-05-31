import validWords from "../validWords.json";
import { removeAccents } from "../utils/remove-accents"

const wordList = (validWords as {words: string[]}).words;

export function checkWords(word: string) {
  const normalizedWordList = wordList.map(w => removeAccents(w.toUpperCase()));
  if (!normalizedWordList.includes(word)) {
    return true;
  }

  return false;
}
