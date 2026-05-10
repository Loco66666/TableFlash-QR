import type { OrderFilter } from "./ordersData";
import { advancedOrderFilters, mainOrderFilters } from "./ordersData";

type OrdersFilterBarProps = {
  activeFilter: OrderFilter;
  isFilterOpen: boolean;
  searchQuery: string;
  onFilterChange: (filter: OrderFilter) => void;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
};

const filterButtonBase = "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-100";
const inactiveFilterClasses = "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800";
const activeFilterClasses = "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-900/10";

export function OrdersFilterBar({ activeFilter, isFilterOpen, searchQuery, onFilterChange, onSearchChange, onToggleFilters }: OrdersFilterBarProps) {
  const activeAdvancedFilter = advancedOrderFilters.includes(activeFilter) ? activeFilter : null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 xl:mx-0 xl:min-w-0 xl:flex-none xl:px-0" aria-label="Filtres principaux des commandes">
          {mainOrderFilters.map((filter) => (
            <button
              className={`${filterButtonBase} ${filter === activeFilter ? activeFilterClasses : inactiveFilterClasses}`}
              key={filter}
              onClick={() => onFilterChange(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row xl:flex-1 xl:justify-end">
          <label className="relative min-w-0 flex-1 xl:max-w-[560px]">
            <span className="sr-only">Rechercher une commande</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Rechercher une table, un numéro, un produit..."
              type="search"
              value={searchQuery}
            />
          </label>
          <button
            aria-controls="orders-advanced-filters"
            aria-expanded={isFilterOpen}
            aria-pressed={isFilterOpen}
            className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-black shadow-sm transition ${
              isFilterOpen || activeAdvancedFilter
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            }`}
            onClick={onToggleFilters}
            type="button"
          >
            <FilterIcon />
            {activeAdvancedFilter ? `Filtres · ${activeAdvancedFilter}` : "Filtres"}
          </button>
        </div>
      </div>
      {isFilterOpen ? (
        <div className="mt-3 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-3" id="orders-advanced-filters">
          <div className="flex flex-wrap gap-2" aria-label="Filtres avancés des commandes">
            {advancedOrderFilters.map((filter) => (
              <button
                className={`${filterButtonBase} ${filter === activeFilter ? activeFilterClasses : "border-emerald-100 bg-white text-emerald-800 hover:border-emerald-200 hover:bg-emerald-100"}`}
                key={filter}
                onClick={() => onFilterChange(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
          <p className="mt-3 px-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800/70">
            Filtre actif : {activeFilter}. Recherche par numéro, emplacement, produit ou note client.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}
