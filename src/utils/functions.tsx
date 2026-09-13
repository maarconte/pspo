import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { QUESTIONS_COLLECTION } from "./constants";


export const updateQuestion = async (questionId: string, data: any) => {
  const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
  return await updateDoc(docRef, { ...data });
};
