import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useSelectedChild } from "../contexts/SelectedChildContext";

import type { Allocation } from "../types/allocation";
import type { FundingFormData } from "../components/funding/FundingForm";

import {
  loadFunding,
  createFunding,
  editFunding,
  activateFunding,
  closeFunding,
  archiveFunding,
} from "../services/fundingActions";

export function useFunding() {
  const { user } = useAuth();
  const { selectedChild } = useSelectedChild();

  const [loading, setLoading] = useState(true);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [editingAllocation, setEditingAllocation] =
    useState<Allocation | null>(null);

  /**
   * Load funding for selected child
   */
  const refresh = useCallback(async () => {
    if (!user || !selectedChild) {
      console.log("No selected child.");
      setAllocations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      console.log("================================");
      console.log("Selected Child");
      console.log(selectedChild);

      console.log("Selected Child ID");
      console.log(selectedChild.id);

      const data = await loadFunding(
        user.uid,
        selectedChild.id
      );

      console.log("Funding Returned");
      console.table(data);

      setAllocations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedChild]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Save Funding
   */
  async function saveFunding(data: FundingFormData) {
    if (!user || !selectedChild) return;

    try {
      if (editingAllocation) {
        await editFunding(
          user.uid,
          editingAllocation.id,
          {
            ...data,
            amount: Number(data.amount),
          }
        );

        alert("Funding updated successfully.");
      } else {
        await createFunding(
          user.uid,
          selectedChild.id,
          {
            ...data,
            amount: Number(data.amount),
          }
        );

        alert("Funding allocation created.");
      }

      setEditingAllocation(null);

      await refresh();
    } catch (error) {
      console.error(error);
      alert("Unable to save funding.");
    }
  }

  /**
   * Activate Funding
   */
  async function makeActive(id: string) {
    if (!user) return;

    await activateFunding(user.uid, id);

    await refresh();
  }

  /**
   * Close Funding
   */
  async function close(id: string) {
    if (!user) return;

    await closeFunding(user.uid, id);

    await refresh();
  }

  /**
   * Archive Funding
   */
  async function archive(id: string) {
    if (!user) return;

    await archiveFunding(user.uid, id);

    await refresh();
  }

  /**
   * Edit Funding
   */
  function edit(allocation: Allocation) {
    setEditingAllocation(allocation);
  }

  /**
   * Cancel Edit
   */
  function cancelEdit() {
    setEditingAllocation(null);
  }

  return {
    loading,
    allocations,
    editingAllocation,

    saveFunding,

    makeActive,
    close,
    archive,

    edit,
    cancelEdit,

    refresh,
  };
}