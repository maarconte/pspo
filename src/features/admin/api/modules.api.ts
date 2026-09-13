import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  serverTimestamp,
  increment,
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
import { getFormationLabel } from '../../../utils/helpers/formationLabel';
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
  let pdfSizeBytes: number | undefined;

  if (payload.pdfFile) {
    const path = `modules/${Date.now()}_${payload.pdfFile.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, payload.pdfFile);
    pdfUrl = await getDownloadURL(storageRef);
    pdfPath = path;
    pdfSizeBytes = payload.pdfFile.size;
  }

  const docRef = await addDoc(collection(db, MODULES_COLLECTION), {
    title: payload.title.trim(),
    isActive: payload.isActive,
    quizDuration: payload.quizDuration,
    questionCount: payload.questionCount,
    minSuccessPercent: payload.minSuccessPercent,
    pdfUrl: pdfUrl ?? null,
    pdfPath: pdfPath ?? null,
    pdfSizeBytes: pdfSizeBytes ?? null,
    completedCount: 0,
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
  const { pdfFile, removePdf, ...rest } = payload;
  let pdfUrl: string | undefined;
  let pdfPath: string | undefined;
  let pdfSizeBytes: number | undefined;

  if (pdfFile) {
    const path = `modules/${Date.now()}_${pdfFile.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, pdfFile);
    pdfUrl = await getDownloadURL(storageRef);
    pdfPath = path;
    pdfSizeBytes = pdfFile.size;

    if (previousPdfPath) {
      try {
        await deleteObject(ref(storage, previousPdfPath));
      } catch (err) {
        console.warn('Storage cleanup warning:', err);
      }
    }
  } else if (removePdf && previousPdfPath) {
    try {
      await deleteObject(ref(storage, previousPdfPath));
    } catch (err) {
      console.warn('Storage cleanup warning:', err);
    }
  }

  const moduleRef = doc(db, MODULES_COLLECTION, moduleId);
  await updateDoc(moduleRef, {
    ...rest,
    ...(pdfUrl ? { pdfUrl, pdfPath, pdfSizeBytes } : {}),
    ...(!pdfUrl && removePdf ? { pdfUrl: null, pdfPath: null, pdfSizeBytes: null } : {}),
    updatedAt: serverTimestamp(),
  });
};

// ─── Completed quiz counter ────────────────────────────────────────────────────

/**
 * Increments the completed-quiz counter of the module matching a formation.
 * Called after a quiz session is saved; silently no-ops if no module matches
 * (e.g. formation has no corresponding module yet).
 */
export const incrementModuleCompletedCount = async (
  formation: string,
): Promise<void> => {
  const title = getFormationLabel(formation);
  const q = query(collection(db, MODULES_COLLECTION), where('title', '==', title));
  const snapshot = await getDocs(q);
  const moduleDoc = snapshot.docs[0];
  if (!moduleDoc) return;

  await updateDoc(moduleDoc.ref, { completedCount: increment(1) });
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
