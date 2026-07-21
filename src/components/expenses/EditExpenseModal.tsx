import Modal from "../common/Modal";

import ExpenseForm from "./ExpenseForm";

import type { Expense } from "../../types/expense";

interface Props {
  isOpen: boolean;

  expense: Expense | null;

  allocations: {
    id: string;
    name: string;
  }[];

  providerOptions: string[];
  therapistOptions: string[];

  onSave: (
    expense: Omit<Expense, "id" | "createdAt">
  ) => Promise<void>;

  onClose: () => void;
}

export default function EditExpenseModal({
  isOpen,
  expense,
  allocations,
  providerOptions,
  therapistOptions,
  onSave,
  onClose,
}: Props) {
  if (!expense) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Expense"
      onClose={onClose}
      width="lg"
    >
      <ExpenseForm
        allocations={allocations}
        providerOptions={providerOptions}
        therapistOptions={therapistOptions}
        editingExpense={expense}
        onSubmit={onSave}
        onCancelEdit={onClose}
      />
    </Modal>
  );
}