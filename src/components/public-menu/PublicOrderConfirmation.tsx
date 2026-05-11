"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { formatEuro } from "@/lib/formatters";
import { addLocalReview, createLocalReview, getLocalReviews, type LocalReviewRating } from "@/lib/localReviews";
import {
  getLocalOrders,
  LOCAL_ORDER_CREATED_EVENT,
  LOCAL_ORDER_RESET_EVENT,
  LOCAL_ORDER_UPDATED_EVENT,
  LOCAL_ORDERS_STORAGE_KEY,
  type LocalOrderStatus,
  type LocalSubmittedOrder,
} from "@/lib/localOrders";

import type { ConfirmedOrder } from "./types";

type PublicOrderConfirmationProps = {
  order: ConfirmedOrder | null;
  paymentNote: string;
  onBackToMenu: () => void;
  onNewOrder: () => void;
};

type TrackingStep = {
  label: string;
  statuses: LocalOrderStatus[];
};

type CustomerStatusContent = {
  title: string;
  message: string;
};

const customerStatusContent: Record<LocalOrderStatus, CustomerStatusContent> = {
  Nouvelle: {
    title: "Commande envoyée",
    message: "Votre commande a bien été transmise au restaurant.",
  },
  Acceptée: {
    title: "Commande acceptée",
    message: "Le restaurant a pris en charge votre commande.",
  },
  "À payer": {
    title: "Règlement sur place",
    message: "Vous pouvez régler à la caisse ou auprès du serveur.",
  },
  Payée: {
    title: "Règlement confirmé",
    message: "Votre règlement est confirmé. La préparation peut commencer.",
  },
  "En préparation": {
    title: "En préparation",
    message: "L’équipe prépare votre commande.",
  },
  Prête: {
    title: "Commande prête",
    message: "Votre commande est prête à être servie.",
  },
  Servie: {
    title: "Commande servie",
    message: "Merci pour votre commande. Nous espérons que vous avez passé un agréable moment.",
  },
  Refusée: {
    title: "Commande non prise en charge",
    message: "La commande n’a pas pu être prise en charge par le restaurant.",
  },
  Annulée: {
    title: "Commande annulée",
    message: "Cette commande a été annulée.",
  },
};

const trackingSteps: TrackingStep[] = [
  { label: "Commande envoyée", statuses: ["Nouvelle"] },
  { label: "Validation", statuses: ["Acceptée", "À payer", "Payée"] },
  { label: "Préparation", statuses: ["En préparation", "Prête"] },
  { label: "Servie", statuses: ["Servie"] },
];

function findLatestOrder(orderNumber: string): LocalSubmittedOrder | null {
  return getLocalOrders().find((localOrder) => localOrder.orderNumber === orderNumber) ?? null;
}

function getActiveStepIndex(status: LocalOrderStatus) {
  return trackingSteps.findIndex((step) => step.statuses.includes(status));
}

function isStoppedStatus(status: LocalOrderStatus) {
  return status === "Refusée" || status === "Annulée";
}

function getPaymentBadgeLabel(status: LocalOrderStatus) {
  if (status === "À payer") {
    return "À régler sur place";
  }

  if (["Payée", "En préparation", "Prête", "Servie"].includes(status)) {
    return "Règlement confirmé";
  }

  return null;
}

