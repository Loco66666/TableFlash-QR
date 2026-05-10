import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { quickActions, selectedOrderItems } from "./ordersData";

export function SelectedOrderPanel() {
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 xl:sticky xl:top-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Détail commande</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">#1257</h2>
        </div>
        <OrderStatusBadge status="Nouvelle" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4 text-sm">
        <DetailMeta label="Table" value="Table 12" />
        <DetailMeta label="Heure" value="12:42" />
      </div>

      <div className="mt-5 rounded-3xl border border-orange-100 bg-orange-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-700">Paiement</p>
        <p className="mt-2 text-sm font-bold leading-6 text-orange-950">Paiement à la caisse ou auprès du serveur</p>
        <div className="mt-3">
          <PaymentStatusBadge status="À payer" />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-black text-slate-950">Articles commandés</h3>
        <div className="mt-3 space-y-3">
          {selectedOrderItems.map((item) => (
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100" key={item.name}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-black text-slate-900">{item.name}</p>
                <p className="font-black text-slate-950">{item.price}</p>
              </div>
              {item.note ? <p className="mt-2 text-sm font-semibold text-amber-700">Note : {item.note}</p> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-4 text-sm font-bold">
        <PriceRow label="Sous-total" value="26,00 €" />
        <PriceRow label="Service / options" value="5,50 €" />
        <div className="border-t border-slate-200 pt-3">
          <PriceRow label="Total" value="31,50 €" strong />
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">Note client</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-amber-900">“Sans oignons, merci.”</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-black text-slate-950">Actions rapides</h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {quickActions.map((action) => (
            <button
              className={action === "Refuser"
                ? "rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50"
                : "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"}
              key={action}
              type="button"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? "text-base font-black text-slate-950" : "text-slate-500"}>{label}</span>
      <span className={strong ? "text-xl font-black text-slate-950" : "text-slate-900"}>{value}</span>
    </div>
  );
}
