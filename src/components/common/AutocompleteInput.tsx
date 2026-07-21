interface AutocompleteInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function AutocompleteInput({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  className,
}: AutocompleteInputProps) {
  return (
    <div className={className}>
      <label className="mb-2 flex items-center gap-2 font-medium">
        {label}
      </label>

      <input
        id={id}
        list={`${id}-options`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />

      <datalist id={`${id}-options`}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
}
