import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { Firebase } from "../firebase.js";

const db = getFirestore(Firebase);

export const updateQuestion = async (questionId: string, data: any) => {
  const docRef = doc(db, "questions", questionId);
  return await updateDoc(docRef, { ...data });
};
