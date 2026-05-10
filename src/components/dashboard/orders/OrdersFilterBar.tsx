import type { OrderFilter } from "./ordersData";
import { orderFilters } from "./ordersData";

type OrdersFilterBarProps = {
  activeFilter: OrderFilter;
  isFilterOpen: boolean;
  searchQuery: string;
  onFilterChange: (filter: OrderFilter) => void;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
};

export function OrdersFilterBar({ activeFilter, isFilterOpen, searchQuery, onFilterChange, onSearchChange, onToggleFilters }: OrdersFilterBarProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtres des commandes">
          {orderFilters.map((filter) => (
            <button
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                filter === activeFilter
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
              key={filter}
              onClick={() => onFilterChange(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row xl:min-w-[520px]">
          <label className="relative flex-1">
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
            aria-pressed={isFilterOpen}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-black shadow-sm transition ${
              isFilterOpen
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            }`}
            onClick={onToggleFilters}
            type="button"
          >
            <FilterIcon />
            Filtres
          </button>
        </div>
      </div>
      {isFilterOpen ? (
        <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          Filtre actif : {activeFilter}. La recherche couvre le numéro, l’emplacement, les produits et les notes client.
        </p>
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
