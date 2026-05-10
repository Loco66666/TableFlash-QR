type TableSummaryCardProps = {
  helper: string;
  label: string;
  value: string;
};

export function TableSummaryCard({ helper, label, value }: TableSummaryCardProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-emerald-950/5">
      <p className="text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <h3 className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-slate-600">{label}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{helper}</p>
    </article>
  );
}
