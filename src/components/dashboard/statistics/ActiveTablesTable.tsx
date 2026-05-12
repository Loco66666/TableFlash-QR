type ActiveTableRow = {
  name: string;
  scans: number;
  orders: number;
  conversion: number;
};

const activeTablesGridClass = "xl:grid-cols-[minmax(0,1fr)_5rem_7rem_6.5rem]";

export function formatLocationLabelForStats(name: string) {
  const normalizedName = name.trim().replace(/\s+/g, " ");
  const tableMatch = normalizedName.match(/^Table (\d+)$/i);

  if (tableMatch) {
    return `T${tableMatch[1]}`;
  }

  return normalizedName;
}

export function ActiveTablesTable({ rows }: { rows: ActiveTableRow[] }) {
  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="min-w-0 max-w-full break-words">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">Activité par emplacement</p>
        <h2 className="text-2xl font-black leading-tight text-slate-950">Tables et emplacements actifs</h2>
      </div>

      <div className={`mt-5 hidden gap-5 px-4 text-xs font-black uppercase tracking-[0.08em] text-slate-400 xl:grid ${activeTablesGridClass}`}>
        <span>Emplacement</span>
        <span className="text-right">Scans</span>
        <span className="text-right">Commandes</span>
        <span className="text-right">Conversion</span>
      </div>

      <div className="mt-3 min-w-0 max-w-full space-y-3">
        {rows.map((row) => (
          <div key={row.name} className="min-w-0 max-w-full rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm hover:shadow-slate-200/70">
            <div className={`grid min-w-0 max-w-full gap-4 xl:gap-5 xl:items-center ${activeTablesGridClass}`}>
              <p className="min-w-0 break-words text-base font-black leading-tight text-slate-950">{formatLocationLabelForStats(row.name)}</p>

              <div className="flex items-center justify-between gap-4 border-t border-slate-200/70 pt-3 xl:block xl:border-0 xl:pt-0 xl:text-right">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 xl:hidden">Scans</span>
                <span className="whitespace-nowrap text-sm font-bold tabular-nums text-slate-700">{row.scans} scans</span>
              </div>

              <div className="flex items-center justify-between gap-4 xl:block xl:text-right">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 xl:hidden">Commandes</span>
                <span className="whitespace-nowrap text-sm font-bold tabular-nums text-slate-700">{row.orders} {row.orders > 1 ? "commandes" : "commande"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 xl:block xl:text-right">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 xl:hidden">Conversion</span>
                <span className="whitespace-nowrap text-sm font-black tabular-nums text-emerald-700">{row.conversion.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
