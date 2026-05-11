type ActiveTableRow = {
  name: string;
  scans: number;
  orders: number;
  conversion: number;
};

export function ActiveTablesTable({ rows }: { rows: ActiveTableRow[] }) {
  return (
    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Activité par emplacement</p>
        <h2 className="text-2xl font-black text-slate-950">Tables et emplacements actifs</h2>
      </div>

      <div className="mt-5 hidden grid-cols-[minmax(0,1.5fr)_5.5rem_7.5rem_7rem] gap-4 px-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400 sm:grid">
        <span>Table / emplacement</span>
        <span className="text-right">Scans</span>
        <span className="text-right">Commandes</span>
        <span className="text-right">Conversion</span>
      </div>

      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.name} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm hover:shadow-slate-200/70">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1.5fr)_5.5rem_7.5rem_7rem] sm:items-center">
              <p className="min-w-0 font-black leading-6 text-slate-950">{row.name}</p>

              <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400 sm:hidden">Scans</span>
                <span className="text-sm font-bold tabular-nums text-slate-700">{row.scans}</span>
              </div>

              <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400 sm:hidden">Commandes</span>
                <span className="text-sm font-bold tabular-nums text-slate-700">{row.orders} {row.orders > 1 ? "commandes" : "commande"}</span>
              </div>

              <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400 sm:hidden">Conversion</span>
                <span className="text-sm font-black tabular-nums text-emerald-700">{row.conversion.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
