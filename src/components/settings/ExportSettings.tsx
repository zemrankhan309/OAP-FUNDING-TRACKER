export default function ExportSettings() {
  return (
    <div className="rounded-xl bg-white p-8 shadow">

      <h2 className="mb-8 text-3xl font-bold">
        Export & Backup
      </h2>

      <div className="space-y-4">

        <button className="w-full rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700">
          Export Financial Statement (PDF)
        </button>

        <button className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
          Export Expenses (CSV)
        </button>

        <button className="w-full rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
          Backup All Data (JSON)
        </button>

      </div>

    </div>
  );
}