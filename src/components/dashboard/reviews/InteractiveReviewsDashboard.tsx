"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardHeader } from "@/components/dashboard";
import {
  clearLocalReviews,
  getLocalReviews,
  LOCAL_REVIEW_CREATED_EVENT,
  LOCAL_REVIEWS_RESET_EVENT,
  LOCAL_REVIEWS_STORAGE_KEY,
  updateLocalReview,
} from "@/lib/localReviews";

import { EmptyReviewsState } from "./EmptyReviewsState";
import { ReviewCard } from "./ReviewCard";
import { ReviewDetailPanel } from "./ReviewDetailPanel";
import { ReviewRatingBreakdown } from "./ReviewRatingBreakdown";
import { ReviewRequestPanel } from "./ReviewRequestPanel";
import { ReviewSummaryCard } from "./ReviewSummaryCard";
import { ReviewsFilterBar } from "./ReviewsFilterBar";
import { ReviewsToast } from "./ReviewsToast";
import { initialReviews } from "./reviewsData";
import type { Review, ReviewFilter, ReviewSort } from "./reviewsData";

type ToastState = {
  id: number;
  message: string;
};

export function InteractiveReviewsDashboard() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(initialReviews[0]?.id ?? null);
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<ReviewSort>("Plus récents");
  const [respondingReviewId, setRespondingReviewId] = useState<string | null>(null);
  const [isRequestPanelOpen, setIsRequestPanelOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [localReviewIds, setLocalReviewIds] = useState<Set<string>>(new Set());

  const visibleReviews = useMemo(() => sortReviews(filterReviews(reviews, activeFilter, searchQuery), sort, localReviewIds), [activeFilter, localReviewIds, reviews, searchQuery, sort]);
  const selectedReview = selectedReviewId ? reviews.find((review) => review.id === selectedReviewId) ?? null : null;
  const summaryCards = useMemo(() => buildSummaryCards(reviews), [reviews]);

  useEffect(() => {
    function refreshLocalReviews() {
      const localReviews = getLocalReviews();

      setLocalReviewIds(new Set(localReviews.map((review) => review.id)));
      setReviews((currentReviews) => mergeReviews(localReviews, currentReviews.filter((review) => !isLocalReviewId(review.id))));
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === LOCAL_REVIEWS_STORAGE_KEY) {
        refreshLocalReviews();
      }
    }

    refreshLocalReviews();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCAL_REVIEW_CREATED_EVENT, refreshLocalReviews);
    window.addEventListener(LOCAL_REVIEWS_RESET_EVENT, refreshLocalReviews);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOCAL_REVIEW_CREATED_EVENT, refreshLocalReviews);
      window.removeEventListener(LOCAL_REVIEWS_RESET_EVENT, refreshLocalReviews);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function showToast(message: string) {
    setToast({ id: Date.now(), message });
  }

  function applyReviewPatch(reviewId: string, patch: Partial<Review>) {
    setReviews((currentReviews) => currentReviews.map((review) => (review.id === reviewId ? { ...review, ...patch } : review)));

    if (isLocalReviewId(reviewId)) {
      updateLocalReview(reviewId, patch as Parameters<typeof updateLocalReview>[1]);
    }
  }

  function handleSelectReview(reviewId: string) {
    setSelectedReviewId(reviewId);
  }

  function handleRespond(reviewId: string) {
    setSelectedReviewId(reviewId);
    setRespondingReviewId(reviewId);
  }

  function handleSaveResponse(reviewId: string, response: string) {
    applyReviewPatch(reviewId, { response: response.trim(), status: "Répondu" });
    setRespondingReviewId(null);
    showToast("Réponse enregistrée.");
  }

  function handleArchive(reviewId: string) {
    const confirmed = window.confirm("Archiver cet avis ?");

    if (!confirmed) {
      return;
    }

    applyReviewPatch(reviewId, { status: "Archivé" });
    showToast("Avis archivé.");
  }

  function handleMarkTreated(reviewId: string) {
    applyReviewPatch(reviewId, { status: "Répondu" });
    showToast("Avis marqué comme traité.");
  }

  function handleGoogleSuggestion(reviewId: string) {
    applyReviewPatch(reviewId, { googleReviewSuggested: true });
    showToast("Lien Google préparé.");
  }

  function handlePrepareGoogleLink(reviewId: string) {
    applyReviewPatch(reviewId, { googleReviewSuggested: true });
    showToast("Lien Google préparé.");
  }

  function handleCreateReviewRequest() {
    setIsRequestPanelOpen(false);
    showToast("Demande d’avis prête à envoyer.");
  }

  function handleResetLocalReviews() {
    const confirmed = window.confirm("Voulez-vous vraiment réinitialiser les avis reçus sur cet appareil ?");

    if (!confirmed) {
      return;
    }

    clearLocalReviews();
    setLocalReviewIds(new Set());
    setReviews(initialReviews);
    setSelectedReviewId(initialReviews[0]?.id ?? null);
    showToast("Avis de cet appareil réinitialisés.");
  }

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Avis clients"
        subtitle="Suivez les retours après repas, identifiez les clients satisfaits et transformez les bonnes expériences en avis publics."
      >
        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700" onClick={() => setIsRequestPanelOpen(true)} type="button">Demander un avis</button>
        <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50" onClick={() => showToast("Export des avis préparé.")} type="button">Exporter les avis</button>
        <button className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-100" onClick={() => showToast("Lien Google Avis prêt à partager.")} type="button">Lien Google Avis</button>
        <button className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs font-black text-slate-500 shadow-sm transition hover:bg-slate-50" onClick={handleResetLocalReviews} type="button">Réinitialiser les avis</button>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-5 lg:p-8">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-2xl shadow-emerald-950/15">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-100">Réputation locale</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Transformez les retours clients en réputation locale</h2>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-emerald-50">Après le repas, TableFlash recueille les retours clients. Les avis positifs peuvent être orientés vers votre fiche Google, sans forcer l’expérience.</p>
            </div>
            <div className="grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:grid-cols-4">
              {["Repas terminé", "Retour client", "Avis positif", "Google Avis"].map((step, index) => (
                <div className="rounded-2xl bg-white p-4 text-emerald-950 shadow-lg shadow-emerald-950/10" key={step}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">{index + 1}</span>
                  <p className="mt-3 text-sm font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <ReviewSummaryCard key={card.label} {...card} />
          ))}
        </section>

        <ReviewRatingBreakdown reviews={reviews} />

        <ReviewsFilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} onSearchChange={setSearchQuery} onSortChange={setSort} searchQuery={searchQuery} sort={sort} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Avis reçus</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Centralisez les retours clients, traitez les avis à prioriser et valorisez les expériences positives.</p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-500 ring-1 ring-slate-200">{visibleReviews.length} avis</span>
            </div>

            {visibleReviews.length > 0 ? (
              <div className="grid gap-4">
                {visibleReviews.map((review) => (
                  <ReviewCard
                    isSelected={review.id === selectedReviewId}
                    key={review.id}
                    onArchive={handleArchive}
                    onGoogle={handleGoogleSuggestion}
                    onRespond={handleRespond}
                    onSelect={handleSelectReview}
                    review={review}
                  />
                ))}
              </div>
            ) : (
              <EmptyReviewsState onRequestReview={() => setIsRequestPanelOpen(true)} />
            )}
          </div>

          <ReviewDetailPanel
            isResponding={respondingReviewId === selectedReview?.id}
            onArchive={handleArchive}
            onClose={() => {
              setSelectedReviewId(null);
              setRespondingReviewId(null);
            }}
            onGoogle={handlePrepareGoogleLink}
            onMarkTreated={handleMarkTreated}
            onRespond={handleRespond}
            onSaveResponse={handleSaveResponse}
            onStopResponding={() => setRespondingReviewId(null)}
            review={selectedReview}
          />
        </section>
      </main>

      {isRequestPanelOpen ? <ReviewRequestPanel onClose={() => setIsRequestPanelOpen(false)} onSubmit={handleCreateReviewRequest} /> : null}
      {toast ? <ReviewsToast key={toast.id} message={toast.message} onClose={() => setToast(null)} /> : null}
    </>
  );
}

