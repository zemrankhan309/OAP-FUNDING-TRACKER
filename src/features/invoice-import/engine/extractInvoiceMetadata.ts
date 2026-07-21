export interface InvoiceMetadata {
  invoiceNumber: string;
  invoiceDate: string;
  provider: string;
}

export function extractInvoiceMetadata(
  text: string
): InvoiceMetadata {
  return {
    invoiceNumber: extractInvoiceNumber(text),
    invoiceDate: extractInvoiceDate(text),
    provider: extractProvider(text),
  };
}

function extractInvoiceNumber(text: string): string {
  const patterns = [
    /Invoice Number[:\s]*([A-Za-z0-9-]+)/i,
    /Invoice #[:\s]*([A-Za-z0-9-]+)/i,
    /Invoice No\.?[:\s]*([A-Za-z0-9-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return match[1];
    }
  }

  return "UNKNOWN";
}

function extractInvoiceDate(text: string): string {
  const patterns = [
    /Invoice Date[:\s]*([^\n]+)/i,
    /Date[:\s]*([^\n]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return match[1].trim();
    }
  }

  return "";
}

function extractProvider(text: string): string {
  const providers = [
    "Talk Talk",
    "My Place Academy",
    "Monarch House",
    "KidsAbility",
  ];

  const lower = text.toLowerCase();

  const found = providers.find(provider =>
    lower.includes(provider.toLowerCase())
  );

  return found ?? "";
}