import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RotiEntry } from '../../types/roti.types';
import { computeRotiStats } from '../../utils/roti.utils';

vi.mock('../../hooks/useRotiStats', () => ({ useRotiStats: vi.fn() }));

import { useRotiStats } from '../../hooks/useRotiStats';
import RotiStats from './RotiStats';

const entry = (id: string, score: number, ms: number, extra: Partial<RotiEntry> = {}) =>
  ({
    id,
    score,
    source: 'quiz',
    userId: null,
    createdAt: { toMillis: () => ms, toDate: () => new Date(ms) },
    ...extra,
  }) as unknown as RotiEntry;

const mockHook = (entries: RotiEntry[], over: Record<string, unknown> = {}) =>
  vi.mocked(useRotiStats).mockReturnValue({
    stats: computeRotiStats(entries),
    isLoading: false,
    error: null,
    ...over,
  } as ReturnType<typeof useRotiStats>);

describe('RotiStats', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows a loading state', () => {
    mockHook([], { isLoading: true });
    render(<RotiStats />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows an error state', () => {
    mockHook([], { error: new Error('denied') });
    render(<RotiStats />);
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load ROTI ratings.');
  });

  it('shows an empty state without ratings', () => {
    mockHook([]);
    render(<RotiStats />);
    expect(screen.getByText('No ROTI rating yet.')).toBeInTheDocument();
  });

  it('shows total, average and distribution', () => {
    mockHook([entry('a', 5, 1), entry('b', 3, 2), entry('c', 1, 3), entry('d', 3, 4)]);
    render(<RotiStats />);
    expect(screen.getByText('Ratings').closest('.stat-card')).toHaveTextContent('4');
    expect(screen.getByText('3.0 / 5')).toBeInTheDocument();
    const rows = screen.getByRole('list', { name: 'Ratings distribution' }).querySelectorAll('li');
    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveTextContent('5'); // highest score first
    expect(rows[2]).toHaveTextContent('2 (50%)'); // score 3
  });

  it('lists the latest comments with their source', () => {
    mockHook([
      entry('a', 1, 1, { comment: 'too long', source: 'page' }),
      entry('b', 2, 2, { comment: 'meh' }),
      entry('c', 5, 3),
    ]);
    render(<RotiStats />);
    expect(screen.getByText('Latest comments')).toBeInTheDocument();
    expect(screen.getByText('too long')).toBeInTheDocument();
    expect(screen.getByText(/ROTI page/)).toBeInTheDocument();
    expect(screen.getByText(/End of quiz/)).toBeInTheDocument();
  });

  it('hides the comments block when there is none', () => {
    mockHook([entry('a', 4, 1)]);
    render(<RotiStats />);
    expect(screen.queryByText('Latest comments')).toBeNull();
  });
});