function filterReviews(reviews: Review[], activeFilter: ReviewFilter, searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return reviews.filter((review) => {
    const matchesFilter = matchesReviewFilter(review, activeFilter);
    const searchableContent = [review.customerName, review.tableName, review.orderNumber, review.comment, review.source, review.status, review.sentiment, ...review.tags].join(" ").toLowerCase();
    const matchesSearch = !normalizedQuery || searchableContent.includes(normalizedQuery);

    return matchesFilter && matchesSearch;
  });
}

function matchesReviewFilter(review: Review, activeFilter: ReviewFilter) {
  switch (activeFilter) {
    case "Tous":
      return true;
    case "Nouveaux":
      return review.status === "Nouveau";
    case "À traiter":
      return review.status === "À traiter";
    case "Positifs":
      return review.sentiment === "Positif";
    case "Négatifs":
      return review.sentiment === "Négatif";
    case "Google":
      return review.source === "Google";
    case "Répondus":
      return review.status === "Répondu";
    case "Archivés":
      return review.status === "Archivé";
  }
}

function sortReviews(reviews: Review[], sort: ReviewSort, localReviewIds: Set<string>) {
  const statusPriority: Record<Review["status"], number> = { "À traiter": 0, Nouveau: 1, Répondu: 2, Archivé: 3 };

  return [...reviews].sort((firstReview, secondReview) => {
    const firstReviewIsLocal = localReviewIds.has(firstReview.id);
    const secondReviewIsLocal = localReviewIds.has(secondReview.id);

    if (firstReviewIsLocal !== secondReviewIsLocal) {
      return firstReviewIsLocal ? -1 : 1;
    }

    if (sort === "Meilleure note") {
      return secondReview.rating - firstReview.rating;
    }

    if (sort === "Moins bonne note") {
      return firstReview.rating - secondReview.rating;
    }

    if (sort === "À traiter d’abord") {
      return statusPriority[firstReview.status] - statusPriority[secondReview.status];
    }

    return `${secondReview.createdAt} ${secondReview.time}`.localeCompare(`${firstReview.createdAt} ${firstReview.time}`);
  });
}

