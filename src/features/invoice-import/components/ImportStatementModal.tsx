import Modal from "../../../components/common/Modal";
import InvoiceUploader from "./InvoiceUploader";

import type { Allocation } from "../../../types/allocation";

interface Props {
  isOpen: boolean;

  allocations: Allocation[];

  onClose: () => void;

  onImportComplete: () => void;
}

export default function ImportStatementModal({
  isOpen,
  allocations,
  onClose,
  onImportComplete,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      title="Import Statement"
      onClose={onClose}
      width="xl"
    >
      <InvoiceUploader
        allocations={allocations}
        onImportComplete={onImportComplete}
      />
    </Modal>
  );
}