import type { SummaryItem } from "./menuData";

type MenuSummaryCardProps = SummaryItem;

const toneClasses: Record<SummaryItem["tone"], string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
};

export function MenuSummaryCard({ value, label, helper, tone }: MenuSummaryCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{value}</p>
        </div>

        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${toneClasses[tone]}`} aria-hidden="true">
          <SummaryIcon tone={tone} />
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-500">{helper}</p>
    </article>
  );
}

function SummaryIcon({ tone }: { tone: SummaryItem["tone"] }) {
  if (tone === "emerald") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h10" />
      </svg>
    );
  }

  if (tone === "sky") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 5h14v14H5z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    );
  }

  if (tone === "rose") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.3 4.3 3.6 16a2 2 0 0 0 1.7 3h13.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M12 3v3" />
      <path d="M8 21h8" />
      <path d="M10 17h4" />
      <path d="M7 13h10" />
    </svg>
  );
}
