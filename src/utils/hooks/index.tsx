import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Firebase } from "../../firebase.js";

// create a useFetchFirebase hook
export function useFetchFirebase(collectionName: string) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const db = getFirestore(Firebase);
  const collectionDocs = collection(db, collectionName);
  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collectionDocs);
        const fetchedDocs: any = [];
        querySnapshot.forEach((doc) => {
          fetchedDocs.push(doc.data());
        });
        setData(fetchedDocs);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setErrorMessage("An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [collectionName]);
  return { isLoading, data, errorMessage };
}
