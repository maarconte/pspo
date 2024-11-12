import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useMutation, useQuery } from "react-query";

import { Firebase } from "../../firebase.js";

const db = getFirestore(Firebase);

export function useFetchFirebase(collectionName: string) {
  const queryKey = ["collection", collectionName];

  const {
    isLoading,
    error,
    data: fetchedDocs = [],
    refetch,
  } = useQuery(
    queryKey,
    async () => {
      const collectionDocs = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionDocs);
      const fetchedData: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
          isFlagged: doc.data().isFlagged ?? false,
          comments: doc.data().comments ?? [],
        });
      });
      return fetchedData;
    },
    {
      // Optional configuration options like refetch interval, staleTime etc.
    }
  );

  return {
    isLoading,
    data: fetchedDocs,
    errorMessage: (error as any)?.message ?? "",
    refetch,
  };
}

interface UseUpdateDocProps {
  collectionName: string;
  docId: string;
}

export function useUpdateDoc({ docId, collectionName }: UseUpdateDocProps) {
  const { data, isLoading, error } = useQuery(["doc", docId], async () => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  });

  const updateMutation = useMutation((newData: any) => {
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, { ...newData, updatedAt: serverTimestamp() });
  });

  const handleUpdate = (newData: any) => {
    updateMutation.mutate(newData);
  };

  return { data, isLoading, error, handleUpdate };
}

export function useAddDoc(collectionName: string) {
  const addMutation = useMutation(async (newData: DocumentData) => {
    const collectionRef = collection(db, collectionName);
    return await addDoc(collectionRef, {
      ...newData,
      createdAt: serverTimestamp(),
    });
  });

  const handleAdd = (newData: DocumentData) => {
    addMutation.mutate(newData);
  };

  return { addMutation, handleAdd };
}

export function useDeleteDoc(collectionName: string) {
  const deleteMutation = useMutation(async (docId: string) => {
    return await deleteDoc(doc(db, collectionName, docId));
  });

  const handleDelete = (docId: string) => {
    deleteMutation.mutate(docId);
  };

  return { deleteMutation, handleDelete };
}

export function formatTimestamp(timestamp: any, locales: Intl.LocalesArgument) {
  const date = new Date(timestamp?.seconds * 1000).toLocaleDateString(locales);
  return date.toLocaleString();
}
