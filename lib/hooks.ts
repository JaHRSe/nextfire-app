import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  limit,
} from "firebase/firestore";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  let unsubscribe: () => void;
  useEffect(() => {
    if (user) {
      const colRef = collection(firestore, "users");
      const ref = doc(colRef, user.uid);
      unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }
    return unsubscribe;
  }, [user]);
  return { user, username };
}

export async function getUserWithUsername(username: string) {
  const colRef = collection(firestore, "users");
  const usernameQuery = query(
    colRef,
    where("username", "==", username),
    limit(1)
  );
}
