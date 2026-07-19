import Modal from "../../../components/common/Modal";
import InvoiceUploader from "./InvoiceUploader";

interface Props {
  isOpen: boolean;

  allocations: {
    id: string;
    name: string;
  }[];

  onClose: () => void;
}

export default function ImportStatementModal({
  isOpen,
  allocations,
  onClose,
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
      />
    </Modal>
  );
}