import type { SummaryItem } from "./menuData";

type MenuSummaryCardProps = SummaryItem & {
  onAction: () => void;
};

const toneClasses: Record<SummaryItem["tone"], string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
};

export function MenuSummaryCard({ value, label, helper, tone, onAction }: MenuSummaryCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <button
          aria-label={`${label} — lancer l’action de nettoyage local`}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${toneClasses[tone]}`}
          onClick={(event) => {
            event.stopPropagation();
            onAction();
          }}
          type="button"
        >
          <SummaryIcon />
        </button>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">{helper}</p>
    </article>
  );
}

function SummaryIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 7h16" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
