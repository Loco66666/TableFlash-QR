"use client";

import { useCallback, useEffect, useState } from "react";

import { formatEuro } from "@/lib/formatters";
import {
  addLocalReview,
  createLocalReview,
  hasLocalReviewForOrder,
  type LocalReviewRating,
} from "@/lib/localReviews";
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
  onBackToMenu: () => void;
  onNewOrder: () => void;
};

type TrackingStep = {
  label: string;
};

type TrackingStepState = "completed" | "current" | "upcoming";

type CustomerStatusContent = {
  title: string;
  message: string;
  nextStep: string;
};

const customerStatusContent: Record<LocalOrderStatus, CustomerStatusContent> = {
  Nouvelle: {
    title: "Commande reçue",
    message: "Votre commande a été transmise au restaurant.",
    nextStep: "Le règlement se fait à la caisse ou auprès du serveur.",
  },
  Acceptée: {
    title: "Commande validée",
    message: "L’équipe a bien pris votre commande en compte.",
    nextStep: "Le règlement sera confirmé avant le lancement en préparation.",
  },
  "À payer": {
    title: "Règlement sur place",
    message: "Vous pouvez régler à la caisse ou auprès du serveur.",
    nextStep: "Une fois le règlement confirmé, la préparation pourra commencer.",
  },
  Payée: {
    title: "Règlement confirmé",
    message: "Votre règlement a été pris en compte.",
    nextStep: "La préparation peut démarrer.",
  },
  "En préparation": {
    title: "En préparation",
    message: "L’équipe prépare actuellement votre commande.",
    nextStep: "Vous serez informé lorsque votre commande sera prête.",
  },
  Prête: {
    title: "Commande prête",
    message: "Votre commande est prête à être servie.",
    nextStep: "Un membre de l’équipe va vous l’apporter.",
  },
  Servie: {
    title: "Commande servie",
    message:
      "Merci pour votre commande. Nous espérons que vous avez passé un agréable moment.",
    nextStep:
      "Quand vous aurez terminé, votre avis nous aide à améliorer l’expérience.",
  },
  Refusée: {
    title: "Commande non retenue",
    message: "La commande n’a pas pu être prise en charge par le restaurant.",
    nextStep: "Rapprochez-vous de l’équipe en salle pour choisir une alternative.",
  },
  Annulée: {
    title: "Commande annulée",
    message: "Cette commande a été annulée.",
    nextStep: "L’équipe reste disponible si vous souhaitez repasser commande.",
  },
};

const trackingSteps: TrackingStep[] = [
  { label: "Commande" },
  { label: "Validation" },
  { label: "Règlement" },
  { label: "Préparation" },
  { label: "Service" },
];

function findLatestOrder(orderNumber: string): LocalSubmittedOrder | null {
  return (
    getLocalOrders().find(
      (localOrder) => localOrder.orderNumber === orderNumber,
    ) ?? null
  );
}

function getTrackingStepState(
  status: LocalOrderStatus,
  index: number,
): TrackingStepState {
  const completedStepCountByStatus: Record<LocalOrderStatus, number> = {
    Nouvelle: 0,
    Acceptée: 1,
    "À payer": 2,
    Payée: 3,
    "En préparation": 3,
    Prête: 4,
    Servie: 5,
    Refusée: 0,
    Annulée: 0,
  };
  const currentStepIndexByStatus: Partial<Record<LocalOrderStatus, number>> = {
    Nouvelle: 0,
    Acceptée: 1,
    "À payer": 2,
    "En préparation": 3,
  };

  const currentStepIndex = currentStepIndexByStatus[status];

  if (currentStepIndex === index) {
    return "current";
  }

  if (index < completedStepCountByStatus[status]) {
    return "completed";
  }

  return "upcoming";
}

function isStoppedStatus(status: LocalOrderStatus) {
  return status === "Refusée" || status === "Annulée";
}

