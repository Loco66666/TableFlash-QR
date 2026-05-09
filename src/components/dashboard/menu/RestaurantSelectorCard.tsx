export function RestaurantSelectorCard() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:p-5">
      <button
        aria-label="Changer de restaurant"
        className="group flex w-full items-center justify-between gap-4 rounded-[1.5rem] bg-slate-50 p-3 text-left transition hover:bg-emerald-50"
        type="button"
      >
        <span className="flex min-w-0 items-center gap-4">
          <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-500 to-amber-200 shadow-lg shadow-emerald-900/10">
            <span className="absolute left-2 top-2 h-5 w-7 rounded-full bg-white/35 blur-[1px]" />
            <span className="absolute inset-x-3 bottom-2 h-5 rounded-full bg-white/30 blur-sm" />
            <span className="m-auto text-base font-black text-white">LB</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-black tracking-tight text-slate-950">Le Bistrot des Halles</span>
            <span className="mt-1 block text-sm font-bold text-slate-500">Restaurant</span>
          </span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-emerald-200">
          <ChevronDownIcon />
        </span>
      </button>
    </section>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
