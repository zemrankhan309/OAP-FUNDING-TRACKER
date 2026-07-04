import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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
 * Get all expenses
 */
export async function getExpenses(
  uid: string
): Promise<Expense[]> {
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

/**
 * Update an expense
 */
export async function updateExpense(
  uid: string,
  expenseId: string,
  expense: Omit<Expense, "id" | "createdAt">
) {
  const ref = doc(
    db,
    "users",
    uid,
    "expenses",
    expenseId
  );

  await updateDoc(ref, {
    ...expense,
  });
}

/**
 * Delete an expense
 */
export async function deleteExpense(
  uid: string,
  expenseId: string
) {
  const ref = doc(
    db,
    "users",
    uid,
    "expenses",
    expenseId
  );

  await deleteDoc(ref);
}