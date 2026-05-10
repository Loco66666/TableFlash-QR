import type { OrderStatus } from "./ordersData";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusClasses: Record<OrderStatus, string> = {
  Nouvelle: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Acceptée: "border-sky-200 bg-sky-50 text-sky-700",
  Payée: "border-green-200 bg-green-50 text-green-700",
  "En préparation": "border-amber-200 bg-amber-50 text-amber-700",
  Prête: "border-indigo-200 bg-indigo-50 text-indigo-700",
  Servie: "border-slate-200 bg-slate-50 text-slate-600",
  Refusée: "border-rose-200 bg-rose-50 text-rose-700",
  Annulée: "border-zinc-200 bg-zinc-50 text-zinc-600",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
