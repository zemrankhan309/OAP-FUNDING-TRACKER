interface Props {
  allocation: any;

  onMakeActive: (id: string) => void;

  onClose: (id: string) => void;

  onArchive: (id: string) => void;

  onEdit: (allocation: any) => void;
}

export default function AllocationCard({
  allocation,
  onMakeActive,
  onClose,
  onArchive,
  onEdit,
}: Props) {
  function getStatusBadge() {
    switch (allocation.status) {
      case "active":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            🟢 Active
          </span>
        );

      case "closed":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            🔵 Closed
          </span>
        );

      case "archived":
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            🗄 Archived
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            ⚪ Inactive
          </span>
        );
    }
  }

  const amount = Number(allocation.amount ?? 0);
  const spent = Number(allocation.spent ?? 0);
  const remaining = Number(allocation.remaining ?? amount);
  const percentUsed = Number(allocation.percentUsed ?? 0);
  const expenseCount = Number(allocation.expenseCount ?? 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>
          <h3 className="text-xl font-bold">
            {allocation.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {allocation.program}
          </p>
        </div>

        {getStatusBadge()}

      </div>

      {/* Funding */}

      <div className="mt-6">

        <p className="text-sm text-gray-500">
          Funding Amount
        </p>

        <h2 className="mt-1 text-3xl font-bold text-blue-600">
          {amount.toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
          })}
        </h2>

      </div>

      {/* Summary */}

      <div className="mt-6 space-y-3">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Total Spent
          </span>

          <span className="font-semibold text-red-600">
            {spent.toLocaleString("en-CA", {
              style: "currency",
              currency: "CAD",
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Remaining
          </span>

          <span className="font-semibold text-green-600">
            {remaining.toLocaleString("en-CA", {
              style: "currency",
              currency: "CAD",
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Expenses
          </span>

          <span className="font-semibold">
            {expenseCount}
          </span>
        </div>

      </div>

      {/* Progress */}

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-sm">
          <span>Funding Used</span>
          <span>{percentUsed.toFixed(1)}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${Math.min(percentUsed, 100)}%`,
            }}
          />

        </div>

      </div>

      {/* Dates */}

      <div className="mt-6 border-t border-gray-200 pt-4 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Start Date
          </span>

          <span>{allocation.startDate}</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span className="text-gray-500">
            End Date
          </span>

          <span>{allocation.endDate}</span>
        </div>

      </div>

      {/* Actions */}

      <div className="mt-6 border-t border-gray-200 pt-4">

        <div className="grid gap-2">

          {allocation.status !== "active" && (
            <button
              onClick={() => onMakeActive(allocation.id)}
              className="rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
            >
              ⭐ Make Active
            </button>
          )}

          {allocation.status === "active" && (
            <button
              onClick={() => onClose(allocation.id)}
              className="rounded-lg bg-yellow-500 py-2 font-semibold text-white hover:bg-yellow-600"
            >
              🔒 Close Funding
            </button>
          )}

          {allocation.status === "closed" && (
            <button
              onClick={() => onArchive(allocation.id)}
              className="rounded-lg bg-gray-700 py-2 font-semibold text-white hover:bg-gray-800"
            >
              🗄 Archive
            </button>
          )}

          <button
            onClick={() => onEdit(allocation)}
            className="rounded-lg border border-blue-600 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            ✏️ Edit Funding
          </button>

          <button
            className="rounded-lg border py-2 font-semibold text-gray-500 hover:bg-gray-100"
            disabled
          >
            📄 Funding Statement
          </button>

        </div>

      </div>

    </div>
  );
}