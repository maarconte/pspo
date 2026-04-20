import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db } from '../../../lib/firebase/firestore';
import { getStorage } from 'firebase/storage';
import { app } from '../../../lib/firebase/config';
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
} from '../types/support.types';

const storage = getStorage(app);
const TICKETS_COLLECTION = 'tickets';

// ─── Subscribe (real-time) ────────────────────────────────────────────────────

export const subscribeToTickets = (
  onUpdate: (tickets: Ticket[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  const q = query(
    collection(db, TICKETS_COLLECTION),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tickets = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Ticket[];
      onUpdate(tickets);
    },
    (error) => {
      console.error('subscribeToTickets error:', error);
      onError?.(error);
    },
  );
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createTicket = async (
  payload: CreateTicketPayload,
  authorId: string,
  authorName: string,
): Promise<string> => {
  let imageUrl: string | undefined;
  let imagePath: string | undefined;

  if (payload.imageFile) {
    const ext = payload.imageFile.name.split('.').pop();
    const path = `tickets/${Date.now()}_${authorId}.${ext}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, payload.imageFile);
    imageUrl = await getDownloadURL(storageRef);
    imagePath = path;
  }

  const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
    name: payload.name.trim(),
    description: payload.description.trim(),
    imageUrl: imageUrl ?? null,
    imagePath: imagePath ?? null,
    authorId,
    authorName,
    status: 'todo',
    priority: 'P3',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateTicket = async (
  ticketId: string,
  payload: UpdateTicketPayload,
): Promise<void> => {
  const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
  await updateDoc(ticketRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteTicket = async (
  ticketId: string,
  imagePath?: string | null,
): Promise<void> => {
  // 1. Suppression du document Firestore
  await deleteDoc(doc(db, TICKETS_COLLECTION, ticketId));

  // 2. Suppression RGPD : supprime le fichier Storage si présent
  if (imagePath) {
    try {
      await deleteObject(ref(storage, imagePath));
    } catch (err) {
      // L'objet peut avoir déjà été supprimé — on log sans bloquer
      console.warn('Storage cleanup warning:', err);
    }
  }
};
