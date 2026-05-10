export function PreparationTimeWidget() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">Temps moyen de préparation</h2>
          <p className="mt-4 text-5xl font-black tracking-tight text-slate-950">12 min</p>
          <p className="mt-2 text-sm font-black text-emerald-700">3 min gagnées vs hier</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" aria-hidden="true">
          <ClockIcon />
        </span>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden="true">
        <span className="h-2 rounded-full bg-emerald-500" />
        <span className="h-2 rounded-full bg-emerald-400" />
        <span className="h-2 rounded-full bg-emerald-200" />
        <span className="h-2 rounded-full bg-slate-100" />
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
