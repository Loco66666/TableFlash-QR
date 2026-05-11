type PreparationPerformanceCardProps = {
  averageMinutes: number;
  delayedOrders: number;
  watchOrders: number;
  onTimeOrders: number;
};

export function PreparationPerformanceCard({ averageMinutes, delayedOrders, watchOrders, onTimeOrders }: PreparationPerformanceCardProps) {
  const total = Math.max(delayedOrders + watchOrders + onTimeOrders, 1);
  const segments = [
    { label: "Dans les temps", value: onTimeOrders, className: "bg-emerald-500" },
    { label: "À surveiller", value: watchOrders, className: "bg-amber-400" },
    { label: "En retard", value: delayedOrders, className: "bg-rose-500" },
  ];

  return (
    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="text-2xl font-black text-slate-950">Performance préparation</h2>
      <p className="mt-2 text-sm text-slate-500">{delayedOrders > 0 ? "Certaines commandes dépassent le délai estimé." : "Le service est fluide."}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-700">Temps moyen</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{averageMinutes} min</p>
        </div>
        <div className="rounded-3xl bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-700">Commandes en retard</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{delayedOrders}</p>
        </div>
      </div>

      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
        {segments.map((segment) => (
          <span key={segment.label} className={segment.className} style={{ width: `${(segment.value / total) * 100}%` }} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.label} className="rounded-2xl border border-slate-100 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{segment.label}</p>
            <p className="mt-1 text-xl font-black text-slate-950">{segment.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
