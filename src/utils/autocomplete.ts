export function uniqueSortedAutocompleteOptions(
  values: string[]
): string[] {
  const unique = new Map<string, string>();

  for (const value of values) {
    const trimmed = value.trim();

    if (!trimmed) {
      continue;
    }

    const key = trimmed.toLowerCase();

    if (!unique.has(key)) {
      unique.set(key, trimmed);
    }
  }

  return Array.from(unique.values()).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}
