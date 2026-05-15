import type { StatisticsPeriod, StatisticsPeriodOption } from "./statisticsData";

export function StatisticsFilterBar({
  periods,
  activePeriod,
  onChange,
}: {
  periods: StatisticsPeriodOption[];
  activePeriod: StatisticsPeriod;
  onChange: (period: StatisticsPeriod) => void;
}) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-2 shadow-sm shadow-emerald-950/5 sm:p-3">
      <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
        {periods.map((period) => {
          const isActive = period.id === activePeriod;

          return (
            <button
              key={period.id}
              type="button"
              onClick={() => onChange(period.id)}
              className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-black transition sm:shrink ${
                isActive ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/15" : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
              aria-pressed={isActive}
            >
              {period.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
