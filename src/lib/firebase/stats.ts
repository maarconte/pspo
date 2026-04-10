import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firestore";
import { QuizSessionStat } from "../../utils/types";

// Collection structure: users/{userId}/quizSessions/{sessionId}

export const saveQuizSession = async (sessionData: Omit<QuizSessionStat, 'id'>) => {
  const { userId } = sessionData;
  if (!userId) throw new Error("User ID is required to save quiz session");

  const sessionsRef = collection(db, "users", userId, "quizSessions");
  const newSessionRef = doc(sessionsRef); // automatically generates ID

  const dataToSave = {
    ...sessionData,
    id: newSessionRef.id,
  };

  await setDoc(newSessionRef, dataToSave);
  return newSessionRef.id;
};

export const getQuizSessions = async (userId: string): Promise<QuizSessionStat[]> => {
  if (!userId) throw new Error("User ID is required to fetch quiz sessions");

  const sessionsRef = collection(db, "users", userId, "quizSessions");
  
  // Fetch sessions ordered by timestamp descending, limit to last 50 for performance
  const q = query(sessionsRef, orderBy("timestamp", "desc"), limit(50));
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data() as QuizSessionStat);
};

export const updateQuizSession = async (userId: string, sessionId: string, data: Partial<QuizSessionStat>) => {
  if (!userId || !sessionId) throw new Error("User ID and Session ID are required to update quiz session");

  const sessionRef = doc(db, "users", userId, "quizSessions", sessionId);
  await updateDoc(sessionRef, data);
};

export const deleteQuizSession = async (userId: string, sessionId: string) => {
  if (!userId || !sessionId) throw new Error("User ID and Session ID are required to delete quiz session");

  const sessionRef = doc(db, "users", userId, "quizSessions", sessionId);
  await deleteDoc(sessionRef);
};
