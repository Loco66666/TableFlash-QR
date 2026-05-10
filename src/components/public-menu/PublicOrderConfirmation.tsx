import { formatEuro } from "@/lib/formatters";
import type { ConfirmedOrder } from "./types";

type PublicOrderConfirmationProps = {
  order: ConfirmedOrder | null;
  paymentNote: string;
  onBackToMenu: () => void;
  onNewOrder: () => void;
};

export function PublicOrderConfirmation({ order, paymentNote, onBackToMenu, onNewOrder }: PublicOrderConfirmationProps) {
  if (!order) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-emerald-950/60 px-3 pb-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
    >
      <div className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-[2.25rem] bg-white p-5 shadow-2xl md:rounded-[2.25rem]">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-emerald-50 to-white p-5 text-center ring-1 ring-emerald-100">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-700 text-3xl font-black text-white shadow-xl shadow-emerald-700/25">
            ✓
          </div>
          <h2 id="order-confirmation-title" className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950">
            Commande confirmée
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Votre commande a bien été transmise au restaurant.
          </p>
          <p className="mt-2 text-sm font-bold text-emerald-800">
            Un membre de l’équipe va la prendre en charge.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Numéro</p>
            <p className="mt-2 text-xl font-black text-slate-950">{order.orderNumber}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Table</p>
            <p className="mt-2 text-xl font-black text-slate-950">{order.tableName}</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-black text-slate-950">Total</p>
            <p className="text-xl font-black text-emerald-800">{formatEuro(order.total)}</p>
          </div>
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.note ?? ""}`} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-extrabold text-slate-900">
                    {item.quantity} × {item.name}
                  </p>
                  {item.note ? <p className="mt-1 text-slate-500">Note : {item.note}</p> : null}
                </div>
                <p className="font-black text-slate-700">{formatEuro(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <p className="font-black">Paiement au restaurant</p>
          <p className="mt-1">{paymentNote}</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" onClick={onBackToMenu} className="min-h-12 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-700">
            Retour au menu
          </button>
          <button type="button" onClick={onNewOrder} className="min-h-12 rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20">
            Nouvelle commande
          </button>
        </div>
      </div>
    </div>
  );
}
