import type { ImportableTherapySession } from "../types/invoice";

interface Props {
  sessions: ImportableTherapySession[];
  importing: boolean;

  onToggle: (invoiceNumber: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onImport: () => void;
}

export default function SessionTable({
  sessions,
  importing,
  onToggle,
  onSelectAll,
  onClearAll,
  onImport,
}: Props) {
  const selectedCount = sessions.filter(
    (session) => session.selected
  ).length;

  return (
    <>
      <div className="mb-4 mt-6 flex flex-wrap gap-3">
        <button
          onClick={onSelectAll}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Select All
        </button>

        <button
          onClick={onClearAll}
          className="rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
        >
          Clear
        </button>

        <button
          onClick={onImport}
          disabled={importing || selectedCount === 0}
          className="rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Import Selected ({selectedCount})
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Import</th>
              <th className="border p-2">Invoice</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Provider</th>
              <th className="border p-2">Therapist</th>
              <th className="border p-2">Service</th>
              <th className="border p-2">Category</th>
              <th className="border p-2 text-right">Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.invoiceNumber}
                className={session.imported ? "bg-green-50" : ""}
              >
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={session.selected}
                    disabled={session.imported}
                    onChange={() =>
                      onToggle(session.invoiceNumber)
                    }
                  />
                </td>

                <td className="border p-2">
                  {session.invoiceNumber}
                </td>

                <td className="border p-2">
                  {session.serviceDate}
                </td>

                <td className="border p-2">
                  {session.provider}
                </td>

                <td className="border p-2">
                  {session.therapist}
                </td>

                <td className="border p-2">
                  {session.service}
                </td>

                <td className="border p-2">
                  {session.category}
                </td>

                <td className="border p-2 text-right">
                  ${session.amount.toFixed(2)}
                </td>

                <td className="border p-2 text-center">
                  {session.imported ? (
                    <span className="font-semibold text-green-600">
                      Imported
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}