function buildSummaryCards(reviews: Review[]) {
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const positiveCount = reviews.filter((review) => review.sentiment === "Positif").length;
  const toHandleCount = reviews.filter((review) => review.status === "À traiter").length;

  return [
    { value: `${averageRating.toFixed(1).replace(".", ",")}/5`, label: "Note moyenne", helper: "Satisfaction globale", tone: "emerald" as const },
    { value: String(reviews.length), label: "Avis reçus", helper: "Retours après repas", tone: "sky" as const },
    { value: String(positiveCount), label: "Avis positifs", helper: "Clients satisfaits", tone: "amber" as const },
    { value: String(toHandleCount), label: "À traiter", helper: "Retours à prioriser", tone: "rose" as const },
  ];
}

function mergeReviews(localReviews: Review[], baseReviews: Review[]) {
  const seenIds = new Set<string>();
  const seenOrderNumbers = new Set<string>();
  const mergedReviews: Review[] = [];

  [...localReviews, ...baseReviews].forEach((review) => {
    if (seenIds.has(review.id) || seenOrderNumbers.has(review.orderNumber)) {
      return;
    }

    seenIds.add(review.id);
    seenOrderNumbers.add(review.orderNumber);
    mergedReviews.push(review);
  });

  return mergedReviews;
}

function isLocalReviewId(reviewId: string) {
  return getLocalReviews().some((review) => review.id === reviewId);
}
