import { calculateConfidence } from "./confidence";
import { tokenizeLines } from "./tokenizeLines";

import type { InvoiceMetadata } from "./extractInvoiceMetadata";
import type { ImportableTherapySession, TherapyCategory } from "../types/invoice";

export function buildSessions(
  text: string,
  metadata: InvoiceMetadata
): ImportableTherapySession[] {
  const tokens = tokenizeLines(text);

  console.group("===== TOKEN STREAM =====");

  console.table(
    tokens.map(token => ({
      type: token.type,
      text: token.text,
      date: token.date,
      amount: token.amount,
      duration: token.duration,
      category: token.category,
    }))
  );

  console.groupEnd();

  const sessions: ImportableTherapySession[] = [];

  let sessionIndex = 0;

  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type !== "date") {
      i++;
      continue;
    }

    const serviceDate = token.date!;

    let description = "";
    let category: TherapyCategory = "Other";
    let amount: number | null = null;

    const raw: string[] = [token.text];

    let j = i + 1;

    while (j < tokens.length) {
      const next = tokens[j];

      if (next.type === "date") {
        break;
      }

      raw.push(next.text);

      switch (next.type) {
        case "description":
          if (!description) {
            description = next.text;
            category = next.category;
          }
          break;

        case "amount":
          if (amount === null) {
            amount = next.amount;
          }
          break;
      }

      j++;
    }

    console.group("===== SESSION =====");
    console.log(raw.join("\n"));
    console.log({
      serviceDate,
      description,
      amount,
    });
    console.groupEnd();

    if (amount !== null) {
      sessionIndex++;

      const confidence = calculateConfidence(raw.join(" "));

      sessions.push({
        id: `${metadata.invoiceNumber}-${sessionIndex}`,

        invoiceNumber: metadata.invoiceNumber,

        invoiceDate: metadata.invoiceDate,

        serviceDate,

        provider: metadata.provider,

        therapist: "",

        service: description,

        category,

        amount,

        selected: confidence.score >= 70,

        confidence: confidence.score,

        rawText: raw.join("\n"),
      });
    }

    i = j;
  }

  console.log("===== FINAL SESSIONS =====");
  console.table(sessions);

  return sessions;
}