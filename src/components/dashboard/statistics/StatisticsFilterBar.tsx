import type { CurrentServiceContext } from "@/lib/serviceContext";
import type { StatisticsPeriod, StatisticsPeriodOption } from "./statisticsData";

type ServiceHours = {
  startTime: string;
  endTime: string;
} | null;

function buildPeriodHelper(
  period: StatisticsPeriodOption,
  serviceContext: CurrentServiceContext | null,
  lunchHours: ServiceHours,
  dinnerHours: ServiceHours,
) {
  if (period.id === "current") {
    if (!serviceContext) return "Analyse du service…";
    if (serviceContext.status === "open" && serviceContext.startTime && serviceContext.endTime) {
      return `${serviceContext.startTime} — ${serviceContext.endTime}`;
    }
    if (serviceContext.status === "between-services" && serviceContext.nextServiceStart) {
      return `Prochain service à ${serviceContext.nextServiceStart}`;
    }
    return serviceContext.label;
  }

  if (period.id === "lunch" && lunchHours) {
    return `${lunchHours.startTime} — ${lunchHours.endTime}`;
  }

  if (period.id === "dinner" && dinnerHours) {
    return `${dinnerHours.startTime} — ${dinnerHours.endTime}`;
  }

  return null;
}

export function StatisticsFilterBar({
  periods,
  activePeriod,
  onChange,
  serviceContext,
  lunchHours,
  dinnerHours,
}: {
  periods: StatisticsPeriodOption[];
  activePeriod: StatisticsPeriod;
  onChange: (period: StatisticsPeriod) => void;
  serviceContext: CurrentServiceContext | null;
  lunchHours: ServiceHours;
  dinnerHours: ServiceHours;
}) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-2 shadow-sm shadow-emerald-950/5 sm:p-3">
      <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
        {periods.map((period) => {
          const isActive = period.id === activePeriod;
          const helper = buildPeriodHelper(period, serviceContext, lunchHours, dinnerHours);

          return (
            <button
              key={period.id}
              type="button"
              onClick={() => onChange(period.id)}
              className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-black transition sm:shrink ${
                isActive ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/15" : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
              aria-pressed={isActive}
            >
              <span className="block">{period.label}</span>
              {helper ? <span className={`mt-1 block text-xs font-bold ${isActive ? "text-emerald-50" : "text-slate-400"}`}>{helper}</span> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
