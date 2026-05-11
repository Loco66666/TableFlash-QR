type Insight = {
  title: string;
  value: string;
  description: string;
};

export function OrdersTrendCard({ insights }: { insights: Insight[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {insights.map((insight) => (
        <article key={insight.title} className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
          <p className="text-sm font-black text-emerald-700">{insight.title}</p>
          <h3 className="mt-3 text-xl font-black text-slate-950">{insight.value}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{insight.description}</p>
        </article>
      ))}
    </section>
  );
}
