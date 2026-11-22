import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addDoc, serverTimestamp } from 'firebase/firestore';

vi.mock('../../../lib/firebase/firestore', () => ({ db: {} }));
vi.mock('../../../lib/firebase/auth', () => ({ auth: { currentUser: null } }));

import { auth } from '../../../lib/firebase/auth';
import { submitRoti } from './roti.api';

const savedDoc = () => vi.mocked(addDoc).mock.calls[0][1] as Record<string, unknown>;

describe('submitRoti', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(serverTimestamp).mockReturnValue('ts' as never);
    (auth as { currentUser: unknown }).currentUser = null;
  });

  it('rejects an invalid score without writing', async () => {
    await expect(
      submitRoti({ score: 6 as never, source: 'quiz' }),
    ).rejects.toThrow('Invalid ROTI score');
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('stores userId as null for an anonymous visitor', async () => {
    await submitRoti({ score: 4, source: 'quiz' });
    expect(savedDoc()).toMatchObject({
      score: 4,
      source: 'quiz',
      userId: null,
      moduleId: null,
      createdAt: 'ts',
    });
  });

  it('attaches the uid of a signed-in user', async () => {
    (auth as { currentUser: unknown }).currentUser = { uid: 'u1' };
    await submitRoti({ score: 5, source: 'page', moduleId: 'm1' });
    expect(savedDoc()).toMatchObject({ userId: 'u1', moduleId: 'm1', source: 'page' });
  });

  it('keeps a trimmed comment for a low score', async () => {
    await submitRoti({ score: 2, source: 'quiz', comment: '  trop long  ' });
    expect(savedDoc().comment).toBe('trop long');
  });

  it('drops the comment for a high score or an empty comment', async () => {
    await submitRoti({ score: 5, source: 'quiz', comment: 'super' });
    await submitRoti({ score: 1, source: 'quiz', comment: '   ' });
    const calls = vi.mocked(addDoc).mock.calls.map((c) => c[1] as Record<string, unknown>);
    expect(calls[0]).not.toHaveProperty('comment');
    expect(calls[1]).not.toHaveProperty('comment');
  });
});
