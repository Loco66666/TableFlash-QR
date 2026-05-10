import type { PaymentStatus } from "./ordersData";

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
};

const paymentClasses: Record<PaymentStatus, string> = {
  "À payer": "border-orange-200 bg-orange-50 text-orange-700",
  Payée: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Annulée: "border-slate-200 bg-slate-50 text-slate-500",
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${paymentClasses[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
