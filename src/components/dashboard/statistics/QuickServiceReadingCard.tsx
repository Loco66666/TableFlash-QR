type QuickServiceInsight = {
  label: string;
  value: string;
  helper?: string;
};

export function QuickServiceReadingCard({ insights }: { insights: QuickServiceInsight[] }) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-950/5 sm:p-6">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">Lecture rapide</p>
          <h2 className="mt-2 break-words text-2xl font-black text-slate-950">Lecture rapide du service</h2>
        </div>
        <p className="max-w-xl break-words text-sm font-semibold leading-6 text-slate-500">Les données affichées reflètent l’activité de vos commandes QR.</p>
      </div>

      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight) => (
          <article key={insight.label} className="min-w-0 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="break-words text-xs font-black uppercase tracking-[0.10em] text-slate-400">{insight.label}</p>
            <p className="mt-2 break-words text-lg font-black leading-6 text-slate-950">{insight.value}</p>
            {insight.helper ? <p className="mt-2 break-words text-sm font-semibold leading-5 text-slate-500">{insight.helper}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
