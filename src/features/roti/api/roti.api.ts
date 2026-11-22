import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/firestore';
import { auth } from '../../../lib/firebase/auth';
import { ROTI_COLLECTION } from '../../../utils/constants';
import type { RotiEntry, SubmitRotiPayload } from '../types/roti.types';
import { getRotiDocId, isRotiScore, normalizeComment } from '../utils/roti.utils';

/** The signed-in user already rated this month (rejected by Firestore rules). */
export class RotiAlreadySubmittedError extends Error {
  constructor() {
    super('ROTI already submitted this month');
    this.name = 'RotiAlreadySubmittedError';
  }
}

/**
 * Open to visitors and signed-in users; the author UID is attached when known.
 *
 * Limit of one ROTI per month: a signed-in user writes to a deterministic
 * document id (`uid_YYYY-M`), so Firestore rules reject a second write.
 * Anonymous visitors can only be limited client-side (see useRotiEligibility).
 * Admins and devs (`unlimited`) always get a fresh document.
 */
export const submitRoti = async (payload: SubmitRotiPayload): Promise<void> => {
  if (!isRotiScore(payload.score)) {
    throw new Error('Invalid ROTI score');
  }
  const comment = normalizeComment(payload.score, payload.comment);
  const uid = auth.currentUser?.uid ?? null;

  const data = {
    score: payload.score,
    source: payload.source,
    moduleId: payload.moduleId ?? null,
    userId: uid,
    ...(comment ? { comment } : {}),
    createdAt: serverTimestamp(),
  };

  if (uid && !payload.unlimited) {
    try {
      await setDoc(doc(db, ROTI_COLLECTION, getRotiDocId(uid)), data);
    } catch (error) {
      if ((error as { code?: string }).code === 'permission-denied') {
        throw new RotiAlreadySubmittedError();
      }
      throw error;
    }
    return;
  }

  await addDoc(collection(db, ROTI_COLLECTION), data);
};

/** Admin only (enforced by Firestore rules). */
export const subscribeToRoti = (
  onUpdate: (entries: RotiEntry[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe =>
  onSnapshot(
    query(collection(db, ROTI_COLLECTION), orderBy('createdAt', 'desc')),
    (snapshot) => {
      onUpdate(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as RotiEntry[]);
    },
    (error) => {
      console.error('subscribeToRoti error:', error);
      onError?.(error);
    },
  );
