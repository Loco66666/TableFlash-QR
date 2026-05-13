type PreparationPerformanceCardProps = {
  averageMinutes: number;
  delayedOrders: number;
  watchOrders: number;
  onTimeOrders: number;
};

export function PreparationPerformanceCard({ averageMinutes, delayedOrders, watchOrders, onTimeOrders }: PreparationPerformanceCardProps) {
  const total = Math.max(delayedOrders + watchOrders + onTimeOrders, 1);
  const segments = [
    { label: "Dans les temps", value: onTimeOrders, className: "bg-emerald-500", textClassName: "text-emerald-700" },
    { label: "À surveiller", value: watchOrders, className: "bg-amber-400", textClassName: "text-amber-700" },
    { label: "En retard", value: delayedOrders, className: "bg-rose-500", textClassName: "text-rose-700" },
  ];

  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="break-words text-2xl font-black text-slate-950">Performance préparation</h2>
      <p className="mt-2 break-words text-sm leading-6 text-slate-500">{delayedOrders > 0 ? "Certaines commandes dépassent le délai estimé." : "Le service est fluide et les commandes restent dans les temps."}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-emerald-50 p-5">
          <p className="text-sm font-bold text-emerald-700">Préparation moyenne</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{averageMinutes} min</p>
        </div>
        <div className="rounded-3xl bg-rose-50 p-5">
          <p className="text-sm font-bold leading-5 text-rose-700">Commandes en retard</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{delayedOrders}</p>
        </div>
      </div>

      <div className="mt-7 flex h-3 overflow-hidden rounded-full bg-slate-100">
        {segments.map((segment) => (
          <span key={segment.label} className={segment.className} style={{ width: `${(segment.value / total) * 100}%` }} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex min-h-28 min-w-0 flex-col justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100/80">
            <p className={`break-words text-sm font-bold leading-5 ${segment.textClassName}`}>{segment.label}</p>
            <p className="mt-4 text-2xl font-black tabular-nums text-slate-950">{segment.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
