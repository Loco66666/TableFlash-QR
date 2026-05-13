import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTimingBadge } from "./OrderTimingBadge";
import { getOrderTimingStatus, type Order, type OrderAction } from "./ordersData";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const actionClasses: Record<"default" | "danger" | "neutral", string> = {
  default: "rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100",
  danger: "rounded-2xl border border-rose-200 bg-white px-3 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100",
  neutral: "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100",
};

type SelectedOrderPanelProps = {
  actions: OrderAction[];
  order: Order | null;
  onAction: (orderNumber: string, action: OrderAction) => void;
  onClose: () => void;
};

export function SelectedOrderPanel({ actions, order, onAction, onClose }: SelectedOrderPanelProps) {
  if (!order) {
    return <EmptySelectedOrderPanel />;
  }

  const timingStatus = getOrderTimingStatus(order);
  const showDetailedTiming = timingStatus !== "Terminée";
  const actionGridClasses = actions.length === 2
    ? "mt-2 grid grid-cols-2 gap-2"
    : "mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2";

  return (
    <aside className="flex flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/70 lg:sticky lg:top-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-hidden">
      <div className="shrink-0 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Détail commande</p>
              {order.source === "public-menu" ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-100">QR client</span> : null}
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{order.orderNumber}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <button
              aria-label="Fermer le détail de la commande"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl font-black leading-none text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-3xl bg-slate-50 p-3 text-sm">
          <DetailMeta label="Table" value={order.table} />
          <DetailMeta label="Heure" value={order.time} />
        </div>

        <div className="mt-3 rounded-3xl border border-orange-100 bg-orange-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-700">Paiement</p>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
          <p className="mt-2 text-sm font-bold leading-5 text-orange-950">Paiement à la caisse ou auprès du serveur</p>
        </div>

        <div className="mt-3 rounded-3xl border border-emerald-100 bg-emerald-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">État de la commande</p>
            <OrderTimingBadge status={timingStatus} />
          </div>
          {showDetailedTiming ? (
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm font-bold text-emerald-950 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <TimingMeta label="Temps estimé" value={`${order.estimatedPrepMinutes} min`} />
              <TimingMeta label="Temps écoulé" value={`${order.mockElapsedMinutes} min`} />
              <TimingMeta label="Statut" value={timingStatus} />
            </div>
          ) : (
            <p className="mt-2 text-sm font-bold leading-5 text-emerald-950">Commande terminée.</p>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 lg:pr-3">
        <div>
          <h3 className="text-base font-black text-slate-950">Articles</h3>
          <div className="mt-2 space-y-2">
            {order.items.map((item) => (
              <div className="rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-sm shadow-slate-100" key={`${order.orderNumber}-${item.name}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 flex-1 font-black leading-5 text-slate-900">{item.quantity} × {item.name}</p>
                  <p className="shrink-0 font-black text-slate-950">{item.price ?? "—"}</p>
                </div>
                {item.note ? <p className="mt-1 text-xs font-semibold leading-5 text-amber-700">Note : {item.note}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2 rounded-3xl bg-slate-50 p-3 text-sm font-bold">
          <PriceRow label="Sous-total" value={order.total} />
          <PriceRow label="Service / options" value="Inclus" />
          <div className="border-t border-slate-200 pt-2">
            <PriceRow label="Total" value={order.total} strong />
          </div>
        </div>

        <div className="mt-3 rounded-3xl border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">Note client</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-amber-900">{order.note ? `“${order.note}”` : "Aucune note client pour cette commande."}</p>
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:sticky lg:bottom-0">
        <h3 className="text-sm font-black text-slate-950">Actions</h3>
        {actions.length > 0 ? (
          <div className={actionGridClasses}>
            {actions.map((action) => (
              <button
                className={action === "Refuser" ? actionClasses.danger : action === "Voir détail" ? actionClasses.neutral : actionClasses.default}
                key={action}
                onClick={() => onAction(order.orderNumber, action)}
                type="button"
              >
                {action}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500">
            Commande terminée.
          </p>
        )}
      </div>
    </aside>
  );
}

function EmptySelectedOrderPanel() {
  return (
    <aside className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-5 text-center shadow-sm shadow-slate-200/70">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Détail commande</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Aucune commande sélectionnée</h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
        Sélectionnez une commande dans la file pour afficher son détail et ses actions.
      </p>
      <p className="mt-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-500">
        Les commandes terminées restent disponibles dans le filtre Terminées, sans encombrer la file active.
      </p>
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

function TimingMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-emerald-100">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-emerald-700">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
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
