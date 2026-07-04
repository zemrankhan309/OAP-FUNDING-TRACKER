import type { Child } from "../../types/child";

interface Props {
  child: Child;

  onEdit: (child: Child) => void;

  onArchive: (id: string) => void;

  onRestore: (id: string) => void;

  onDelete: (id: string) => void;
}

export default function ChildCard({
  child,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: Props) {
  const initials = `${child.firstName.charAt(0)}${child.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          {initials}
        </div>

        <div className="flex-1">

          <h2 className="text-xl font-bold">
            {child.firstName} {child.lastName}
          </h2>

          <div className="mt-1">

            {child.status === "active" ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                🟢 Active
              </span>
            ) : (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                🗄 Archived
              </span>
            )}

          </div>

        </div>

      </div>

      {/* Information */}

      <div className="mt-6 space-y-3">

        {child.dob && (
          <div className="flex justify-between">

            <span className="text-gray-500">
              Date of Birth
            </span>

            <span>{child.dob}</span>

          </div>
        )}

        {child.oapNumber && (
          <div className="flex justify-between">

            <span className="text-gray-500">
              OAP Number
            </span>

            <span>{child.oapNumber}</span>

          </div>
        )}

        {child.ohipNumber && (
          <div className="flex justify-between">

            <span className="text-gray-500">
              OHIP Number
            </span>

            <span>{child.ohipNumber}</span>

          </div>
        )}

        {child.diagnosis && (
          <div className="flex justify-between">

            <span className="text-gray-500">
              Diagnosis
            </span>

            <span>{child.diagnosis}</span>

          </div>
        )}

        {child.school && (
          <div className="flex justify-between">

            <span className="text-gray-500">
              School
            </span>

            <span>{child.school}</span>

          </div>
        )}

      </div>

      {/* Notes */}

      {child.notes && (
        <div className="mt-6 rounded-lg bg-gray-50 p-4">

          <h3 className="mb-2 font-semibold">
            Notes
          </h3>

          <p className="text-sm text-gray-700">
            {child.notes}
          </p>

        </div>
      )}

      {/* Actions */}

      <div className="mt-6 border-t border-gray-200 pt-4">

        <div className="grid gap-3">

          <button
            onClick={() => onEdit(child)}
            className="rounded-lg border border-blue-600 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            ✏️ Edit Child
          </button>

          {child.status === "active" ? (
            <button
              onClick={() => onArchive(child.id)}
              className="rounded-lg bg-yellow-500 py-2 font-semibold text-white transition hover:bg-yellow-600"
            >
              📦 Archive Child
            </button>
          ) : (
            <button
              onClick={() => onRestore(child.id)}
              className="rounded-lg bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700"
            >
              ♻️ Restore Child
            </button>
          )}

          <button
            onClick={() => onDelete(child.id)}
            className="rounded-lg bg-red-600 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            🗑 Delete Child
          </button>

        </div>

      </div>

    </div>
  );
}