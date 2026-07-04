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

import type { Child } from "../types/child";

/**
 * Create Child
 */
export async function createChild(
  uid: string,
  child: Omit<Child, "id" | "createdAt" | "status">
) {
  const ref = collection(
    db,
    "users",
    uid,
    "children"
  );

  await addDoc(ref, {
    ...child,

    status: "active",

    createdAt: serverTimestamp(),
  });
}

/**
 * Get All Children
 */
export async function getChildren(
  uid: string
): Promise<Child[]> {
  const ref = collection(
    db,
    "users",
    uid,
    "children"
  );

  const q = query(
    ref,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Child[];
}

/**
 * Update Child
 */
export async function updateChild(
  uid: string,
  childId: string,
  child: Partial<Child>
) {
  const ref = doc(
    db,
    "users",
    uid,
    "children",
    childId
  );

  await updateDoc(ref, {
    ...child,
  });
}

/**
 * Archive Child
 */
export async function archiveChild(
  uid: string,
  childId: string
) {
  const ref = doc(
    db,
    "users",
    uid,
    "children",
    childId
  );

  await updateDoc(ref, {
    status: "archived",
  });
}

/**
 * Restore Archived Child
 */
export async function restoreChild(
  uid: string,
  childId: string
) {
  const ref = doc(
    db,
    "users",
    uid,
    "children",
    childId
  );

  await updateDoc(ref, {
    status: "active",
  });
}

/**
 * Delete Child
 *
 * NOTE:
 * Later we'll prevent deletion if
 * the child has funding allocations.
 */
export async function deleteChild(
  uid: string,
  childId: string
) {
  const ref = doc(
    db,
    "users",
    uid,
    "children",
    childId
  );

  await deleteDoc(ref);
}