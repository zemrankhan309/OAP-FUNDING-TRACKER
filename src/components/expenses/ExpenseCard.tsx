import type { Expense } from "../../types/expense";

interface Props {
  expense: Expense;
}

export default function ExpenseCard({
  expense,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          {expense.category}
        </h3>

        <div className="font-bold text-red-600">
          {Number(expense.amount).toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
          })}
        </div>

      </div>

      <p className="mt-2 text-gray-600">
        {expense.provider}
      </p>

      <p className="text-sm text-gray-500">
        {expense.description}
      </p>

      <div className="mt-4 text-sm text-gray-400">
        {expense.date}
      </div>

    </div>
  );
}