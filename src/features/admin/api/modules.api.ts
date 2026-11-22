import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDoc,
  getDocs,
  serverTimestamp,
  increment,
  writeBatch,
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
import { getFormationLabel, getFormationValue } from '../../../utils/helpers/formationLabel';
import { MODULES_COLLECTION, QUESTIONS_COLLECTION } from '../../../utils/constants';
import { DuplicateModuleTitleError } from './moduleErrors';
import type {
  Module,
  CreateModulePayload,
  UpdateModulePayload,
} from '../types/module.types';

const storage = getStorage(app);

// ─── Subscribe (real-time) ────────────────────────────────────────────────────

// Modules without an `order` (legacy) come first, newest first, as before;
// ordered modules follow by ascending `order`.
const toMillis = (module: Module): number =>
  module.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;

export const sortModules = (modules: Module[]): Module[] =>
  [...modules].sort((a, b) => {
    const orderA = a.order ?? -Infinity;
    const orderB = b.order ?? -Infinity;
    if (orderA !== orderB) return orderA < orderB ? -1 : 1;
    return toMillis(b) - toMillis(a);
  });

export const subscribeToModules = (
  onUpdate: (modules: Module[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    collection(db, MODULES_COLLECTION),
    (snapshot) => {
      const modules = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Module[];
      onUpdate(sortModules(modules));
    },
    (error) => {
      console.error('subscribeToModules error:', error);
      onError?.(error);
    },
  );
};

// ─── Title uniqueness ─────────────────────────────────────────────────────────

const normalizeTitle = (title: string): string => title.trim().toLowerCase();

/**
 * A module's title is its identity for questions (`Question.type`), so two
 * modules must never share one. Compared case-insensitively ("PSM" and "psm"
 * would otherwise be two modules yet easy to confuse). `excludeId` is the
 * module being edited.
 */
export const assertModuleTitleAvailable = async (
  title: string,
  excludeId?: string,
): Promise<void> => {
  const wanted = normalizeTitle(title);
  const snapshot = await getDocs(collection(db, MODULES_COLLECTION));
  const taken = snapshot.docs.some(
    (d) => d.id !== excludeId && normalizeTitle(String(d.data().title ?? '')) === wanted,
  );
  if (taken) throw new DuplicateModuleTitleError(title.trim());
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createModule = async (
  payload: CreateModulePayload,
): Promise<string> => {
  await assertModuleTitleAvailable(payload.title);

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
    usefulLinks: payload.usefulLinks || null,
    domains: payload.domains ?? [],
    domainPercents: payload.domainPercents ?? {},
    completedCount: 0,
    // Appended after existing modules; reordering renumbers everything from 0.
    order: Date.now(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

// ─── Reorder ──────────────────────────────────────────────────────────────────

export const reorderModules = async (orderedIds: string[]): Promise<void> => {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, MODULES_COLLECTION, id), { order: index });
  });
  await batch.commit();
};

// ─── Update ───────────────────────────────────────────────────────────────────

// Firestore batches are capped at 500 writes.
const RENAME_BATCH_SIZE = 400;

/**
 * Questions are linked to a module by value, not by id: `Question.type` holds
 * the module's formation value (derived from its title). Renaming a module
 * therefore has to rewrite `type` on every question of the old formation, or
 * they stop matching the module and vanish from it.
 *
 * Safe to retry: a partial failure leaves the module title untouched (see
 * updateModule), so the remaining questions are found again by the old type.
 */
export const renameQuestionsFormation = async (
  oldFormation: string,
  newFormation: string,
): Promise<number> => {
  if (oldFormation === newFormation) return 0;

  const snapshot = await getDocs(
    query(collection(db, QUESTIONS_COLLECTION), where('type', '==', oldFormation)),
  );

  for (let i = 0; i < snapshot.docs.length; i += RENAME_BATCH_SIZE) {
    const batch = writeBatch(db);
    snapshot.docs
      .slice(i, i + RENAME_BATCH_SIZE)
      .forEach((d) => batch.update(d.ref, { type: newFormation }));
    await batch.commit();
  }

  return snapshot.docs.length;
};

export const updateModule = async (
  moduleId: string,
  payload: UpdateModulePayload,
  previousPdfPath?: string | null,
): Promise<void> => {
  const { pdfFile, removePdf, usefulLinks, ...rest } = payload;

  const moduleRef = doc(db, MODULES_COLLECTION, moduleId);

  // Title checks run before anything is written (PDF included), so a rejected
  // rename leaves everything as it was. Questions are migrated first and the
  // module second: if the migration fails, the module keeps its old title and
  // the admin can simply retry.
  if (rest.title !== undefined) {
    const previousTitle = (await getDoc(moduleRef)).data()?.title as string | undefined;
    if (previousTitle && previousTitle !== rest.title) {
      await assertModuleTitleAvailable(rest.title, moduleId);
      await renameQuestionsFormation(
        getFormationValue(previousTitle),
        getFormationValue(rest.title),
      );
    }
  }

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

  await updateDoc(moduleRef, {
    ...rest,
    ...(usefulLinks !== undefined ? { usefulLinks: usefulLinks || null } : {}),
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
