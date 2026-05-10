import type { Order } from "./ordersData";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

type OrderCardProps = {
  order: Order;
  selected?: boolean;
};

export function OrderCard({ order, selected = false }: OrderCardProps) {
  return (
    <article className={`rounded-[2rem] border bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/5 ${selected ? "border-emerald-300 ring-4 ring-emerald-100" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Commande</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{order.orderNumber}</h2>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4 text-sm">
        <Meta label="Emplacement" value={order.table} />
        <Meta label="Heure" value={order.time} alignRight />
      </div>

      <ul className="mt-5 space-y-2">
        {order.items.map((item) => (
          <li className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700" key={`${order.orderNumber}-${item.name}`}>
            <span>{item.quantity} × {item.name}</span>
          </li>
        ))}
      </ul>

      {order.note ? (
        <p className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Note client : {order.note}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
        <span className="text-sm font-black text-slate-500">Total</span>
        <span className="text-xl font-black text-slate-950">{order.total}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {order.actions.map((action) => (
          <button
            className={action === "Refuser"
              ? "rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-50"
              : "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"}
            key={`${order.orderNumber}-${action}`}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}

function Meta({ label, value, alignRight = false }: { label: string; value: string; alignRight?: boolean }) {
  return (
    <div className={alignRight ? "text-right" : undefined}>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}
