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
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Firebase } from "../../firebase.js";

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
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
          isFlagged: doc.data().isFlagged ?? false,
          comments: doc.data().comments ?? [],
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

  const { mutateAsync } = updateMutation;
  const handleUpdate = React.useCallback(async (newData: any) => {
    return await mutateAsync(newData);
  }, [mutateAsync]);

  return {
    data,
    isLoading,
    error,
    handleUpdate,
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
      });
    },
    onSuccess: () => {
      // Invalidate the collection query on success
      queryClient.invalidateQueries({ queryKey: collectionQueryKey });
    },
  });

  const { mutateAsync } = addMutation;
  const handleAdd = React.useCallback(async (newData: DocumentData) => {
    return await mutateAsync(newData);
  }, [mutateAsync]);

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

  const { mutateAsync } = deleteMutation;
  const handleDelete = React.useCallback(async (docId: string) => {
    return await mutateAsync(docId);
  }, [mutateAsync]);

  return { deleteMutation, handleDelete, isLoading: deleteMutation.isPending };
}

export function formatTimestamp(timestamp: any, locales: Intl.LocalesArgument) {
  if (!timestamp?.seconds) return "";
  const date = new Date(timestamp?.seconds * 1000).toLocaleDateString(locales);
  return date.toLocaleString();
}
