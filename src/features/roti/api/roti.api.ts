import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/firestore';
import { auth } from '../../../lib/firebase/auth';
import { ROTI_COLLECTION } from '../../../utils/constants';
import type { RotiEntry, SubmitRotiPayload } from '../types/roti.types';
import { isRotiScore, normalizeComment } from '../utils/roti.utils';

/** Open to visitors and signed-in users; the author UID is attached when known. */
export const submitRoti = async (payload: SubmitRotiPayload): Promise<void> => {
  if (!isRotiScore(payload.score)) {
    throw new Error('Invalid ROTI score');
  }
  const comment = normalizeComment(payload.score, payload.comment);

  await addDoc(collection(db, ROTI_COLLECTION), {
    score: payload.score,
    source: payload.source,
    moduleId: payload.moduleId ?? null,
    userId: auth.currentUser?.uid ?? null,
    ...(comment ? { comment } : {}),
    createdAt: serverTimestamp(),
  });
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
