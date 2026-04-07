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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Firebase } from "../../firebase.js";
import { DEFAULT_QUESTION_DATE } from "../constants";

const db = getFirestore(Firebase);

export function useFetchFirebase<T = any>(collectionName: string) {
  const queryKey = ["collection", collectionName];

  const {
    isLoading,
    error,
    data: fetchedDocs = [],
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const collectionDocs = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionDocs);
      const fetchedData: T[] = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const isQuestion = collectionName === "questions";

        fetchedData.push({
          id: doc.id,
          ...docData,
          isFlagged: docData.isFlagged ?? false,
          comments: docData.comments ?? [],
          createdAt: isQuestion ? (docData.createdAt ?? DEFAULT_QUESTION_DATE) : docData.createdAt,
          updatedAt: isQuestion ? (docData.updatedAt ?? DEFAULT_QUESTION_DATE) : docData.updatedAt,
        } as unknown as T);
      });
      return fetchedData;
    },
    refetchOnWindowFocus: false,
  });

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
  const queryClient = useQueryClient();
  const docQueryKey = ["doc", docId];
  const collectionQueryKey = ["collection", collectionName];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: docQueryKey,
    queryFn: async () => {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    },
    enabled: !!docId, // Only run query if docId is available
  });

  const updateMutation = useMutation({
    mutationFn: (newData: any) => {
      const docRef = doc(db, collectionName, docId);
      return updateDoc(docRef, { ...newData, updatedAt: serverTimestamp() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docQueryKey });
      queryClient.invalidateQueries({ queryKey: collectionQueryKey });
    },
  });

  const handleUpdate = async (newData: any) => {
    return await updateMutation.mutateAsync(newData);
  };

  return {
    data,
    isLoading,
    error: error || updateMutation.error,
    handleUpdate,
    isUpdating: updateMutation.isPending,
    isUpdateError: updateMutation.isError,
    mutationStatus: updateMutation.status,
  };
}

export function useAddDoc(collectionName: string) {
  const queryClient = useQueryClient();
  const collectionQueryKey = ["collection", collectionName];

  const addMutation = useMutation({
    mutationFn: async (newData: DocumentData) => {
      const collectionRef = collection(db, collectionName);
      return await addDoc(collectionRef, {
        ...newData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      // Invalidate the collection query on success
      queryClient.invalidateQueries({ queryKey: collectionQueryKey });
    },
  });

  const handleAdd = async (newData: DocumentData) => {
    return await addMutation.mutateAsync(newData);
  };

  return {
    addMutation,
    handleAdd,
    isLoading: addMutation.isPending,
    isError: addMutation.isError,
    isSuccess: addMutation.isSuccess,
  };
}

export function useDeleteDoc(collectionName: string) {
  const queryClient = useQueryClient();
  const collectionQueryKey = ["collection", collectionName];
  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      return await deleteDoc(doc(db, collectionName, docId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKey });
    },
  });

  const handleDelete = async (docId: string) => {
    return await deleteMutation.mutateAsync(docId);
  };

  return { deleteMutation, handleDelete, isLoading: deleteMutation.isPending };
}

export function formatTimestamp(timestamp: any, locales: Intl.LocalesArgument) {
  if (!timestamp?.seconds) return "";
  const date = new Date(timestamp?.seconds * 1000).toLocaleDateString(locales);
  return date.toLocaleString();
}
