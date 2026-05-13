type ActiveTableRow = {
  name: string;
  scans: number;
  orders: number;
  conversion: number;
};

const activeTablesGridClass = "xl:grid-cols-[minmax(9rem,1fr)_5rem_6.5rem_6.5rem_8rem]";
const cardClass = "flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6";
const eyebrowClass = "text-sm font-black uppercase tracking-[0.08em] text-emerald-700";
const titleClass = "text-2xl font-black leading-tight text-slate-950";
const subtitleClass = "mt-2 break-words text-sm font-semibold leading-6 text-slate-500";
const tableHeaderClass = "mt-5 hidden h-8 min-w-0 max-w-full items-center gap-4 px-3 text-[0.68rem] font-black uppercase tracking-[0.10em] text-slate-400 xl:grid";
const rowsClass = "mt-3 flex min-w-0 max-w-full flex-1 flex-col gap-3";
const rowClass = "flex min-h-[60px] min-w-0 max-w-full items-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 p-3.5 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm hover:shadow-slate-200/70 sm:p-3 xl:h-16";
const mobileLabelClass = "text-xs font-black uppercase tracking-[0.10em] text-slate-400 xl:hidden";
const mutedValueClass = "whitespace-nowrap text-sm font-bold tabular-nums text-slate-700";
const strongValueClass = "whitespace-nowrap text-sm font-black tabular-nums text-emerald-700";

export function formatLocationLabelForStats(name: string) {
  const normalizedName = name.trim().replace(/\s+/g, " ");
  const tableMatch = normalizedName.match(/^Table (\d+)$/i);

  if (tableMatch) {
    return `T${tableMatch[1]}`;
  }

  return normalizedName;
}

function getLocationReading(row: ActiveTableRow) {
  if (row.conversion >= 30) {
    return "Très efficace";
  }

  if (row.orders >= 4) {
    return "Zone forte";
  }

  if (row.scans >= 12) {
    return "Bon trafic";
  }

  return "À surveiller";
}

export function ActiveTablesTable({ rows }: { rows: ActiveTableRow[] }) {
  return (
    <article className={cardClass}>
      <div className="min-w-0 max-w-full break-words">
        <p className={eyebrowClass}>Activité par emplacement</p>
        <h2 className={titleClass}>Activité par emplacement</h2>
        <p className={subtitleClass}>Comparez les scans, commandes et conversions par table ou zone.</p>
      </div>

      <div className={`${tableHeaderClass} ${activeTablesGridClass}`}>
        <span className="min-w-0">Emplacement</span>
        <span className="text-right">Scans</span>
        <span className="text-right">Commandes</span>
        <span className="text-right">Conversion</span>
        <span className="text-center">Lecture</span>
      </div>

      <div className={rowsClass}>
        {rows.map((row) => (
          <div key={row.name} className={rowClass}>
            <div className={`grid w-full min-w-0 max-w-full gap-3 xl:items-center xl:gap-4 ${activeTablesGridClass}`}>
              <p className="min-w-0 truncate whitespace-nowrap text-base font-black leading-tight text-slate-950" title={row.name} aria-label={row.name}>{formatLocationLabelForStats(row.name)}</p>

              <div className="flex min-w-0 items-center justify-between gap-3 border-t border-slate-200/70 pt-3 xl:block xl:border-0 xl:pt-0 xl:text-right">
                <span className={mobileLabelClass}>Scans</span>
                <span className={mutedValueClass}>{row.scans}</span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 xl:block xl:text-right">
                <span className={mobileLabelClass}>Commandes</span>
                <span className={mutedValueClass}>{row.orders}</span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 xl:block xl:text-right">
                <span className={mobileLabelClass}>Conversion</span>
                <span className={strongValueClass}>{row.conversion.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 xl:justify-center">
                <span className={mobileLabelClass}>Lecture</span>
                <span className="inline-flex max-w-full justify-center truncate rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black leading-none text-emerald-700 ring-1 ring-emerald-100 sm:min-w-[6.5rem]">{getLocationReading(row)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
