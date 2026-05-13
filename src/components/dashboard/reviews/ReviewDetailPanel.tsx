import type { Review } from "./reviewsData";
import { ReviewResponseBox } from "./ReviewResponseBox";
import { ReviewStars } from "./ReviewStars";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

type ReviewDetailPanelProps = {
  isResponding: boolean;
  onArchive: (id: string) => void;
  onClose: () => void;
  onGoogle: (id: string) => void;
  onMarkTreated: (id: string) => void;
  onRespond: (id: string) => void;
  onSaveResponse: (id: string, response: string) => void;
  onStopResponding: () => void;
  review: Review | null;
};

export function ReviewDetailPanel({ isResponding, onArchive, onClose, onGoogle, onMarkTreated, onRespond, onSaveResponse, onStopResponding, review }: ReviewDetailPanelProps) {
  if (!review) {
    return (
      <aside className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm lg:sticky lg:top-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl" aria-hidden="true">✦</div>
        <h2 className="mt-4 text-xl font-black text-slate-950">Aucun avis sélectionné</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Sélectionnez un avis pour suivre son traitement, répondre au client et préparer les prochaines actions.</p>
      </aside>
    );
  }

  const isGoogleEligible = review.rating >= 4 && review.source === "TableFlash";
  const analysisLabel = review.rating >= 4 ? "Positif" : "À prioriser";

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Workflow de traitement</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Avis de {review.customerName}</h2>
          <ReviewStars rating={review.rating} />
        </div>
        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl font-black text-slate-500 transition hover:bg-slate-50 hover:text-slate-900" onClick={onClose} type="button" aria-label="Fermer le détail de l’avis">
          ×
        </button>
      </div>

      <section className="mt-5 rounded-3xl bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Avis client</p>
        <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">“{review.comment}”</p>
      </section>

      <section className="mt-5">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Contexte</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <DetailItem label="Table" value={review.tableName} />
          <DetailItem label="Commande" value={review.orderNumber} />
          <DetailItem label="Heure" value={review.time} />
          <DetailItem label="Source" value={review.source} />
        </dl>
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 p-4">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Analyse</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <ReviewStatusBadge label={review.status} />
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${review.rating >= 4 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            {analysisLabel}
          </span>
          {isGoogleEligible ? <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{review.googleReviewSuggested ? "Lien Google préparé" : "Google recommandé"}</span> : null}
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
          {isGoogleEligible
            ? "Ce client semble satisfait. Vous pouvez lui proposer de partager son expérience sur Google."
            : "Ce retour mérite une réponse attentive avant toute action de valorisation publique."}
        </p>
        {review.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {review.tags.map((tag) => (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600" key={tag}>#{tag}</span>
            ))}
          </div>
        ) : null}
      </section>

      {review.response ? (
        <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-black text-emerald-900">Réponse enregistrée</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">{review.response}</p>
        </div>
      ) : null}

      {isResponding ? (
        <div className="mt-5">
          <ReviewResponseBox initialValue={review.response} onCancel={onStopResponding} onSave={(response) => onSaveResponse(review.id, response)} />
        </div>
      ) : null}

      {isGoogleEligible ? (
        <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-black text-blue-900">{review.googleReviewSuggested ? "Lien Google préparé" : "Google recommandé"}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-blue-700">Vous gardez le contrôle : TableFlash prépare le lien, le client choisit ensuite de publier son avis.</p>
        </div>
      ) : null}

      <section className="mt-5">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Actions</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700" onClick={() => onRespond(review.id)} type="button">Répondre</button>
          {isGoogleEligible && !review.googleReviewSuggested ? (
            <button className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-100" onClick={() => onGoogle(review.id)} type="button">Préparer lien Google</button>
          ) : null}
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50" onClick={() => onMarkTreated(review.id)} type="button">Marquer comme traité</button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50" onClick={() => onArchive(review.id)} type="button">Archiver</button>
        </div>
      </section>
    </aside>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</dt>
      <dd className="mt-1 break-words font-black text-slate-800">{value}</dd>
    </div>
  );
}
