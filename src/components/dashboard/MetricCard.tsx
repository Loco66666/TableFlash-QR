type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone?: "emerald" | "amber" | "blue" | "rose";
};

const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  blue: "bg-sky-50 text-sky-700 ring-sky-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function MetricCard({ label, value, helper, icon, tone = "emerald" }: MetricCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${toneClasses[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{helper}</p>
    </article>
  );
}
