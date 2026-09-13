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
  getStorage,
} from 'firebase/storage';
import { db } from '../../../lib/firebase/firestore';
import { app } from '../../../lib/firebase/config';
import type {
  Module,
  CreateModulePayload,
  UpdateModulePayload,
} from '../types/module.types';

const storage = getStorage(app);
const MODULES_COLLECTION = 'modules';

// ─── Subscribe (real-time) ────────────────────────────────────────────────────

export const subscribeToModules = (
  onUpdate: (modules: Module[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  const q = query(
    collection(db, MODULES_COLLECTION),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const modules = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Module[];
      onUpdate(modules);
    },
    (error) => {
      console.error('subscribeToModules error:', error);
      onError?.(error);
    },
  );
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createModule = async (
  payload: CreateModulePayload,
): Promise<string> => {
  let pdfUrl: string | undefined;
  let pdfPath: string | undefined;

  if (payload.pdfFile) {
    const path = `modules/${Date.now()}_${payload.pdfFile.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, payload.pdfFile);
    pdfUrl = await getDownloadURL(storageRef);
    pdfPath = path;
  }

  const docRef = await addDoc(collection(db, MODULES_COLLECTION), {
    title: payload.title.trim(),
    isActive: payload.isActive,
    quizDuration: payload.quizDuration,
    questionCount: payload.questionCount,
    minSuccessPercent: payload.minSuccessPercent,
    pdfUrl: pdfUrl ?? null,
    pdfPath: pdfPath ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateModule = async (
  moduleId: string,
  payload: UpdateModulePayload,
  previousPdfPath?: string | null,
): Promise<void> => {
  const { pdfFile, ...rest } = payload;
  let pdfUrl: string | undefined;
  let pdfPath: string | undefined;

  if (pdfFile) {
    const path = `modules/${Date.now()}_${pdfFile.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, pdfFile);
    pdfUrl = await getDownloadURL(storageRef);
    pdfPath = path;

    if (previousPdfPath) {
      try {
        await deleteObject(ref(storage, previousPdfPath));
      } catch (err) {
        console.warn('Storage cleanup warning:', err);
      }
    }
  }

  const moduleRef = doc(db, MODULES_COLLECTION, moduleId);
  await updateDoc(moduleRef, {
    ...rest,
    ...(pdfUrl ? { pdfUrl, pdfPath } : {}),
    updatedAt: serverTimestamp(),
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteModule = async (
  moduleId: string,
  pdfPath?: string | null,
): Promise<void> => {
  await deleteDoc(doc(db, MODULES_COLLECTION, moduleId));

  if (pdfPath) {
    try {
      await deleteObject(ref(storage, pdfPath));
    } catch (err) {
      console.warn('Storage cleanup warning:', err);
    }
  }
};
