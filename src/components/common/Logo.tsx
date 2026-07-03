export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white">
        O
      </div>

      <div>
        <h1 className="text-lg font-bold text-gray-800">
          OAP Funding Tracker
        </h1>

        <p className="text-xs text-gray-500">
          Manage your funding with confidence
        </p>
      </div>
    </div>
  );
}