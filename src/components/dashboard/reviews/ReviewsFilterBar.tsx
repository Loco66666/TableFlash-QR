import type { ReviewFilter, ReviewSort } from "./reviewsData";
import { reviewFilters, reviewSorts } from "./reviewsData";

type ReviewsFilterBarProps = {
  activeFilter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: ReviewSort) => void;
  searchQuery: string;
  sort: ReviewSort;
};

export function ReviewsFilterBar({ activeFilter, onFilterChange, onSearchChange, onSortChange, searchQuery, sort }: ReviewsFilterBarProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reviewFilters.map((filter) => (
          <button
            className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-black transition ${
              activeFilter === filter ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/15" : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
            key={filter}
            onClick={() => onFilterChange(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
        <label className="sr-only" htmlFor="reviews-search">Rechercher un avis</label>
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          id="reviews-search"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher un client, une table, une commande..."
          value={searchQuery}
        />
        <label className="sr-only" htmlFor="reviews-sort">Trier les avis</label>
        <select
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          id="reviews-sort"
          onChange={(event) => onSortChange(event.target.value as ReviewSort)}
          value={sort}
        >
          {reviewSorts.map((sortOption) => (
            <option key={sortOption} value={sortOption}>{sortOption}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
