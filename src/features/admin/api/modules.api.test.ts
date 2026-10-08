import { describe, expect, it } from 'vitest';
import type { Module } from '../types/module.types';
import { sortModules } from './modules.api';

const mod = (id: string, createdAtMs: number, order?: number) =>
  ({ id, order, createdAt: { toMillis: () => createdAtMs } }) as unknown as Module;

describe('sortModules', () => {
  it('sorts by ascending order', () => {
    const sorted = sortModules([mod('c', 1, 2), mod('a', 3, 0), mod('b', 2, 1)]);
    expect(sorted.map((m) => m.id)).toEqual(['a', 'b', 'c']);
  });

  it('keeps legacy modules (no order) first, newest first, then ordered ones', () => {
    const sorted = sortModules([mod('new', 9, 5), mod('old', 1), mod('mid', 5)]);
    expect(sorted.map((m) => m.id)).toEqual(['mid', 'old', 'new']);
  });

  it('does not mutate the input', () => {
    const input = [mod('b', 1, 1), mod('a', 1, 0)];
    sortModules(input);
    expect(input.map((m) => m.id)).toEqual(['b', 'a']);
  });
});
