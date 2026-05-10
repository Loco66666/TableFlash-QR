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


export type PromotionFormatterType = "percentage" | "fixed";

function parsePercentageInput(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? -Math.abs(value) : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value
    .trim()
    .replace(/[%€]/g, "")
    .replace(/\s/g, "")
    .replace(/,/g, ".")
    .replace(/[^0-9.-]/g, "");

  if (!normalizedValue || normalizedValue === "-" || normalizedValue === "." || normalizedValue === "-.") {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? -Math.abs(parsedValue) : null;
}

export function parsePromotionValue(value: number | string | null | undefined, promoType: PromotionFormatterType): number | null {
  if (promoType === "fixed") {
    const parsedValue = parseEuroInput(typeof value === "string" ? value.replace(/%/g, "") : value);

    return parsedValue === null ? null : Math.abs(parsedValue);
  }

  return parsePercentageInput(value);
}

export function formatPromotionValue(value: number | string | null | undefined, promoType: PromotionFormatterType): string {
  const parsedValue = parsePromotionValue(value, promoType);

  if (parsedValue === null) {
    return "";
  }

  if (promoType === "fixed") {
    return formatEuro(parsedValue);
  }

  const percentageValue = Math.abs(parsedValue);
  const formattedPercentage = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(percentageValue).replace(/[  ]/g, " ");

  return `-${formattedPercentage} %`;
}
