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

type PromotionType = "percentage" | "fixed" | "Pourcentage" | "Montant fixe";

function isPercentagePromotion(promoType: PromotionType) {
  return promoType === "percentage" || promoType === "Pourcentage";
}

function parseFlexibleNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value
    .trim()
    .replace(/[%€]/g, "")
    .replace(/\s/g, "")
    .replace(/,/g, ".");

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function parsePromotionValue(value: number | string | null | undefined, promoType: PromotionType): number | null {
  const parsedValue = parseFlexibleNumber(value);

  if (parsedValue === null) {
    return null;
  }

  return isPercentagePromotion(promoType) ? -Math.abs(parsedValue) : Math.abs(parsedValue);
}

export function formatPromotionValue(value: number | string | null | undefined, promoType: PromotionType): string {
  const parsedValue = parsePromotionValue(value, promoType);

  if (parsedValue === null) {
    return "";
  }

  if (!isPercentagePromotion(promoType)) {
    return formatEuro(parsedValue);
  }

  const formattedValue = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(parsedValue).replace(/[\u00A0\u202F]/g, " ");

  return `${formattedValue} %`;
}
