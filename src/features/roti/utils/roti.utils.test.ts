import { describe, expect, it } from 'vitest';
import type { RotiEntry } from '../types/roti.types';
import { canComment, computeRotiStats, isRotiScore, normalizeComment } from './roti.utils';

const entry = (score: number, ms: number, comment?: string) =>
  ({ id: `${ms}`, score, comment, createdAt: { toMillis: () => ms } }) as unknown as RotiEntry;

describe('isRotiScore', () => {
  it('accepts integers 1 to 5 only', () => {
    expect([1, 2, 3, 4, 5].every(isRotiScore)).toBe(true);
    expect([0, 6, 2.5, NaN, '3', null].some(isRotiScore)).toBe(false);
  });
});

describe('canComment', () => {
  it('is true for scores <= 3 only', () => {
    expect(canComment(null)).toBe(false);
    expect(canComment(3)).toBe(true);
    expect(canComment(4)).toBe(false);
  });
});

describe('normalizeComment', () => {
  it('trims and drops empty comments', () => {
    expect(normalizeComment(2, '  hi  ')).toBe('hi');
    expect(normalizeComment(2, '   ')).toBeUndefined();
  });
  it('drops the comment for high scores', () => {
    expect(normalizeComment(5, 'great')).toBeUndefined();
  });
  it('caps the length', () => {
    expect(normalizeComment(1, 'a'.repeat(2000))).toHaveLength(1000);
  });
});

describe('computeRotiStats', () => {
  it('handles no entries', () => {
    const stats = computeRotiStats([]);
    expect(stats.total).toBe(0);
    expect(stats.average).toBeNull();
    expect(stats.distribution).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  });
  it('computes average, distribution and newest-first comments', () => {
    const stats = computeRotiStats([entry(5, 1), entry(3, 2, 'old'), entry(1, 3, 'new')]);
    expect(stats.total).toBe(3);
    expect(stats.average).toBe(3);
    expect(stats.distribution).toEqual({ 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 });
    expect(stats.comments.map((c) => c.comment)).toEqual(['new', 'old']);
  });
});
