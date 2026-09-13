/**
 * Normalizes text for loose equality comparisons (e.g. duplicate detection):
 * strips accents, lowercases, and collapses punctuation/whitespace into single spaces.
 */
export const normalizeText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
