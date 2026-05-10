export function deriveTableName(tableId: string): string {
  const decodedTableId = decodeURIComponent(tableId).trim();

  if (!decodedTableId) {
    return "Votre table";
  }

  const normalizedTableId = decodedTableId.replace(/[-_]+/g, " ");

  if (/^table\s+\d+$/i.test(normalizedTableId)) {
    return normalizedTableId.replace(/^table/i, "Table");
  }

  if (/^terrasse\s+\d+$/i.test(normalizedTableId)) {
    return normalizedTableId.replace(/^terrasse/i, "Terrasse");
  }

  if (/^comptoir$/i.test(normalizedTableId)) {
    return "Comptoir";
  }

  return normalizedTableId
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toLocaleUpperCase("fr-FR")}${part.slice(1)}`)
    .join(" ");
}
