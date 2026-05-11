type ActiveTableRow = {
  name: string;
  scans: number;
  orders: number;
  conversion: number;
};

export function ActiveTablesTable({ rows }: { rows: ActiveTableRow[] }) {
  return (
    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="text-2xl font-black text-slate-950">Tables et emplacements actifs</h2>
      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.name} className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
            <p className="font-black text-slate-950">{row.name}</p>
            <p className="text-sm font-bold text-slate-600">{row.scans} scans</p>
            <p className="text-sm font-bold text-slate-600">{row.orders} {row.orders > 1 ? "commandes" : "commande"}</p>
            <p className="text-sm font-black text-emerald-700">{row.conversion.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % conversion</p>
          </div>
        ))}
      </div>
    </article>
  );
}
