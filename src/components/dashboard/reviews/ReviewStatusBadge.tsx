import type { Review } from "./reviewsData";

type ReviewStatusBadgeProps = {
  label: Review["status"] | Review["sentiment"] | Review["source"];
  tone?: "status" | "sentiment" | "source";
};

const badgeClassByLabel: Record<string, string> = {
  Nouveau: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "À traiter": "border-amber-200 bg-amber-50 text-amber-800",
  Répondu: "border-sky-200 bg-sky-50 text-sky-700",
  Archivé: "border-slate-200 bg-slate-100 text-slate-600",
  Positif: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Neutre: "border-slate-200 bg-white text-slate-600",
  Négatif: "border-rose-200 bg-rose-50 text-rose-700",
  TableFlash: "border-emerald-200 bg-white text-emerald-700",
  Google: "border-blue-200 bg-blue-50 text-blue-700",
};

export function ReviewStatusBadge({ label }: ReviewStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${badgeClassByLabel[label]}`}>
      {label}
    </span>
  );
}
