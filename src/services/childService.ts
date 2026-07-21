import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  where,
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
  const ref = collection(db, "users", uid, "children");

  await addDoc(ref, {
    ...child,
    status: "active",
    createdAt: serverTimestamp(),
  });
}

/**
 * Get All Children
 */
export async function getChildren(uid: string): Promise<Child[]> {
  const ref = collection(db, "users", uid, "children");

  const q = query(ref, orderBy("createdAt", "desc"));

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
  const ref = doc(db, "users", uid, "children", childId);

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
  const ref = doc(db, "users", uid, "children", childId);

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
  const ref = doc(db, "users", uid, "children", childId);

  await updateDoc(ref, {
    status: "active",
  });
}

/**
 * Delete Child
 *
 * Cascade deletes:
 * - Expenses
 * - Funding Allocations
 * - Child
 */
export async function deleteChild(
  uid: string,
  childId: string
) {
  const batch = writeBatch(db);

  //
  // Delete allocations first so we can remove any expenses tied to them
  //
  const allocationsRef = collection(
    db,
    "users",
    uid,
    "allocations"
  );

  const allocationsSnapshot = await getDocs(
    query(allocationsRef, where("childId", "==", childId))
  );

  const allocationIds = allocationsSnapshot.docs.map(
    (allocation) => allocation.id
  );

  allocationsSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  if (allocationIds.length > 0) {
    const expensesRef = collection(
      db,
      "users",
      uid,
      "expenses"
    );

    const chunks = [] as string[][];
    for (let i = 0; i < allocationIds.length; i += 10) {
      chunks.push(allocationIds.slice(i, i + 10));
    }

    for (const chunk of chunks) {
      const expenseSnapshot = await getDocs(
        query(expensesRef, where("allocationId", "in", chunk))
      );

      expenseSnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
    }
  }

  //
  // Delete child
  //
  const childRef = doc(
    db,
    "users",
    uid,
    "children",
    childId
  );

  batch.delete(childRef);

  //
  // Commit everything atomically
  //
  await batch.commit();
}