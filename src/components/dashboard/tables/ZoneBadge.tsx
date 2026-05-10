type ZoneBadgeProps = {
  zone: string;
};

const zoneStyles: Record<string, string> = {
  Salle: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Terrasse: "bg-amber-50 text-amber-700 ring-amber-200",
  Comptoir: "bg-sky-50 text-sky-700 ring-sky-200",
};

export function ZoneBadge({ zone }: ZoneBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ring-1 ${zoneStyles[zone] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}>
      {zone}
    </span>
  );
}
