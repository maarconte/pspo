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
import { isError, useMutation, useQuery, useQueryClient } from "react-query";

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
      refetchOnWindowFocus: false,
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
  const queryClient = useQueryClient();
  const docQueryKey = ["doc", docId];
  const collectionQueryKey = ["collection", collectionName];

  const { data, isLoading, error, refetch } = useQuery(
    docQueryKey,
    async () => {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    },
    {
      enabled: !!docId, // Only run query if docId is available
    }
  );

  const updateMutation = useMutation(
    (newData: any) => {
      const docRef = doc(db, collectionName, docId);
      return updateDoc(docRef, { ...newData, updatedAt: serverTimestamp() });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(docQueryKey);
        queryClient.invalidateQueries(collectionQueryKey);
      },
    }
  );

  const handleUpdate = (newData: any) => {
    updateMutation.mutate(newData);
  };

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

  const addMutation = useMutation(
    async (newData: DocumentData) => {
      const collectionRef = collection(db, collectionName);
      return await addDoc(collectionRef, {
        ...newData,
        createdAt: serverTimestamp(),
      });
    },
    {
      onSuccess: () => {
        // Invalidate the collection query on success
        queryClient.invalidateQueries(collectionQueryKey);
      },
      // Optional: Add onError for error handling
    }
  );

  const handleAdd = (newData: DocumentData) => {
    addMutation.mutate(newData);
  };

  return {
    addMutation,
    handleAdd,
    isLoading: addMutation.isLoading,
    isError: isError(addMutation.error),
    isSuccess: addMutation.isSuccess,
  };
}

export function useDeleteDoc(collectionName: string) {
  const queryClient = useQueryClient();
  const collectionQueryKey = ["collection", collectionName];
  const deleteMutation = useMutation(
    async (docId: string) => {
      return await deleteDoc(doc(db, collectionName, docId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(collectionQueryKey);
      },
    }
  );

  const handleDelete = (docId: string) => {
    deleteMutation.mutate(docId);
  };

  return { deleteMutation, handleDelete, isLoading: deleteMutation.isLoading };
}

export function formatTimestamp(timestamp: any, locales: Intl.LocalesArgument) {
  if (!timestamp?.seconds) return "";
  const date = new Date(timestamp?.seconds * 1000).toLocaleDateString(locales);
  return date.toLocaleString();
}
