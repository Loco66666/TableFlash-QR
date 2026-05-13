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
  const isGoogleEligible = review.rating >= 4 && review.source === "TableFlash";
  const priorityLabel = review.rating <= 3 ? "À prioriser" : "Positif";

  return (
    <article className={`rounded-3xl border bg-white p-5 shadow-sm transition ${isSelected ? "border-emerald-300 ring-4 ring-emerald-100" : "border-slate-200 hover:border-emerald-200"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-xl font-black text-slate-950">{review.customerName}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
            <ReviewStars rating={review.rating} />
            <span>{review.tableName}</span>
            <span>{review.orderNumber}</span>
            <span>{review.time}</span>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{review.createdAt}</span>
      </div>

      <p className="mt-4 line-clamp-3 text-base font-semibold leading-7 text-slate-700">“{review.comment}”</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <ReviewStatusBadge label={review.status} />
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${review.rating <= 3 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {priorityLabel}
        </span>
        {isGoogleEligible ? <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{review.googleReviewSuggested ? "Lien Google préparé" : "Google recommandé"}</span> : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button className="min-h-11 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800" onClick={() => onSelect(review.id)} type="button">Voir détail</button>
        <button className="min-h-11 rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-50" onClick={() => onRespond(review.id)} type="button">Répondre</button>
        {isGoogleEligible && !review.googleReviewSuggested ? (
          <button className="min-h-11 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-100" onClick={() => onGoogle(review.id)} type="button">Préparer lien Google</button>
        ) : null}
        {review.rating <= 3 ? <span className="inline-flex min-h-11 items-center rounded-2xl bg-amber-50 px-4 py-2 text-sm font-black text-amber-800">Répondre en priorité</span> : null}
        <button className="min-h-11 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50" onClick={() => onArchive(review.id)} type="button">Archiver</button>
      </div>
    </article>
  );
}
