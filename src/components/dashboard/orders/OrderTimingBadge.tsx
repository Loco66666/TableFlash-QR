import type { TimingStatusLabel } from "./ordersData";

const timingClasses: Record<TimingStatusLabel, string> = {
  "En attente": "border-slate-200 bg-slate-50 text-slate-600",
  "Dans les temps": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "À surveiller": "border-amber-200 bg-amber-50 text-amber-700",
  "En retard": "border-rose-200 bg-rose-50 text-rose-700",
  "Prête à servir": "border-sky-200 bg-sky-50 text-sky-700",
  "Commande clôturée": "border-slate-200 bg-slate-100 text-slate-600",
};

type OrderTimingBadgeProps = {
  status: TimingStatusLabel;
};

export function OrderTimingBadge({ status }: OrderTimingBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${timingClasses[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
