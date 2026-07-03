import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export async function createUserProfile(user: any) {
  const userRef = doc(db, "users", user.uid);

  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) return;

  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? "",
    createdAt: serverTimestamp(),
    activeFundingYear: null,
  });
}