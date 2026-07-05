import DashboardLayout from "../layouts/DashboardLayout";

import FundingForm from "../components/funding/FundingForm";
import FundingList from "../components/funding/FundingList";

import { useFunding } from "../hooks/useFunding";

export default function Funding() {
  const {
    loading,
    allocations,

    editingAllocation,

    saveFunding,

    makeActive,

    close,

    archive,

    edit,

    cancelEdit,
  } = useFunding();

  return (
    <DashboardLayout>
      <div className="space-y-10">

        <div>
          <h1 className="text-4xl font-bold">
            Funding Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage funding allocations for the selected child.
          </p>
        </div>

        <FundingForm
          onSubmit={saveFunding}
          editingAllocation={editingAllocation}
          onCancelEdit={cancelEdit}
        />

        {loading ? (
          <div className="rounded-xl bg-white p-10 shadow">
            Loading funding...
          </div>
        ) : (
          <FundingList
            allocations={allocations}
            onEdit={edit}
            onMakeActive={makeActive}
            onClose={close}
            onArchive={archive}
          />
        )}

      </div>
    </DashboardLayout>
  );
}