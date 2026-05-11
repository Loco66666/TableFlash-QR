type StatisticsSummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  tone?: "emerald" | "amber" | "sky" | "rose" | "slate";
};

const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  slate: "bg-slate-50 text-slate-700 ring-slate-100",
};

export function StatisticsSummaryCard({ label, value, helper, tone = "emerald" }: StatisticsSummaryCardProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <span className={`h-3 w-3 rounded-full ring-4 ${toneClasses[tone]}`} />
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-semibold text-slate-500">{helper}</p>
    </article>
  );
}
