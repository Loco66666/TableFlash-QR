type Insight = {
  title: string;
  value?: string;
  description: string;
};

type OrdersTrendCardProps = {
  title?: string;
  subtitle?: string;
  insights: Insight[];
};

export function OrdersTrendCard({ title = "Décisions recommandées", subtitle = "Actions concrètes à préparer pour le prochain service.", insights }: OrdersTrendCardProps) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="min-w-0">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">Plan d’action</p>
        <h2 className="mt-2 break-words text-2xl font-black text-slate-950">{title}</h2>
        <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-500">{subtitle}</p>
      </div>

      <div className="mt-5 grid min-w-0 gap-3">
        {insights.map((insight, index) => (
          <article key={insight.title} className="grid min-w-0 grid-cols-[2.75rem_1fr] gap-3 rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-black text-white shadow-lg shadow-emerald-900/15">{index + 1}</span>
            <div className="min-w-0">
              <h3 className="break-words text-base font-black leading-6 text-slate-950">{insight.value ?? insight.title}</h3>
              <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-500">{insight.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
