type PublicEmptyStateProps = {
  title: string;
  text: string;
};

export function PublicEmptyState({ title, text }: PublicEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm">
      <p className="text-base font-extrabold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
