type PeakHour = {
  hour: string;
  orders: number;
};

export function PeakHoursChart({ hours }: { hours: PeakHour[] }) {
  const maxOrders = Math.max(...hours.map((hour) => hour.orders), 1);

  return (
    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="text-2xl font-black text-slate-950">Heures de pointe</h2>
      <div className="mt-6 space-y-4">
        {hours.map((hour) => (
          <div key={hour.hour} className="grid grid-cols-[3rem_1fr_4rem] items-center gap-3">
            <span className="text-sm font-black text-slate-700">{hour.hour}</span>
            <span className="h-4 overflow-hidden rounded-full bg-slate-100">
              <span className="block h-full rounded-full bg-emerald-600" style={{ width: `${(hour.orders / maxOrders) * 100}%` }} />
            </span>
            <span className="text-right text-sm font-black text-slate-950">{hour.orders}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
