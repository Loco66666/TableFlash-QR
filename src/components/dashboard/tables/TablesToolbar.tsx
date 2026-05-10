import type { TableSortMode, TableStatusFilter, TableZoneFilter } from "./tablesData";
import { zoneFilters } from "./tablesData";

type TablesToolbarProps = {
  activeStatusFilter: TableStatusFilter;
  activeZoneFilter: TableZoneFilter;
  isReorderMode: boolean;
  onAddTable: () => void;
  onReorderToggle: () => void;
  onSearchChange: (value: string) => void;
  onSortModeChange: (value: TableSortMode) => void;
  onStatusFilterChange: (value: TableStatusFilter) => void;
  onZoneFilterChange: (value: TableZoneFilter) => void;
  searchQuery: string;
  sortMode: TableSortMode;
};

const statusFilters: TableStatusFilter[] = ["Tous", "Actifs", "Inactifs"];

export function TablesToolbar({ activeStatusFilter, activeZoneFilter, isReorderMode, onAddTable, onReorderToggle, onSearchChange, onSortModeChange, onStatusFilterChange, onZoneFilterChange, searchQuery, sortMode }: TablesToolbarProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-emerald-950/[0.03]">
      <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_auto] xl:items-center">
        <label className="block">
          <span className="sr-only">Rechercher une table ou une zone</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher une table ou une zone..."
            type="search"
            value={searchQuery}
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_auto_auto] xl:flex xl:items-center xl:justify-end">
          <label className="sr-only" htmlFor="tables-sort-mode">Trier les tables</label>
          <select
            className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            id="tables-sort-mode"
            onChange={(event) => onSortModeChange(event.target.value as TableSortMode)}
            value={sortMode}
          >
            <option value="custom">Tri personnalisé</option>
            <option value="name">Nom de table</option>
            <option value="zone">Zone</option>
            <option value="scans">Scans du jour</option>
          </select>
          <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100" onClick={onReorderToggle} type="button">
            {isReorderMode ? "Terminer" : "Réorganiser"}
          </button>
          <button className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700" onClick={onAddTable} type="button">
            Ajouter une table
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div className="flex flex-wrap gap-2" aria-label="Filtrer par zone">
          {zoneFilters.map((zone) => (
            <button
              className={`rounded-full px-3.5 py-2 text-xs font-black transition ${activeZoneFilter === zone ? "bg-slate-950 text-white shadow-md shadow-slate-950/10" : "bg-slate-100/80 text-slate-600 hover:bg-slate-200"}`}
              key={zone}
              onClick={() => onZoneFilterChange(zone)}
              type="button"
            >
              {zone}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filtrer par statut">
          {statusFilters.map((status) => (
            <button
              className={`rounded-full px-3.5 py-2 text-xs font-black transition ${activeStatusFilter === status ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/10" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"}`}
              key={status}
              onClick={() => onStatusFilterChange(status)}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isReorderMode ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800 ring-1 ring-amber-200">Mode réorganisation actif. Utilisez Monter et Descendre sur chaque carte.</p>
      ) : null}
    </section>
  );
}
