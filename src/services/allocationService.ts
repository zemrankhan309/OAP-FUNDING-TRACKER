import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Allocation } from "../types/allocation";

/**
 * Data required when creating a new allocation.
 */
export type AllocationInput = Pick<
  Allocation,
  | "childId"
  | "name"
  | "program"
  | "amount"
  | "startDate"
  | "endDate"
>;

/**
 * Create Funding Allocation
 */
export async function createAllocation(
  uid: string,
  allocation: AllocationInput
) {
  const allocationRef = collection(
    db,
    "users",
    uid,
    "allocations"
  );

  const snapshot = await getDocs(allocationRef);

  const hasActiveAllocation =
    snapshot.docs.some(
      (doc) =>
        doc.data().active === true &&
        doc.data().childId === allocation.childId
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
 * Get All Funding Allocations
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
    ...(doc.data() as Omit<Allocation, "id">),
  }));
}

/**
 * Update Allocation
 */
export async function updateAllocation(
  uid: string,
  allocationId: string,
  allocation: Partial<AllocationInput>
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
 * Set Active Allocation
 *
 * Uses a Firestore transaction to ensure that only one allocation
 * can be active for a child, even if multiple clients update
 * at the same time.
 */
export async function setActiveAllocation(
  uid: string,
  allocationId: string
) {
  const allocationRef = collection(
    db,
    "users",
    uid,
    "allocations"
  );

  const allocQuery = query(allocationRef);
  const snapshot = await getDocs(allocQuery);

  const targetAlloc = snapshot.docs.find(
    (d) => d.id === allocationId
  );

  if (!targetAlloc) {
    throw new Error("Allocation not found.");
  }

  const childId = targetAlloc.data().childId;

  await runTransaction(db, async (transaction) => {
    for (const allocation of snapshot.docs) {
      if (allocation.data().childId !== childId) {
        continue;
      }

      transaction.update(allocation.ref, {
        active:
          allocation.id === allocationId,
        status:
          allocation.id === allocationId
            ? "active"
            : "inactive",
      });
    }
  });
}

/**
 * Close Allocation
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
 * Archive Allocation
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