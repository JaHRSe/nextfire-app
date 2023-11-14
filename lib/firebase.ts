//import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB8iNCg2j0mYi8q5jzKlwlFLZKwphk0xa0",
  authDomain: "nextfire-fc7f2.firebaseapp.com",
  projectId: "nextfire-fc7f2",
  storageBucket: "nextfire-fc7f2.appspot.com",
  messagingSenderId: "44575019545",
  appId: "1:44575019545:web:fe6980b1dab682b8e3d088",
  measurementId: "G-DVVEK6HH53",
};

const app = initializeApp({ ...firebaseConfig });

export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export async function getUserWithUsername(username: string) {
  const colRef = collection(firestore, "users");
  const usernameQuery = query(
    colRef,
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(usernameQuery)).docs[0];
  return userDoc;
}

export async function getUserUid(username: string) {
  const docRef = doc(firestore, "usernames", username);
  const userDoc = await getDoc(docRef);
  return userDoc.data().uid;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}

export const fromMillis = Timestamp.fromMillis;
