type QuickServiceInsight = {
  label: string;
  value: string;
  helper?: string;
};

type QuickServiceReadingCardProps = {
  title: string;
  summary: string;
  insights: QuickServiceInsight[];
};

export function QuickServiceReadingCard({
  title,
  summary,
  insights,
}: QuickServiceReadingCardProps) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/40 to-white p-5 shadow-sm shadow-emerald-950/5 sm:p-6">
      <div className="min-w-0">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
          Résumé du service
        </p>
        <h2 className="mt-2 break-words text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl break-words text-base font-semibold leading-7 text-slate-600">
          {summary}
        </p>
      </div>

      <div className="mt-6 grid min-w-0 gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,12.5rem),1fr))]">
        {insights.map((insight) => (
          <article
            key={insight.label}
            className="min-w-0 overflow-hidden rounded-3xl border border-white bg-white/85 p-4 shadow-sm shadow-emerald-950/5"
          >
            <p className="whitespace-nowrap text-xs font-black uppercase leading-5 tracking-[0.06em] text-slate-400">
              {insight.label}
            </p>
            <p className="mt-2 break-words text-lg font-black leading-6 text-slate-950">
              {insight.value}
            </p>
            {insight.helper ? (
              <p className="mt-2 text-sm font-semibold leading-5 text-slate-500">
                {insight.helper}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
