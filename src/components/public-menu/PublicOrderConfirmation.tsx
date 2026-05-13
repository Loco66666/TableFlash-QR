"use client";

import { useCallback, useEffect, useState } from "react";

import { formatEuro } from "@/lib/formatters";
import {
  addLocalReview,
  createLocalReview,
  findLocalReviewByOrderNumber,
  hasLocalReviewForOrder,
  type LocalReviewRating,
  type LocalSubmittedReview,
} from "@/lib/localReviews";
import {
  getLocalOrders,
  LOCAL_ORDER_CREATED_EVENT,
  LOCAL_ORDER_RESET_EVENT,
  LOCAL_ORDER_UPDATED_EVENT,
  LOCAL_ORDERS_STORAGE_KEY,
  type LocalSubmittedOrder,
} from "@/lib/localOrders";
import { getLocalRestaurantSettings } from "@/lib/localRestaurantSettings";

import {
  getPublicOrderPresentation,
  getPublicTrackingStepState,
  publicTrackingSteps,
} from "./orderPresentation";
import type { ConfirmedOrder } from "./types";

type PublicOrderConfirmationProps = {
  order: ConfirmedOrder | null;
  onBackToMenu: () => void;
  onNewOrder: () => void;
};

const REVIEW_INVITE_TEXT =
  "Votre retour est le bienvenu si vous souhaitez partager votre expérience.";
const GOOGLE_REVIEW_INVITE_TEXT =
  "Si vous le souhaitez, vous pouvez aussi partager votre expérience sur Google.";

function findLatestOrder(orderNumber: string): LocalSubmittedOrder | null {
  return (
    getLocalOrders().find(
      (localOrder) => localOrder.orderNumber === orderNumber,
    ) ?? null
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/80 px-3 py-2.5 ring-1 ring-emerald-100/80">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-emerald-700/75">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <p className="font-bold text-slate-500">{label}</p>
      <p className="text-right font-black text-slate-950">{value}</p>
    </div>
  );
}

