import Modal from "../common/Modal";
import ExpenseForm from "./ExpenseForm";

import type { Expense } from "../../types/expense";

interface Props {
  isOpen: boolean;

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

export default function ExpenseModal({
  isOpen,
  allocations,
  providerOptions,
  therapistOptions,
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
        providerOptions={providerOptions}
        therapistOptions={therapistOptions}
        onSubmit={onSave}
      />
    </Modal>
  );
}