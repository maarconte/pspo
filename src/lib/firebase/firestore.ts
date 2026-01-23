import { getFirestore, collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { app } from './config';

export const db = getFirestore(app);

// Helper to get typed collection references
export const questionsCollection = () => collection(db, 'questions') as CollectionReference<DocumentData>;
