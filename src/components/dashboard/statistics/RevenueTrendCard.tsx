type TrendPoint = {
  hour: string;
  orders: number;
  revenue: number;
};

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export function RevenueTrendCard({ points }: { points: TrendPoint[] }) {
  const maxOrders = Math.max(...points.map((point) => point.orders), 1);
  const peak = points.reduce<TrendPoint | null>((bestPoint, point) => {
    if (!bestPoint || point.orders > bestPoint.orders) {
      return point;
    }

    return bestPoint;
  }, null);

  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm shadow-slate-200/60">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-black uppercase tracking-[0.08em] text-emerald-700">ACTIVITÉ PAR CRÉNEAU</p>
          <h2 className="mt-2 break-words text-2xl font-black text-slate-950">Commandes par heure</h2>
          <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-500">Repérez les pics de commandes et les créneaux les plus chargés.</p>
        </div>
        {peak ? (
          <div className="max-w-full break-words rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">Pic d’activité : {peak.hour} — {peak.orders} commandes</div>
        ) : null}
      </div>

      <div className="mt-5 grid min-w-0 max-w-full grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {points.map((point) => {
          const height = Math.max(18, Math.round((point.orders / maxOrders) * 78));
          const isPeak = point.hour === peak?.hour;

          return (
            <div key={point.hour} className="flex min-w-0 flex-col items-center justify-end gap-2">
              <div className="flex h-24 w-full items-end justify-center rounded-3xl bg-slate-50 px-3 py-3">
                <div
                  className={`w-full max-w-12 rounded-2xl ${isPeak ? "bg-emerald-700 shadow-lg shadow-emerald-900/20" : "bg-emerald-200"}`}
                  style={{ height }}
                  aria-label={`${point.orders} commandes à ${point.hour}`}
                />
              </div>
              <div className="w-full rounded-2xl bg-white/80 px-2.5 py-2 text-center shadow-sm shadow-slate-100/80 ring-1 ring-slate-100">
                <p className="text-sm font-black text-slate-950">{point.hour}</p>
                <p className="mt-1 text-sm font-bold leading-5 text-slate-500">{point.orders} commandes</p>
                <p className="mt-1 text-sm font-black tabular-nums text-emerald-700">{formatEuro(point.revenue)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
