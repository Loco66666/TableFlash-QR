type EmptyReviewsStateProps = {
  onRequestReview: () => void;
};

export function EmptyReviewsState({ onRequestReview }: EmptyReviewsStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-3xl" aria-hidden="true">★</div>
      <h2 className="mt-4 text-2xl font-black text-slate-950">Aucun avis trouvé</h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">Modifiez vos filtres ou demandez un nouvel avis après repas.</p>
      <button className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/15 transition hover:bg-emerald-700" onClick={onRequestReview} type="button">Demander un avis</button>
    </div>
  );
}
