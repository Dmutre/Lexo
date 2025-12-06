export function isAbbreviation(word: string): boolean {
  if (/^[A-Z]+$/.test(word)) return true;

  if (/^([A-Z]\.)+$/.test(word)) return true;

  return false;
}