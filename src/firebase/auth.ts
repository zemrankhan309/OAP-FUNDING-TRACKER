import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const loginWithEmail = async (
  email: string,
  password: string
) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const registerWithEmail = async (
  email: string,
  password: string
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const logout = async () => {
  return signOut(auth);
};