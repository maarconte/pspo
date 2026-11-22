import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';

vi.mock('../../../lib/firebase/firestore', () => ({ db: {} }));
vi.mock('../../../lib/firebase/auth', () => ({ auth: { currentUser: null } }));

import { auth } from '../../../lib/firebase/auth';
import { RotiAlreadySubmittedError, submitRoti } from './roti.api';
import { getRotiDocId } from '../utils/roti.utils';

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

  describe('signed-in user (limit: one per month)', () => {
    beforeEach(() => {
      (auth as { currentUser: unknown }).currentUser = { uid: 'u1' };
    });

    it('writes to the deterministic uid_month document', async () => {
      await submitRoti({ score: 5, source: 'page', moduleId: 'm1' });
      expect(doc).toHaveBeenCalledWith({}, expect.any(String), getRotiDocId('u1'));
      expect(addDoc).not.toHaveBeenCalled();
      expect(vi.mocked(setDoc).mock.calls[0][1]).toMatchObject({
        userId: 'u1',
        moduleId: 'm1',
        source: 'page',
      });
    });

    it('turns a permission-denied write into RotiAlreadySubmittedError', async () => {
      vi.mocked(setDoc).mockRejectedValueOnce({ code: 'permission-denied' });
      await expect(submitRoti({ score: 3, source: 'quiz' })).rejects.toBeInstanceOf(
        RotiAlreadySubmittedError,
      );
    });

    it('rethrows other errors untouched', async () => {
      const boom = new Error('network');
      vi.mocked(setDoc).mockRejectedValueOnce(boom);
      await expect(submitRoti({ score: 3, source: 'quiz' })).rejects.toBe(boom);
    });

    it('lets admins/devs (unlimited) write a fresh document every time', async () => {
      await submitRoti({ score: 4, source: 'quiz', unlimited: true });
      expect(setDoc).not.toHaveBeenCalled();
      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(savedDoc()).toMatchObject({ userId: 'u1' });
    });
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
