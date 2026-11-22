import {
  ROTI_COMMENT_MAX_LENGTH,
  ROTI_COMMENT_MAX_SCORE,
  ROTI_SCORES,
  type RotiEntry,
  type RotiScore,
  type RotiStats,
} from '../types/roti.types';

export const isRotiScore = (value: unknown): value is RotiScore =>
  typeof value === 'number' && (ROTI_SCORES as readonly number[]).includes(value);

export const canComment = (score: RotiScore | null): boolean =>
  score !== null && score <= ROTI_COMMENT_MAX_SCORE;

/** Trims the comment; drops it when empty, too long, or the score is too high. */
export const normalizeComment = (
  score: RotiScore,
  comment?: string,
): string | undefined => {
  if (!canComment(score)) return undefined;
  const trimmed = comment?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, ROTI_COMMENT_MAX_LENGTH);
};

const toMillis = (entry: RotiEntry): number => entry.createdAt?.toMillis?.() ?? 0;

export const computeRotiStats = (entries: RotiEntry[]): RotiStats => {
  const distribution: Record<RotiScore, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const entry of entries) {
    distribution[entry.score] += 1;
    sum += entry.score;
  }
  return {
    total: entries.length,
    average: entries.length ? sum / entries.length : null,
    distribution,
    comments: entries.filter((e) => e.comment).sort((a, b) => toMillis(b) - toMillis(a)),
  };
};
