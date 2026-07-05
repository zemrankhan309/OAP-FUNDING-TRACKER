import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface Allocation {
  childId: string;

  name: string;

  program: string;

  amount: number;

  startDate: string;

  endDate: string;
}

/**
 * Create Funding Allocation
 */
export async function createAllocation(
  uid: string,
  allocation: Allocation
) {
  const allocationRef = collection(
    db,
    "users",
    uid,
    "allocations"
  );

  const snapshot = await getDocs(
    allocationRef
  );

  const hasActiveAllocation =
    snapshot.docs.some(
      (doc) =>
        doc.data().active === true &&
        doc.data().childId ===
          allocation.childId
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
) {
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
    ...doc.data(),
  }));
}

/**
 * Update Allocation
 */
export async function updateAllocation(
  uid: string,
  allocationId: string,
  allocation: Partial<Allocation>
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
 * Only within the SAME child.
 */
export async function setActiveAllocation(
  uid: string,
  allocationId: string
) {
  const snapshot = await getDocs(
    collection(
      db,
      "users",
      uid,
      "allocations"
    )
  );

  const current =
    snapshot.docs.find(
      (d) => d.id === allocationId
    );

  if (!current) return;

  const currentChildId =
    current.data().childId;

  for (const allocation of snapshot.docs) {
    if (
      allocation.data().childId !==
      currentChildId
    )
      continue;

    await updateDoc(allocation.ref, {
      active:
        allocation.id === allocationId,

      status:
        allocation.id === allocationId
          ? "active"
          : "inactive",
    });
  }
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