interface SummaryCardProps {
  title: string;
  value: string;
  color?: string;
}

export default function SummaryCard({
  title,
  value,
  color = "text-blue-600",
}: SummaryCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className={`mt-3 text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}