export function PublicOrderConfirmation({
  order,
  onBackToMenu,
  onNewOrder,
}: PublicOrderConfirmationProps) {
  const [latestOrder, setLatestOrder] = useState<LocalSubmittedOrder | null>(
    null,
  );
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] =
    useState<LocalReviewRating | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewCustomerName, setReviewCustomerName] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [submittedReview, setSubmittedReview] =
    useState<LocalSubmittedReview | null>(null);

  const refreshOrderStatus = useCallback(() => {
    if (!order) {
      setLatestOrder(null);
      return;
    }

    setLatestOrder(findLatestOrder(order.orderNumber));
    setSubmittedReview(findLocalReviewByOrderNumber(order.orderNumber));
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

  const latestOrderForCurrentConfirmation =
    order && latestOrder?.orderNumber === order.orderNumber
      ? latestOrder
      : null;
  const currentStatus = latestOrderForCurrentConfirmation?.status ?? "Nouvelle";
  const currentPaymentStatus =
    latestOrderForCurrentConfirmation?.paymentStatus ?? "À payer";
  const orderPresentation = getPublicOrderPresentation({
    status: currentStatus,
    paymentStatus: currentPaymentStatus,
    hasSubmittedReview: Boolean(submittedReview),
  });
  const paymentIsPending = currentPaymentStatus === "À payer";
  const restaurantSettings = getLocalRestaurantSettings();
  const googleReviewUrl = restaurantSettings.googleReviewUrl.trim();
  const canSuggestGoogleReview =
    orderPresentation.showReviewThanks &&
    submittedReview !== null &&
    submittedReview.rating >= 4 &&
    googleReviewUrl.length > 0 &&
    restaurantSettings.suggestGoogleForPositiveReviews;
  const shouldShowOperationalPill =
    Boolean(orderPresentation.operationalLabel) &&
    orderPresentation.operationalLabel !== orderPresentation.displayTitle;
  const shouldShowPaymentPill =
    Boolean(orderPresentation.paymentLabel) &&
    orderPresentation.paymentLabel !== orderPresentation.displayTitle;

  if (!order) {
    return null;
  }

  const confirmedOrder = order;
  const reviewOrder = latestOrderForCurrentConfirmation ?? confirmedOrder;
  const customerNote =
    latestOrderForCurrentConfirmation?.customerNote.trim() ||
    confirmedOrder.customerNote?.trim() ||
    "";

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

    const alreadySubmitted = hasLocalReviewForOrder(confirmedOrder.orderNumber);

    if (alreadySubmitted) {
      setSubmittedReview(
        findLocalReviewByOrderNumber(confirmedOrder.orderNumber),
      );
      resetReviewForm();
      return;
    }

    const nextReview = createLocalReview({
      customerName: reviewCustomerName,
      rating: selectedRating,
      comment: reviewComment,
      restaurantSlug:
        "restaurantSlug" in reviewOrder
          ? reviewOrder.restaurantSlug
          : "le-bistrot-des-halles",
      restaurantName:
        "restaurantName" in reviewOrder
          ? reviewOrder.restaurantName
          : "Le Bistrot des Halles",
      tableId:
        "tableId" in reviewOrder
          ? reviewOrder.tableId
          : confirmedOrder.tableName.toLowerCase().replaceAll(" ", "-"),
      tableName: reviewOrder.tableName,
      orderNumber: reviewOrder.orderNumber,
    });

    addLocalReview(nextReview);
    setSubmittedReview(nextReview);
    resetReviewForm();
  }

  function handleOpenGoogleReview() {
    if (!googleReviewUrl) {
      return;
    }

    window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-emerald-950/60 px-3 pb-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
    >
      <div className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-[2.25rem] bg-[#FBFDFB] p-4 shadow-2xl md:rounded-[2.25rem] md:p-5">
        <section className="rounded-[1.9rem] bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-950 p-5 text-white shadow-xl shadow-emerald-950/20">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15 text-2xl font-black ring-1 ring-white/25">
              ✓
            </div>
            <div className="min-w-0">
              <h2
                id="order-confirmation-title"
                className="text-3xl font-black tracking-[-0.055em]"
              >
                Commande {order.orderNumber}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-emerald-50">
                Votre reçu et le suivi en direct restent disponibles ici.
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-100/90">
                Les informations ci-dessous évoluent avec l’avancement du
                service.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <DetailPill label="Commande" value={order.orderNumber} />
            <DetailPill label="Table" value={order.tableName} />
            <DetailPill label="Total" value={formatEuro(order.total)} />
          </div>
        </section>

        <section className="mt-4 rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm shadow-emerald-950/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Résumé de commande
              </p>
              <h3 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950">
                Votre reçu
              </h3>
            </div>
            <p className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500 ring-1 ring-slate-100">
              {order.items.length} produit{order.items.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-4 space-y-2.5 border-y border-dashed border-slate-200 py-4">
            <ReceiptLine label="Commande" value={order.orderNumber} />
            <ReceiptLine label="Table" value={order.tableName} />
          </div>

          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.note ?? ""}`}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-black text-slate-900">
                    {item.quantity} × {item.name}
                  </p>
                  {item.note ? (
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Note : {item.note}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 font-black text-slate-700">
                  {formatEuro(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {customerNote ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
              <span className="font-black text-slate-800">Note : </span>
              {customerNote}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <p className="font-black text-slate-950">Total</p>
            <p className="text-2xl font-black tracking-[-0.04em] text-emerald-800">
              {formatEuro(order.total)}
            </p>
          </div>
        </section>

        <section
          className="mt-4 rounded-[1.9rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-4 shadow-sm shadow-emerald-950/5"
          aria-labelledby="order-tracking-title"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Suivi de commande
              </p>
              <h3
                id="order-tracking-title"
                className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950"
              >
                {orderPresentation.displayTitle}
              </h3>
            </div>
            <button
              type="button"
              onClick={refreshOrderStatus}
              className="shrink-0 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-black text-emerald-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              Actualiser
            </button>
          </div>

          <div className="mt-4 rounded-[1.45rem] bg-white/95 p-4 shadow-sm shadow-emerald-950/5 ring-1 ring-emerald-100/70">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-sm leading-6 text-slate-600">
                {orderPresentation.displaySubtitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {shouldShowOperationalPill ? (
                  <span className="inline-flex max-w-full items-center rounded-full bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-900 ring-1 ring-emerald-200">
                    {orderPresentation.operationalLabel}
                  </span>
                ) : null}
                {shouldShowPaymentPill ? (
                  <span
                    className={`inline-flex max-w-full items-center rounded-full px-3 py-2 text-xs font-black ${paymentIsPending ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200" : "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"}`}
                  >
                    {orderPresentation.paymentLabel}
                  </span>
                ) : null}
              </div>
            </div>

            {orderPresentation.showPaymentReminder ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900 ring-1 ring-amber-100">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] opacity-70">
                  Règlement sur place
                </p>
                <p className="mt-1">
                  Le règlement pourra se faire à la caisse ou auprès du serveur.
                </p>
              </div>
            ) : null}

            {orderPresentation.nextStepLabel ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700 ring-1 ring-slate-100">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-500">
                  Prochaine étape
                </p>
                <p className="mt-1">{orderPresentation.nextStepLabel}</p>
              </div>
            ) : null}
          </div>

          {orderPresentation.isStopped ? (
            <div className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
              <p className="font-black">Nous restons à votre disposition.</p>
              <p className="mt-1">
                Vous pouvez vous rapprocher de l’équipe en salle pour toute
                question.
              </p>
            </div>
          ) : (
            <ol
              className="mt-5 grid grid-cols-5 gap-1.5 rounded-[1.35rem] bg-white/70 p-3 ring-1 ring-emerald-100/60"
              aria-label="Progression de la commande"
            >
              {publicTrackingSteps.map((step, index) => {
                const stepNumber = index + 1;
                const stepState = getPublicTrackingStepState(
                  orderPresentation,
                  stepNumber,
                );
                const isCompleted = stepState === "completed";
                const isCurrent = stepState === "current";
                const isHighlighted = isCompleted || isCurrent;

                return (
                  <li key={step.label} className="min-w-0">
                    <div
                      className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-black transition ${
                        isCompleted
                          ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20"
                          : isCurrent
                            ? "bg-white text-emerald-800 ring-2 ring-emerald-600 shadow-lg shadow-emerald-700/10"
                            : "bg-slate-100 text-slate-400"
                      }`}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isCompleted ? "✓" : stepNumber}
                    </div>
                    <p
                      className={`mt-2 text-center text-[0.62rem] font-black leading-4 sm:text-[0.66rem] ${isHighlighted ? "text-slate-900" : "text-slate-400"}`}
                    >
                      {step.label}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}

          {orderPresentation.showReviewInvite ||
          orderPresentation.showReviewThanks ? (
            <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-800 p-5 text-white shadow-lg shadow-emerald-800/15">
              {orderPresentation.showReviewThanks ? (
                <>
                  <p className="text-lg font-black tracking-[-0.03em]">
                    Merci pour votre retour
                  </p>
                  {canSuggestGoogleReview ? (
                    <p className="mt-2 text-sm leading-6 text-emerald-50">
                      {GOOGLE_REVIEW_INVITE_TEXT}
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-sm leading-6 text-emerald-50">
                        Votre avis a bien été transmis au restaurant.
                      </p>
                      {submittedReview && submittedReview.rating <= 3 ? (
                        <p className="mt-1 text-sm font-semibold leading-6 text-emerald-100">
                          L’équipe pourra en tenir compte pour améliorer
                          l’expérience.
                        </p>
                      ) : null}
                    </>
                  )}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {canSuggestGoogleReview ? (
                      <button
                        type="button"
                        onClick={handleOpenGoogleReview}
                        className="min-h-12 rounded-2xl bg-white px-5 text-sm font-black text-emerald-900 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-50"
                      >
                        Donner un avis sur Google
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={onBackToMenu}
                      className="min-h-12 rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/15"
                    >
                      {canSuggestGoogleReview ? "Plus tard" : "Retour au menu"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-black tracking-[-0.03em]">
                    Merci pour votre visite
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50">
                    {REVIEW_INVITE_TEXT}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-100">
                    Vous pouvez le faire maintenant ou plus tard.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleOpenReviewForm}
                      className="min-h-12 rounded-2xl bg-white px-5 text-sm font-black text-emerald-900 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-50"
                    >
                      Laisser un avis
                    </button>
                    <button
                      type="button"
                      onClick={onBackToMenu}
                      className="min-h-12 rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/15"
                    >
                      Plus tard
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </section>

        {isReviewFormOpen ? (
          <div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 px-3 pb-3 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-review-title"
          >
            <div className="w-full max-w-[460px] rounded-t-[2rem] bg-white p-5 shadow-2xl md:rounded-[2rem]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    Avis après repas
                  </p>
                  <h3
                    id="customer-review-title"
                    className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950"
                  >
                    Comment s’est passée votre expérience ?
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={resetReviewForm}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-xl font-black text-slate-500"
                  aria-label="Fermer le formulaire d’avis"
                >
                  ×
                </button>
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
                        selectedRating && rating <= selectedRating
                          ? "border-amber-200 bg-amber-100 text-amber-600 shadow-lg shadow-amber-500/10"
                          : "border-slate-200 bg-slate-50 text-slate-300"
                      }`}
                      aria-label={`${rating} étoile${rating > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <label
                className="mt-5 block text-sm font-black text-slate-800"
                htmlFor="review-comment"
              >
                Votre retour
              </label>
              <textarea
                id="review-comment"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Partagez votre retour en quelques mots..."
                className="mt-2 min-h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <label
                className="mt-4 block text-sm font-black text-slate-800"
                htmlFor="review-first-name"
              >
                Votre prénom{" "}
                <span className="font-semibold text-slate-400">
                  (facultatif)
                </span>
              </label>
              <input
                id="review-first-name"
                value={reviewCustomerName}
                onChange={(event) => setReviewCustomerName(event.target.value)}
                placeholder="Ex : Camille"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              {reviewError ? (
                <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
                  {reviewError}
                </p>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={resetReviewForm}
                  className="min-h-12 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-700"
                >
                  Plus tard
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="min-h-12 rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20"
                >
                  Envoyer mon avis
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {orderPresentation.showBottomActions ? (
          <div
            className={`mt-5 grid grid-cols-1 gap-3 ${orderPresentation.showReviewInvite || orderPresentation.showReviewThanks ? "" : "sm:grid-cols-2"}`}
          >
            {orderPresentation.showReviewInvite ||
            orderPresentation.showReviewThanks ? null : (
              <button
                type="button"
                onClick={onBackToMenu}
                className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
              >
                Retour au menu
              </button>
            )}
            <button
              type="button"
              onClick={onNewOrder}
              className="min-h-12 rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20"
            >
              Nouvelle commande
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
