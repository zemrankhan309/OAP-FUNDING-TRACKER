import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Expense } from "../types/expense";

/**
 * Create a new expense
 */
export async function createExpense(
  uid: string,
  expense: Omit<Expense, "id" | "createdAt">
) {
  const ref = collection(
    db,
    "users",
    uid,
    "expenses"
  );

  await addDoc(ref, {
    ...expense,
    createdAt: serverTimestamp(),
  });
}

/**
 * Get all expenses for a user
 */
export async function getExpenses(uid: string) {
  const ref = collection(
    db,
    "users",
    uid,
    "expenses"
  );

  const q = query(
    ref,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Expense[];
}