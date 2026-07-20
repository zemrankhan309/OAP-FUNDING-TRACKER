import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../../contexts/AuthContext";

import type { Allocation } from "../../../types/allocation";
import type {
  ImportableTherapySession,
  ParsedInvoice,
} from "../types/invoice";

import { parseInvoice } from "../services/pdfParser";
import { importSessions } from "../services/importSessions";
import { detectDuplicates } from "../services/duplicateDetector";
import { getExpenses } from "../../../services/expenseService";

import AllocationSelector from "./AllocationSelector";
import InvoiceSummary from "./InvoiceSummary";
import SessionTable from "./SessionTable";

interface Props {
  allocations: Allocation[];
}

export default function InvoiceUploader({
  allocations,
}: Props) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const [error, setError] = useState("");

  const [allocationId, setAllocationId] =
    useState("");

  const [invoice, setInvoice] =
    useState<ParsedInvoice | null>(null);

  const [sessions, setSessions] = useState<
    ImportableTherapySession[]
  >([]);

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (authLoading) {
      setError("Authentication is still loading.");
      return;
    }

    if (!user) {
      setError("You must be signed in before importing.");
      return;
    }

    setLoading(true);
    setError("");
    setInvoice(null);
    setSessions([]);

    try {
      const result = await parseInvoice(file);

      if (!result.success || !result.invoice) {
        setError(result.errors.join(", "));
        return;
      }

      const existingExpenses = await getExpenses(user.uid);

      const preparedSessions = detectDuplicates(
        result.invoice.sessions,
        existingExpenses
      );

      const duplicateCount = preparedSessions.filter(
        (session) => session.imported
      ).length;

      if (duplicateCount > 0) {
        toast(
          `${duplicateCount} ${
            duplicateCount === 1 ? "session was" : "sessions were"
          } already imported and will be skipped.`,
          { icon: "ℹ️" }
        );
      }

      setInvoice({
        ...result.invoice,
        sessions: preparedSessions,
      });

      setSessions(preparedSessions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to parse invoice."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (authLoading) {
      setError(
        "Authentication is still loading."
      );
      return;
    }

    if (!user) {
      setError("You must be signed in.");
      return;
    }

    if (!allocationId) {
      setError(
        "Please select a funding allocation."
      );
      return;
    }

    setImporting(true);
    setError("");

    try {
      const result = await importSessions(
        user.uid,
        allocationId,
        sessions
      );

      alert(
        [
          "Import Complete",
          "",
          `Imported: ${result.imported}`,
          `Skipped: ${result.skipped}`,
          `Failed: ${result.failed}`,
        ].join("\n")
      );

      setSessions([...sessions]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Import failed."
      );
    } finally {
      setImporting(false);
    }
  }

  function toggleSession(
    invoiceNumber: string
  ) {
    setSessions((current) =>
      current.map((session) =>
        session.invoiceNumber === invoiceNumber
          ? {
              ...session,
              selected: !session.selected,
            }
          : session
      )
    );
  }

  function selectAll() {
    setSessions((current) =>
      current.map((session) => ({
        ...session,
        selected: !session.imported,
      }))
    );
  }

  function clearAll() {
    setSessions((current) =>
      current.map((session) => ({
        ...session,
        selected: false,
      }))
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Invoice Import
      </h1>

      <AllocationSelector
        allocations={allocations}
        value={allocationId}
        onChange={setAllocationId}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="mb-6"
      />

      {loading && (
        <div className="mt-6">
          Parsing PDF...
        </div>
      )}

      {importing && (
        <div className="mt-4">
          Importing selected sessions...
        </div>
      )}

      {error && (
        <div className="mt-6 text-red-600">
          {error}
        </div>
      )}

      {invoice && (
        <>
          <InvoiceSummary
            invoice={invoice}
            selectedCount={
              sessions.filter(
                (s) => s.selected
              ).length
            }
          />

          <SessionTable
            sessions={sessions}
            importing={importing}
            onToggle={toggleSession}
            onSelectAll={selectAll}
            onClearAll={clearAll}
            onImport={handleImport}
          />
        </>
      )}
    </div>
  );
}
