import CryptoJS from "crypto-js";

export function encodeWord(word: string) {
  return CryptoJS.AES.encrypt(word, "chave-secresadadasta").toString();
}

export function decodeWord(encrypted: string) {
  const bytes = CryptoJS.AES.decrypt(encrypted, "chave-secresadadasta");
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function generateChallengeLink(palavra: string) {
  const encoded = encodeWord(palavra);
  const url = `${window.location.origin}?challenge=${encoded}`;
  return url;
}
