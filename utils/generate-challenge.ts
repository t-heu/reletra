const SECRET_KEY = 'minha-chave-secreta';

function xorEncrypt(str: string, key: string): string {
  return btoa(
    str
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join('')
  );
}

function xorDecrypt(encoded: string, key: string): string {
  const decoded = atob(encoded);
  return decoded
    .split('')
    .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
    .join('');
}

export function encodeWord(word: string): string {
  return xorEncrypt(word, SECRET_KEY);
}

export function decodeWord(encrypted: string): string {
  return xorDecrypt(encrypted, SECRET_KEY);
}

export function generateChallengeLink(palavra: string) {
  const encoded = encodeWord(palavra);
  const url = `${window.location.origin}?challenge=${encodeURIComponent(encoded)}`;
  return url;
}
