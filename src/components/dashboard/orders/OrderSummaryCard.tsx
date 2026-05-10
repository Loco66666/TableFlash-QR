import type { SummaryTone } from "./ordersData";

type OrderSummaryCardProps = {
  value: string;
  label: string;
  helper: string;
  tone: SummaryTone;
};

const toneClasses: Record<SummaryTone, string> = {
  emerald: "from-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "from-amber-50 text-amber-700 ring-amber-100",
  sky: "from-sky-50 text-sky-700 ring-sky-100",
  slate: "from-slate-50 text-slate-600 ring-slate-100",
  rose: "from-rose-50 text-rose-700 ring-rose-100",
  green: "from-green-50 text-green-700 ring-green-100",
};

export function OrderSummaryCard({ value, label, helper, tone }: OrderSummaryCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/5">
      <div className={`mb-5 h-1.5 w-16 rounded-full bg-gradient-to-r ${toneClasses[tone]} to-white ring-1`} />
      <p className="text-4xl font-black tracking-tight text-slate-950">{value}</p>
      <h2 className="mt-3 text-sm font-black text-slate-700">{label}</h2>
      <p className="mt-1 text-sm font-semibold text-slate-500">{helper}</p>
    </article>
  );
}
