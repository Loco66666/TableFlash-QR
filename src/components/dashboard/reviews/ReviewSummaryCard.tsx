type ReviewSummaryCardProps = {
  helper: string;
  label: string;
  value: string;
  tone: "emerald" | "amber" | "sky" | "rose";
};

const toneClasses: Record<ReviewSummaryCardProps["tone"], string> = {
  emerald: "from-emerald-500 to-teal-500 shadow-emerald-950/10",
  amber: "from-amber-400 to-orange-500 shadow-amber-950/10",
  sky: "from-sky-500 to-cyan-500 shadow-sky-950/10",
  rose: "from-rose-500 to-red-500 shadow-rose-950/10",
};

export function ReviewSummaryCard({ helper, label, tone, value }: ReviewSummaryCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`h-1.5 bg-gradient-to-r ${toneClasses[tone]}`} />
      <div className="p-5">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">{helper}</p>
      </div>
    </article>
  );
}
