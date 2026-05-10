export function parseEuroInput(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value
    .trim()
    .replace(/€/g, "")
    .replace(/\s/g, "")
    .replace(/,/g, ".");

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function formatEuro(value: number | string | null | undefined): string {
  const parsedValue = parseEuroInput(value);
  const safeValue = parsedValue ?? 0;

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue).replace(/[\u00A0\u202F]/g, " ");
}
