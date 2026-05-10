type PublicAllergenBadgeProps = {
  label: string;
};

export function PublicAllergenBadge({ label }: PublicAllergenBadgeProps) {
  const isPositiveLabel = label === "Vegan" || label === "Sans";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isPositiveLabel
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {label}
    </span>
  );
}
