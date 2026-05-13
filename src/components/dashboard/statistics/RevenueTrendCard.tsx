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
  const peak = points.reduce((bestPoint, point) => (point.orders > bestPoint.orders ? point : bestPoint), points[0]);

  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-black uppercase tracking-[0.08em] text-emerald-700">Évolution du service</p>
          <h2 className="mt-2 break-words text-2xl font-black text-slate-950">Évolution du service</h2>
          <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-500">Repérez les pics de commande et les créneaux les plus chargés.</p>
        </div>
        <div className="max-w-full break-words rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">Pic d’activité : {peak.hour} — {peak.orders} commandes</div>
      </div>

      <div className="mt-8 grid min-w-0 max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => {
          const height = Math.max(28, Math.round((point.orders / maxOrders) * 160));
          const isPeak = point.hour === peak.hour;

          return (
            <div key={point.hour} className="flex min-w-0 flex-col items-center justify-end gap-4">
              <div className="flex h-40 w-full items-end justify-center rounded-3xl bg-slate-50 px-3 py-4 sm:h-44">
                <div
                  className={`w-full max-w-16 rounded-2xl ${isPeak ? "bg-emerald-700 shadow-lg shadow-emerald-900/20" : "bg-emerald-200"}`}
                  style={{ height }}
                  aria-label={`${point.orders} commandes à ${point.hour}`}
                />
              </div>
              <div className="w-full rounded-2xl bg-white/80 px-3 py-3 text-center shadow-sm shadow-slate-100/80 ring-1 ring-slate-100">
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
