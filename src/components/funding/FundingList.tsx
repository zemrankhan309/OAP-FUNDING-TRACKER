import FundingSection from "./FundingSection";

import type { Allocation } from "../../types/allocation";

interface FundingListProps {
  allocations: Allocation[];

  onEdit: (allocation: Allocation) => void;

  onMakeActive: (id: string) => void;

  onClose: (id: string) => void;

  onArchive: (id: string) => void;
}

export default function FundingList({
  allocations,
  onEdit,
  onMakeActive,
  onClose,
  onArchive,
}: FundingListProps) {
  const active = allocations.filter(
    (allocation) =>
      allocation.status === "active"
  );

  const inactive = allocations.filter(
    (allocation) =>
      allocation.status === "inactive"
  );

  const closed = allocations.filter(
    (allocation) =>
      allocation.status === "closed"
  );

  const archived = allocations.filter(
    (allocation) =>
      allocation.status === "archived"
  );

  return (
    <div className="space-y-10">

      <FundingSection
        title="🟢 Active Funding"
        allocations={active}
        onEdit={onEdit}
        onMakeActive={onMakeActive}
        onClose={onClose}
        onArchive={onArchive}
      />

      <FundingSection
        title="⚪ Inactive Funding"
        allocations={inactive}
        onEdit={onEdit}
        onMakeActive={onMakeActive}
        onClose={onClose}
        onArchive={onArchive}
      />

      <FundingSection
        title="🔵 Closed Funding"
        allocations={closed}
        onEdit={onEdit}
        onMakeActive={onMakeActive}
        onClose={onClose}
        onArchive={onArchive}
      />

      <FundingSection
        title="🗄 Archived Funding"
        allocations={archived}
        onEdit={onEdit}
        onMakeActive={onMakeActive}
        onClose={onClose}
        onArchive={onArchive}
      />

    </div>
  );
}