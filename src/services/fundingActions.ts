import type { Allocation } from "../types/allocation";
import type { AllocationInput } from "./allocationService";

import {
  createAllocation,
  updateAllocation,
  archiveAllocation,
  closeAllocation,
  setActiveAllocation,
} from "./allocationService";

import { getFundingSummary } from "./fundingManagementService";

/**
 * Load all funding allocations
 * for the selected child.
 */
export async function loadFunding(
  uid: string,
  childId: string
): Promise<Allocation[]> {
  return getFundingSummary(uid, childId);
}

/**
 * Create Funding Allocation
 */
export async function createFunding(
  uid: string,
  childId: string,
  allocation: Omit<AllocationInput, "childId">
) {
  await createAllocation(uid, {
    childId,
    ...allocation,
  });
}

/**
 * Update Funding Allocation
 */
export async function editFunding(
  uid: string,
  allocationId: string,
  allocation: Partial<AllocationInput>
) {
  await updateAllocation(
    uid,
    allocationId,
    allocation
  );
}

/**
 * Make Allocation Active
 */
export async function activateFunding(
  uid: string,
  allocationId: string
) {
  await setActiveAllocation(uid, allocationId);
}

/**
 * Close Funding
 */
export async function closeFunding(
  uid: string,
  allocationId: string
) {
  await closeAllocation(uid, allocationId);
}

/**
 * Archive Funding
 */
export async function archiveFunding(
  uid: string,
  allocationId: string
) {
  await archiveAllocation(uid, allocationId);
}