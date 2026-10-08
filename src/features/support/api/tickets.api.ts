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
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type StorageReference,
} from 'firebase/storage';
import { db } from '../../../lib/firebase/firestore';
import { getStorage } from 'firebase/storage';
import { app } from '../../../lib/firebase/config';
import { auth } from '../../../lib/firebase/auth';
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
} from '../types/support.types';

const storage = getStorage(app);
const TICKETS_COLLECTION = 'tickets';
const UPLOAD_TIMEOUT_MS = 30_000;

export class UploadTimeoutError extends Error {
  constructor() {
    super('Upload timed out');
    this.name = 'UploadTimeoutError';
  }
}

// Storage retries silently for minutes when the network (VPN/proxy) blocks it,
// so cancel the upload ourselves and let the UI report the failure.
const uploadWithTimeout = (storageRef: StorageReference, file: File): Promise<void> =>
  new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    const timer = setTimeout(() => {
      task.cancel();
      reject(new UploadTimeoutError());
    }, UPLOAD_TIMEOUT_MS);

    task.on(
      'state_changed',
      null,
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
      () => {
        clearTimeout(timer);
        resolve();
      },
    );
  });

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
    await uploadWithTimeout(storageRef, payload.imageFile);
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
    updatedBy: auth.currentUser?.uid ?? null,
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