function getPaymentBadgeLabel(status: LocalOrderStatus) {
  if (["Refusée", "Annulée"].includes(status)) {
    return null;
  }

  if (["Payée", "En préparation", "Prête", "Servie"].includes(status)) {
    return "Règlement confirmé";
  }

  return "À régler sur place";
}

function isPaymentPending(status: LocalOrderStatus) {
  return ![
    "Payée",
    "En préparation",
    "Prête",
    "Servie",
    "Refusée",
    "Annulée",
  ].includes(status);
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/80 px-3 py-2.5 ring-1 ring-emerald-100/80">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-emerald-700/75">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">
        {value}
      </p>
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
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  const refreshOrderStatus = useCallback(() => {
    if (!order) {
      setLatestOrder(null);
      return;
    }

    setLatestOrder(findLatestOrder(order.orderNumber));
    setHasSubmittedReview(hasLocalReviewForOrder(order.orderNumber));
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
  const currentStatusContent = customerStatusContent[currentStatus];
  const paymentBadgeLabel = getPaymentBadgeLabel(currentStatus);
  const paymentIsPending = isPaymentPending(currentStatus);
  const reviewIsAvailable = currentStatus === "Servie";
  const reviewWasSubmitted = reviewIsAvailable && hasSubmittedReview;

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
      setHasSubmittedReview(true);
      resetReviewForm();
      return;
    }

    addLocalReview(
      createLocalReview({
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
      }),
    );

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
                Commande reçue
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-emerald-50">
                Votre commande a bien été transmise à l’équipe.
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-100/90">
                Vous pouvez suivre son avancement ici. L’équipe va la valider
                dans quelques instants.
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
                {currentStatusContent.title}
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
                {currentStatusContent.message}
              </p>
              {paymentBadgeLabel ? (
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-3 py-2 text-xs font-black ${paymentIsPending ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200" : "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"}`}
                >
                  {paymentBadgeLabel}
                </span>
              ) : null}
            </div>

            <p
              className={`mt-4 rounded-2xl px-3 py-2 text-sm font-black ${paymentIsPending ? "bg-amber-50 text-amber-900 ring-1 ring-amber-100" : "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100"}`}
            >
              {paymentIsPending
                ? "Règlement à effectuer sur place."
                : "Règlement confirmé."}
            </p>

            <div
              className={`mt-4 rounded-2xl p-3 text-sm font-bold leading-6 ${paymentIsPending ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-900"}`}
            >
              <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] opacity-70">
                Prochaine étape
              </p>
              <p className="mt-1">{currentStatusContent.nextStep}</p>
            </div>
          </div>

          {isStoppedStatus(currentStatus) ? (
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
              {trackingSteps.map((step, index) => {
                const stepState = getTrackingStepState(currentStatus, index);
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
                      {isCompleted ? "✓" : index + 1}
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

          {reviewIsAvailable ? (
            <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-800 p-5 text-white shadow-lg shadow-emerald-800/15">
              {reviewWasSubmitted ? (
                <>
                  <p className="text-lg font-black tracking-[-0.03em]">
                    Merci pour votre avis
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50">
                    Votre retour a bien été transmis au restaurant.
                  </p>
                  <button
                    type="button"
                    onClick={onBackToMenu}
                    className="mt-4 min-h-12 rounded-2xl bg-white px-5 text-sm font-black text-emerald-900 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-50"
                  >
                    Retour au menu
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-black tracking-[-0.03em]">
                    Merci pour votre visite
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50">
                    Quand vous aurez terminé, votre avis nous aide à améliorer
                    l’expérience.
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-100">
                    Cela ne prend que quelques secondes.
                  </p>
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

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onBackToMenu}
            className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
          >
            Retour au menu
          </button>
          <button
            type="button"
            onClick={onNewOrder}
            className="min-h-12 rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20"
          >
            Nouvelle commande
          </button>
        </div>
      </div>
    </div>
  );
}
