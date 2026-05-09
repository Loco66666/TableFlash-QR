type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-emerald-200 bg-white p-8 text-center shadow-sm shadow-slate-200/70">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
        {icon ?? <span aria-hidden="true" className="text-3xl">✦</span>}
      </div>
      <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-500">{description}</p>
    </section>
  );
}
