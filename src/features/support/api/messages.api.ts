import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/firestore';
import type { TicketMessage, SendMessagePayload } from '../types/support.types';

const TICKETS_COLLECTION = 'tickets';
const MESSAGES_SUB = 'messages';

// ─── Subscribe (real-time) ────────────────────────────────────────────────────

export const subscribeToMessages = (
  ticketId: string,
  onUpdate: (messages: TicketMessage[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  const q = query(
    collection(db, TICKETS_COLLECTION, ticketId, MESSAGES_SUB),
    orderBy('createdAt', 'asc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as TicketMessage[];
      onUpdate(messages);
    },
    (error) => {
      console.error('subscribeToMessages error:', error);
      onError?.(error);
    },
  );
};

// ─── Send ─────────────────────────────────────────────────────────────────────

export const sendMessage = async (
  ticketId: string,
  payload: SendMessagePayload,
): Promise<void> => {
  await addDoc(
    collection(db, TICKETS_COLLECTION, ticketId, MESSAGES_SUB),
    {
      ...payload,
      readBy: [payload.authorId],
      createdAt: serverTimestamp(),
    },
  );
};

// ─── Mark as Read ─────────────────────────────────────────────────────────────

export const markMessageAsRead = async (
  ticketId: string,
  messageId: string,
  userId: string,
): Promise<void> => {
  const msgRef = doc(db, TICKETS_COLLECTION, ticketId, MESSAGES_SUB, messageId);
  await updateDoc(msgRef, {
    readBy: arrayUnion(userId),
  });
};
