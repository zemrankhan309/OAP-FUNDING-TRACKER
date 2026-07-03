import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Allocation } from "../types/allocation";

/**
 * Create a new funding allocation.
 * The first allocation created becomes active automatically.
 */
export async function createAllocation(
  uid: string,
  allocation: Omit<
    Allocation,
    | "id"
    | "active"
    | "status"
    | "spent"
    | "remaining"
    | "expenseCount"
    | "percentUsed"
  >
) {
  const allocationRef = collection(
    db,
    "users",
    uid,
    "allocations"
  );

  const snapshot = await getDocs(allocationRef);

  const hasActiveAllocation = snapshot.docs.some(
    (doc) => doc.data().active === true
  );

  await addDoc(allocationRef, {
    ...allocation,

    active: !hasActiveAllocation,

    status: hasActiveAllocation
      ? "inactive"
      : "active",

    createdAt: serverTimestamp(),
  });
}

/**
 * Get all funding allocations.
 */
export async function getAllocations(
  uid: string
): Promise<Allocation[]> {
  const allocationRef = collection(
    db,
    "users",
    uid,
    "allocations"
  );

  const q = query(
    allocationRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,

    ...(doc.data() as Omit<
      Allocation,
      "id"
    >),
  }));
}

/**
 * Update an allocation.
 */
export async function updateAllocation(
  uid: string,
  allocationId: string,
  allocation: {
    name: string;
    program: string;
    amount: number;
    startDate: string;
    endDate: string;
  }
) {
  await updateDoc(
    doc(
      db,
      "users",
      uid,
      "allocations",
      allocationId
    ),
    allocation
  );
}

/**
 * Activate one funding allocation.
 * Automatically deactivates all others.
 */
export async function setActiveAllocation(
  uid: string,
  allocationId: string
) {
  const snapshot = await getDocs(
    collection(db, "users", uid, "allocations")
  );

  for (const allocation of snapshot.docs) {
    await updateDoc(allocation.ref, {
      active: allocation.id === allocationId,

      status:
        allocation.id === allocationId
          ? "active"
          : "inactive",
    });
  }
}

/**
 * Close funding.
 */
export async function closeAllocation(
  uid: string,
  allocationId: string
) {
  await updateDoc(
    doc(
      db,
      "users",
      uid,
      "allocations",
      allocationId
    ),
    {
      active: false,
      status: "closed",
    }
  );
}

/**
 * Archive funding.
 */
export async function archiveAllocation(
  uid: string,
  allocationId: string
) {
  await updateDoc(
    doc(
      db,
      "users",
      uid,
      "allocations",
      allocationId
    ),
    {
      active: false,
      status: "archived",
    }
  );
}

/**
 * Permanently delete funding.
 */
export async function deleteAllocation(
  uid: string,
  allocationId: string
) {
  await deleteDoc(
    doc(
      db,
      "users",
      uid,
      "allocations",
      allocationId
    )
  );
}