import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import FundingForm, {
  type FundingFormData,
} from "../components/funding/FundingForm";

import AllocationCard from "../components/funding/AllocationCard";

import { useAuth } from "../contexts/AuthContext";

import type { Allocation } from "../types/allocation";

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

  const [loading, setLoading] = useState(true);

  const [allocations, setAllocations] = useState<
    Allocation[]
  >([]);

  const [editingAllocation, setEditingAllocation] =
    useState<Allocation | null>(null);

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

        alert("Funding allocation created.");
      }

      setEditingAllocation(null);

      await loadAllocations();
    } catch (error) {
      console.error(error);

      alert("Unable to save funding.");
    }
  }

  function handleEdit(
    allocation: Allocation
  ) {
    setEditingAllocation(allocation);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingAllocation(null);
  }

  async function handleMakeActive(id: string) {
    if (!user) return;

    try {
      await setActiveAllocation(user.uid, id);

      await loadAllocations();
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
    } catch (error) {
      console.error(error);

      alert("Unable to archive funding.");
    }
  }

  // Organize allocations by status
  const active = allocations.filter(
    (a) => a.status === "active"
  );

  const inactive = allocations.filter(
    (a) => a.status === "inactive"
  );

  const closed = allocations.filter(
    (a) => a.status === "closed"
  );

  const archived = allocations.filter(
    (a) => a.status === "archived"
  );

  function renderSection(
    title: string,
    items: Allocation[]
  ) {
    if (items.length === 0) return null;

    return (
      <section className="space-y-4">

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {items.map((allocation) => (
            <AllocationCard
              key={allocation.id}
              allocation={allocation}
              onEdit={handleEdit}
              onMakeActive={handleMakeActive}
              onClose={handleClose}
              onArchive={handleArchive}
            />
          ))}

        </div>

      </section>
    );
  }

  return (
    <DashboardLayout>

      <div className="space-y-10">

        <div>

          <h1 className="text-4xl font-bold">
            Funding Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your OAP funding allocations.
          </p>

        </div>

        <FundingForm
          onSubmit={handleSubmit}
          editingAllocation={editingAllocation}
          onCancelEdit={cancelEdit}
        />

        {loading ? (

          <div className="rounded-xl bg-white p-10 shadow">
            Loading...
          </div>

        ) : (

          <>
            {renderSection(
              "🟢 Active Funding",
              active
            )}

            {renderSection(
              "⚪ Inactive Funding",
              inactive
            )}

            {renderSection(
              "🔵 Closed Funding",
              closed
            )}

            {renderSection(
              "🗄 Archived Funding",
              archived
            )}
          </>

        )}

      </div>

    </DashboardLayout>
  );
}