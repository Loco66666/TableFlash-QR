import { getAveragePreparationMinutes, getDelayedOrdersCount, getWatchOrdersCount, type Order } from "./ordersData";

type PreparationTimeWidgetProps = {
  orders: Order[];
};

export function PreparationTimeWidget({ orders }: PreparationTimeWidgetProps) {
  const delayedOrdersCount = getDelayedOrdersCount(orders);
  const watchOrdersCount = getWatchOrdersCount(orders);
  const averagePreparationMinutes = getAveragePreparationMinutes(orders) || 12;
  const helper = getPreparationHelper(delayedOrdersCount, watchOrdersCount);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">Temps moyen de préparation</h2>
          <p className="mt-4 text-5xl font-black tracking-tight text-slate-950">{averagePreparationMinutes} min</p>
          <p className={`mt-2 text-sm font-black ${delayedOrdersCount > 0 ? "text-rose-700" : watchOrdersCount > 0 ? "text-amber-700" : "text-emerald-700"}`}>{helper}</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" aria-hidden="true">
          <ClockIcon />
        </span>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden="true">
        <span className={delayedOrdersCount > 0 ? "h-2 rounded-full bg-rose-500" : "h-2 rounded-full bg-emerald-500"} />
        <span className={watchOrdersCount > 0 ? "h-2 rounded-full bg-amber-400" : "h-2 rounded-full bg-emerald-400"} />
        <span className="h-2 rounded-full bg-emerald-200" />
        <span className="h-2 rounded-full bg-slate-100" />
      </div>
    </section>
  );
}

function getPreparationHelper(delayedOrdersCount: number, watchOrdersCount: number) {
  if (delayedOrdersCount > 0) {
    return `${delayedOrdersCount} commande${delayedOrdersCount > 1 ? "s" : ""} en retard`;
  }

  if (watchOrdersCount > 0) {
    return "Commandes à surveiller";
  }

  return "Service fluide";
}

function ClockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
