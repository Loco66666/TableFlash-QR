type TableSummaryCardProps = {
  helper: string;
  label: string;
  value: string;
};

export function TableSummaryCard({ helper, label, value }: TableSummaryCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-emerald-950/[0.03]">
      <p className="text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <h3 className="mt-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-600">{label}</h3>
      <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-500">{helper}</p>
    </article>
  );
}
