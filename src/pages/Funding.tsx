import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import FundingForm, {
  type FundingFormData,
} from "../components/funding/FundingForm";

import AllocationCard from "../components/funding/AllocationCard";

import { useAuth } from "../contexts/AuthContext";

import {
  createAllocation,
  updateAllocation,
  setActiveAllocation,
  closeAllocation,
  archiveAllocation,
} from "../services/allocationService";

import { getFundingSummary } from "../services/fundingManagementService";

export default function Funding() {
  const { user } = useAuth();

  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingAllocation, setEditingAllocation] =
    useState<any>(null);

  async function loadAllocations() {
    if (!user) return;

    setLoading(true);

    try {
      const data = await getFundingSummary(user.uid);
      setAllocations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllocations();
  }, [user]);

  async function handleSubmit(
    data: FundingFormData
  ) {
    if (!user) return;

    try {
      if (editingAllocation) {
        await updateAllocation(
          user.uid,
          editingAllocation.id,
          {
            ...data,
            amount: Number(data.amount),
          }
        );

        alert("Funding updated successfully.");
      } else {
        await createAllocation(user.uid, {
          ...data,
          amount: Number(data.amount),
        });

        alert("Funding allocation created successfully.");
      }

      setEditingAllocation(null);

      await loadAllocations();
    } catch (error) {
      console.error(error);
      alert("Unable to save funding allocation.");
    }
  }

  async function handleMakeActive(id: string) {
    if (!user) return;

    try {
      await setActiveAllocation(user.uid, id);

      await loadAllocations();

      alert("Funding allocation is now active.");
    } catch (error) {
      console.error(error);
      alert("Unable to activate funding.");
    }
  }

  async function handleClose(id: string) {
    if (!user) return;

    if (
      !window.confirm(
        "Close this funding allocation?"
      )
    )
      return;

    try {
      await closeAllocation(user.uid, id);

      await loadAllocations();

      alert("Funding closed.");
    } catch (error) {
      console.error(error);
      alert("Unable to close funding.");
    }
  }

  async function handleArchive(id: string) {
    if (!user) return;

    if (
      !window.confirm(
        "Archive this funding allocation?"
      )
    )
      return;

    try {
      await archiveAllocation(user.uid, id);

      await loadAllocations();

      alert("Funding archived.");
    } catch (error) {
      console.error(error);
      alert("Unable to archive funding.");
    }
  }

  function handleEdit(allocation: any) {
    setEditingAllocation(allocation);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingAllocation(null);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Funding Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all of your OAP funding allocations.
          </p>
        </div>

        <FundingForm
          onSubmit={handleSubmit}
          editingAllocation={editingAllocation}
          onCancelEdit={cancelEdit}
        />

        <section>

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-semibold">
              Your Funding Allocations
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {allocations.length} Allocation
              {allocations.length !== 1
                ? "s"
                : ""}
            </span>

          </div>

          {loading ? (
            <div className="rounded-xl bg-white p-10 text-center shadow">
              Loading funding allocations...
            </div>
          ) : allocations.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow">

              <h3 className="text-xl font-semibold">
                No Funding Allocations
              </h3>

              <p className="mt-2 text-gray-500">
                Create your first funding allocation
                to get started.
              </p>

            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {allocations.map((allocation) => (
                <AllocationCard
                  key={allocation.id}
                  allocation={allocation}
                  onMakeActive={
                    handleMakeActive
                  }
                  onClose={handleClose}
                  onArchive={handleArchive}
                  onEdit={handleEdit}
                />
              ))}

            </div>
          )}

        </section>

      </div>
    </DashboardLayout>
  );
}