import type { Review } from "./reviewsData";
import { ReviewStars } from "./ReviewStars";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

type ReviewCardProps = {
  isSelected: boolean;
  onArchive: (id: string) => void;
  onGoogle: (id: string) => void;
  onRespond: (id: string) => void;
  onSelect: (id: string) => void;
  review: Review;
};

export function ReviewCard({ isSelected, onArchive, onGoogle, onRespond, onSelect, review }: ReviewCardProps) {
  const canSuggestGoogle = review.googleReviewSuggested && review.source === "TableFlash";

  return (
    <article className={`rounded-3xl border bg-white p-5 shadow-sm transition ${isSelected ? "border-emerald-300 ring-4 ring-emerald-100" : "border-slate-200 hover:border-emerald-200"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black text-slate-950">{review.customerName}</h3>
            <ReviewStatusBadge label={review.source} />
            <ReviewStatusBadge label={review.status} />
            <ReviewStatusBadge label={review.sentiment} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
            <ReviewStars rating={review.rating} />
            <span>{review.tableName}</span>
            <span>{review.orderNumber}</span>
            <span>{review.time}</span>
          </div>
        </div>
        <span className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{review.createdAt}</span>
      </div>

      <p className="mt-4 text-base font-semibold leading-7 text-slate-700">“{review.comment}”</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600" key={tag}>#{tag}</span>
        ))}
      </div>

      {canSuggestGoogle ? (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
          Client satisfait — avis Google recommandé
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800" onClick={() => onSelect(review.id)} type="button">Voir détail</button>
        <button className="rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-50" onClick={() => onRespond(review.id)} type="button">Répondre</button>
        {canSuggestGoogle ? (
          <button className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-100" onClick={() => onGoogle(review.id)} type="button">Suggérer Google</button>
        ) : null}
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50" onClick={() => onArchive(review.id)} type="button">Archiver</button>
      </div>
    </article>
  );
}
