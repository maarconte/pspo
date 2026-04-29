import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";


export const updateQuestion = async (questionId: string, data: any) => {
  const docRef = doc(db, "questions", questionId);
  return await updateDoc(docRef, { ...data });
};
