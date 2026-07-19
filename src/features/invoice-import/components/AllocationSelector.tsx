interface Allocation {
  id: string;
  name: string;
}

interface Props {
  allocations: Allocation[];
  value: string;
  onChange: (allocationId: string) => void;
}

export default function AllocationSelector({
  allocations,
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-6">
      <label
        htmlFor="allocation"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        Funding Allocation
      </label>

      <select
        id="allocation"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none"
      >
        <option value="">
          Select an allocation...
        </option>

        {allocations.map((allocation) => (
          <option
            key={allocation.id}
            value={allocation.id}
          >
            {allocation.name}
          </option>
        ))}
      </select>

      {!value && (
        <p className="mt-2 text-sm text-amber-600">
          Select the funding allocation these expenses belong to before importing.
        </p>
      )}
    </div>
  );
}