export function PublicOrderConfirmation({ order, paymentNote, onBackToMenu, onNewOrder }: PublicOrderConfirmationProps) {
  const [latestOrder, setLatestOrder] = useState<LocalSubmittedOrder | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<LocalReviewRating | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewCustomerName, setReviewCustomerName] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [submittedReviewRating, setSubmittedReviewRating] = useState<LocalReviewRating | null>(null);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  const refreshOrderStatus = useCallback(() => {
    if (!order) {
      setLatestOrder(null);
      return;
    }

    setLatestOrder(findLatestOrder(order.orderNumber));
    setHasSubmittedReview(getLocalReviews().some((review) => review.orderNumber === order.orderNumber));
  }, [order]);

  useEffect(() => {
    if (!order) {
      return;
    }

    const initialRefreshId = window.setTimeout(refreshOrderStatus, 0);
    const intervalId = window.setInterval(refreshOrderStatus, 3000);

    function handleStorage(event: StorageEvent) {
      if (event.key === LOCAL_ORDERS_STORAGE_KEY) {
        refreshOrderStatus();
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCAL_ORDER_CREATED_EVENT, refreshOrderStatus);
    window.addEventListener(LOCAL_ORDER_UPDATED_EVENT, refreshOrderStatus);
    window.addEventListener(LOCAL_ORDER_RESET_EVENT, refreshOrderStatus);

    return () => {
      window.clearTimeout(initialRefreshId);
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOCAL_ORDER_CREATED_EVENT, refreshOrderStatus);
      window.removeEventListener(LOCAL_ORDER_UPDATED_EVENT, refreshOrderStatus);
      window.removeEventListener(LOCAL_ORDER_RESET_EVENT, refreshOrderStatus);
    };
  }, [order, refreshOrderStatus]);

  const latestOrderForCurrentConfirmation = order && latestOrder?.orderNumber === order.orderNumber ? latestOrder : null;
  const currentStatus = latestOrderForCurrentConfirmation?.status ?? "Nouvelle";
  const activeStepIndex = useMemo(() => getActiveStepIndex(currentStatus), [currentStatus]);
  const currentStatusContent = customerStatusContent[currentStatus];
  const paymentBadgeLabel = getPaymentBadgeLabel(currentStatus);

  if (!order) {
    return null;
  }

  const confirmedOrder = order;
  const reviewOrder = latestOrderForCurrentConfirmation ?? confirmedOrder;

  function resetReviewForm() {
    setIsReviewFormOpen(false);
    setSelectedRating(null);
    setReviewComment("");
    setReviewCustomerName("");
    setReviewError(null);
  }

  function handleOpenReviewForm() {
    setReviewError(null);
    setIsReviewFormOpen(true);
  }

  function handleSubmitReview() {
    if (!selectedRating) {
      setReviewError("Sélectionnez une note avant d’envoyer votre avis.");
      return;
    }

    const alreadySubmitted = getLocalReviews().some((review) => review.orderNumber === confirmedOrder.orderNumber);

    if (alreadySubmitted) {
      setHasSubmittedReview(true);
      resetReviewForm();
      return;
    }

    const submittedReview = addLocalReview(createLocalReview({
      customerName: reviewCustomerName,
      rating: selectedRating,
      comment: reviewComment,
      restaurantSlug: "restaurantSlug" in reviewOrder ? reviewOrder.restaurantSlug : "le-bistrot-des-halles",
      restaurantName: "restaurantName" in reviewOrder ? reviewOrder.restaurantName : "Le Bistrot des Halles",
      tableId: "tableId" in reviewOrder ? reviewOrder.tableId : confirmedOrder.tableName.toLowerCase().replaceAll(" ", "-"),
      tableName: reviewOrder.tableName,
      orderNumber: reviewOrder.orderNumber,
    }));

    setSubmittedReviewRating(submittedReview.rating);
    setHasSubmittedReview(true);
    resetReviewForm();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-emerald-950/60 px-3 pb-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
    >
      <div className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-[2.25rem] bg-white p-5 shadow-2xl md:rounded-[2.25rem]">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-emerald-50 to-white p-5 text-center ring-1 ring-emerald-100">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-700 text-3xl font-black text-white shadow-xl shadow-emerald-700/25">
            ✓
          </div>
          <h2 id="order-confirmation-title" className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950">
            Commande confirmée
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Votre commande a bien été transmise au restaurant.
          </p>
          <p className="mt-2 text-sm font-bold text-emerald-800">
            Un membre de l’équipe va la prendre en charge.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Numéro</p>
            <p className="mt-2 text-xl font-black text-slate-950">{order.orderNumber}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Table</p>
            <p className="mt-2 text-xl font-black text-slate-950">{order.tableName}</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-black text-slate-950">Total</p>
            <p className="text-xl font-black text-emerald-800">{formatEuro(order.total)}</p>
          </div>
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.note ?? ""}`} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-extrabold text-slate-900">
                    {item.quantity} × {item.name}
                  </p>
                  {item.note ? <p className="mt-1 text-slate-500">Note : {item.note}</p> : null}
                </div>
                <p className="font-black text-slate-700">{formatEuro(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-4 rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-4 shadow-sm shadow-emerald-950/5" aria-labelledby="order-tracking-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Suivi en direct</p>
              <h3 id="order-tracking-title" className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950">
                Votre commande au restaurant
              </h3>
            </div>
            <button
              type="button"
              onClick={refreshOrderStatus}
              className="rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-black text-emerald-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              Actualiser
            </button>
          </div>

          <div className="mt-4 rounded-3xl border border-white bg-white/95 p-4 shadow-sm shadow-emerald-950/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Suivi en direct</p>
                <p className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950">{currentStatusContent.title}</p>
              </div>
              {paymentBadgeLabel ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-right">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-emerald-700">Règlement</p>
                  <p className="mt-0.5 text-sm font-black text-emerald-950">{paymentBadgeLabel}</p>
                </div>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{currentStatusContent.message}</p>
          </div>

          {isStoppedStatus(currentStatus) ? (
            <div className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
              <p className="font-black">Nous restons à votre disposition.</p>
              <p className="mt-1">Vous pouvez vous rapprocher de l’équipe en salle pour toute question.</p>
            </div>
          ) : (
            <ol className="mt-5 grid grid-cols-4 gap-3" aria-label="Progression de la commande">
              {trackingSteps.map((step, index) => {
                const isCompleted = activeStepIndex >= 0 && index < activeStepIndex;
                const isCurrent = index === activeStepIndex;
                const isHighlighted = isCompleted || isCurrent;

                return (
                  <li key={step.label} className="min-w-0">
                    <div
                      className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-sm font-black transition ${
                        isHighlighted ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20" : "bg-slate-100 text-slate-400"
                      }`}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <p className={`mt-2 text-center text-[0.72rem] font-black leading-4 ${isHighlighted ? "text-slate-900" : "text-slate-400"}`}>
                      {step.label}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}

          {currentStatus === "Servie" ? (
            <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-800 p-5 text-white shadow-lg shadow-emerald-800/15">
              {hasSubmittedReview ? (
                <>
                  <p className="text-lg font-black tracking-[-0.03em]">Merci pour votre avis</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50">Merci, votre avis a bien été transmis.</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-black tracking-[-0.03em]">Merci pour votre visite</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50">Quand vous aurez terminé, votre avis nous aide à améliorer l’expérience.</p>
                  <p className="mt-1 text-sm leading-6 text-emerald-50">Cela ne prend que quelques secondes.</p>
                  <button
                    type="button"
                    onClick={handleOpenReviewForm}
                    className="mt-4 min-h-12 rounded-2xl bg-white px-5 text-sm font-black text-emerald-900 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-50"
                  >
                    Laisser un avis
                  </button>
                </>
              )}
            </div>
          ) : null}
        </section>

        <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <p className="font-black">Paiement au restaurant</p>
          <p className="mt-1">{paymentNote}</p>
        </div>

        {submittedReviewRating ? (
          <div className="mt-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-950/5">
            <p className="text-xl font-black tracking-[-0.03em] text-slate-950">Merci pour votre avis</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Votre retour a bien été transmis au restaurant.</p>
            <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-900">
              {submittedReviewRating >= 4
                ? "Votre expérience semble positive. Le restaurant pourra vous proposer de partager votre avis publiquement."
                : "Merci pour votre retour. L’équipe pourra en tenir compte pour améliorer l’expérience."}
            </p>
            <button type="button" onClick={onBackToMenu} className="mt-4 min-h-12 w-full rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20">
              Retour au menu
            </button>
          </div>
        ) : null}

        {isReviewFormOpen ? (
          <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 px-3 pb-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="customer-review-title">
            <div className="w-full max-w-[460px] rounded-t-[2rem] bg-white p-5 shadow-2xl md:rounded-[2rem]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Avis après repas</p>
                  <h3 id="customer-review-title" className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">Comment s’est passée votre expérience ?</h3>
                </div>
                <button type="button" onClick={resetReviewForm} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-xl font-black text-slate-500" aria-label="Fermer le formulaire d’avis">×</button>
              </div>

              <div className="mt-5" aria-label="Choisir une note">
                <p className="text-sm font-black text-slate-800">Votre note</p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => {
                        setSelectedRating(rating as LocalReviewRating);
                        setReviewError(null);
                      }}
                      className={`min-h-14 rounded-2xl border text-3xl font-black transition ${
                        selectedRating && rating <= selectedRating ? "border-amber-200 bg-amber-100 text-amber-600 shadow-lg shadow-amber-500/10" : "border-slate-200 bg-slate-50 text-slate-300"
                      }`}
                      aria-label={`${rating} étoile${rating > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-5 block text-sm font-black text-slate-800" htmlFor="review-comment">
                Votre retour
              </label>
              <textarea
                id="review-comment"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Partagez votre retour en quelques mots..."
                className="mt-2 min-h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <label className="mt-4 block text-sm font-black text-slate-800" htmlFor="review-first-name">
                Votre prénom <span className="font-semibold text-slate-400">(facultatif)</span>
              </label>
              <input
                id="review-first-name"
                value={reviewCustomerName}
                onChange={(event) => setReviewCustomerName(event.target.value)}
                placeholder="Ex : Camille"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              {reviewError ? <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{reviewError}</p> : null}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={resetReviewForm} className="min-h-12 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-700">Plus tard</button>
                <button type="button" onClick={handleSubmitReview} className="min-h-12 rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20">Envoyer mon avis</button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" onClick={onBackToMenu} className="min-h-12 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-700">
            Retour au menu
          </button>
          <button type="button" onClick={onNewOrder} className="min-h-12 rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20">
            Nouvelle commande
          </button>
        </div>
      </div>
    </div>
  );
}
