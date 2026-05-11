import type { Review } from "./reviewsData";

type ReviewRatingBreakdownProps = {
  reviews: Review[];
};

export function ReviewRatingBreakdown({ reviews }: ReviewRatingBreakdownProps) {
  const total = reviews.length || 1;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-950">Répartition des notes</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Lecture rapide de la satisfaction client.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Local</span>
      </div>
      <div className="mt-5 space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = reviews.filter((review) => review.rating === rating).length;
          const width = `${(count / total) * 100}%`;

          return (
            <div key={rating} className="grid grid-cols-[82px_minmax(0,1fr)_28px] items-center gap-3 text-sm font-bold text-slate-600">
              <span>{rating} étoile{rating > 1 ? "s" : ""}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width }} />
              </span>
              <span className="text-right text-slate-900">{count}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
