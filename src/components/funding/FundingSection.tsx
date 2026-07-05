import AllocationCard from "./AllocationCard";

import type { Allocation } from "../../types/allocation";

interface FundingSectionProps {
  title: string;

  allocations: Allocation[];

  onEdit: (allocation: Allocation) => void;

  onMakeActive: (id: string) => void;

  onClose: (id: string) => void;

  onArchive: (id: string) => void;
}

export default function FundingSection({
  title,
  allocations,
  onEdit,
  onMakeActive,
  onClose,
  onArchive,
}: FundingSectionProps) {
  if (allocations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">

      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {allocations.map((allocation) => (
          <AllocationCard
            key={allocation.id}
            allocation={allocation}
            onEdit={onEdit}
            onMakeActive={onMakeActive}
            onClose={onClose}
            onArchive={onArchive}
          />
        ))}

      </div>

    </section>
  );
}