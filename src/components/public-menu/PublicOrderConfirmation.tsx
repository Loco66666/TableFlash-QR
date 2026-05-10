"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { formatEuro } from "@/lib/formatters";
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

const customerStatusLabels: Record<LocalOrderStatus, string> = {
  Nouvelle: "Commande envoyée",
  Acceptée: "Acceptée",
  "À payer": "À régler",
  Payée: "Règlement confirmé",
  "En préparation": "En préparation",
  Prête: "Prête",
  Servie: "Servie",
  Refusée: "Commande refusée",
  Annulée: "Commande annulée",
};

const customerStatusGuidance: Record<LocalOrderStatus, string> = {
  Nouvelle: "Le restaurant va prendre en charge votre commande.",
  Acceptée: "Votre commande a été acceptée par le restaurant.",
  "À payer": "Le règlement se fera à la caisse ou auprès du serveur.",
  Payée: "Votre règlement est confirmé. La commande va être préparée.",
  "En préparation": "L’équipe prépare votre commande.",
  Prête: "Votre commande est prête à être servie.",
  Servie: "Bon appétit.",
  Refusée: "La commande n’a pas pu être prise en charge.",
  Annulée: "La commande a été annulée.",
};

const customerPaymentLabels: Record<LocalOrderStatus, string> = {
  Nouvelle: "En attente de prise en charge",
  Acceptée: "En attente de prise en charge",
  "À payer": "À régler sur place",
  Payée: "Règlement confirmé",
  "En préparation": "Règlement confirmé",
  Prête: "Règlement confirmé",
  Servie: "Règlement confirmé",
  Refusée: "Commande interrompue",
  Annulée: "Commande interrompue",
};

const trackingSteps: TrackingStep[] = [
  { label: "Commande envoyée", statuses: ["Nouvelle"] },
  { label: "Acceptée", statuses: ["Acceptée"] },
  { label: "À régler", statuses: ["À payer"] },
  { label: "Règlement confirmé", statuses: ["Payée"] },
  { label: "En préparation", statuses: ["En préparation"] },
  { label: "Prête", statuses: ["Prête"] },
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

export function PublicOrderConfirmation({ order, paymentNote, onBackToMenu, onNewOrder }: PublicOrderConfirmationProps) {
  const [latestOrder, setLatestOrder] = useState<LocalSubmittedOrder | null>(null);

  const refreshOrderStatus = useCallback(() => {
    if (!order) {
      setLatestOrder(null);
      return;
    }

    setLatestOrder(findLatestOrder(order.orderNumber));
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

  if (!order) {
    return null;
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">En direct</p>
              <h3 id="order-tracking-title" className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950">
                Suivi de votre commande
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

          <div className="mt-4 rounded-3xl border border-white bg-white/90 p-4 shadow-sm shadow-emerald-950/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Étape actuelle</p>
                <p className="mt-1 text-sm font-black text-emerald-800">{customerStatusLabels[currentStatus]}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-right">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-emerald-700">Règlement</p>
                <p className="mt-0.5 text-sm font-black text-emerald-950">{customerPaymentLabels[currentStatus]}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{customerStatusGuidance[currentStatus]}</p>
          </div>

          {isStoppedStatus(currentStatus) ? (
            <div className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
              <p className="font-black">Nous restons à votre disposition.</p>
              <p className="mt-1">Vous pouvez vous rapprocher de l’équipe en salle pour toute question.</p>
            </div>
          ) : (
            <ol className="mt-4 grid grid-cols-7 gap-1" aria-label="Progression de la commande">
              {trackingSteps.map((step, index) => {
                const isCompleted = activeStepIndex >= 0 && index < activeStepIndex;
                const isCurrent = index === activeStepIndex;
                const isHighlighted = isCompleted || isCurrent;

                return (
                  <li key={step.label} className="min-w-0">
                    <div
                      className={`mx-auto grid h-7 w-7 place-items-center rounded-full text-[0.68rem] font-black transition ${
                        isHighlighted ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20" : "bg-slate-100 text-slate-400"
                      }`}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <p className={`mt-2 text-center text-[0.56rem] font-black leading-[0.7rem] ${isHighlighted ? "text-slate-900" : "text-slate-400"}`}>
                      {step.label}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <p className="font-black">Paiement au restaurant</p>
          <p className="mt-1">{paymentNote}</p>
        </div>

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
