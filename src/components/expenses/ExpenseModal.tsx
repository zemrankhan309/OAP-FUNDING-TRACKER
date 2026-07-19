import Modal from "../common/Modal";
import ExpenseForm from "./ExpenseForm";

import type { Expense } from "../../types/expense";

interface Props {
  isOpen: boolean;

  allocations: {
    id: string;
    name: string;
  }[];

  onSave: (
    expense: Omit<Expense, "id" | "createdAt">
  ) => Promise<void>;

  onClose: () => void;
}

export default function ExpenseModal({
  isOpen,
  allocations,
  onSave,
  onClose,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      title="Add Expense"
      onClose={onClose}
      width="lg"
    >
      <ExpenseForm
        allocations={allocations}
        onSubmit={onSave}
      />
    </Modal>
  );
}