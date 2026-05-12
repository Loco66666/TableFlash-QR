type ReviewsInsightCardProps = {
  averageRating: number;
  positiveReviews: number;
  reviewsToHandle: number;
  latestSentiment: string;
};

export function ReviewsInsightCard({ averageRating, positiveReviews, reviewsToHandle, latestSentiment }: ReviewsInsightCardProps) {
  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="break-words text-2xl font-black text-slate-950">Retours clients</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-700">Note moyenne</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{averageRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-600">Dernier sentiment</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{latestSentiment}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <p className="rounded-2xl border border-slate-100 p-3 text-sm font-black text-slate-700">{positiveReviews} avis positifs</p>
        <p className="rounded-2xl border border-slate-100 p-3 text-sm font-black text-slate-700">{reviewsToHandle} avis à traiter</p>
      </div>
      <p className="mt-5 rounded-3xl bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-900">Les clients satisfaits peuvent être orientés vers votre lien Google Avis.</p>
    </article>
  );
}
