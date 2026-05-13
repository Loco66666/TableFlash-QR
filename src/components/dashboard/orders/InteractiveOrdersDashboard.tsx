"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DashboardHeader } from "@/components/dashboard";
import { formatEuro, parseEuroInput } from "@/lib/formatters";
import {
  clearLocalOrders,
  getLocalOrders,
  LOCAL_ORDER_CREATED_EVENT,
  LOCAL_ORDER_RESET_EVENT,
  LOCAL_ORDER_UPDATED_EVENT,
  LOCAL_ORDERS_STORAGE_KEY,
  mapLocalOrderToDashboardOrder,
  updateLocalOrder,
} from "@/lib/localOrders";

import { EmptyOrdersState } from "./EmptyOrdersState";
import { LiveServiceStatusCard } from "./LiveServiceStatusCard";
import { OrderCard } from "./OrderCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { PaymentReminderCard } from "./PaymentReminderCard";
import { PreparationTimeWidget } from "./PreparationTimeWidget";
import { SelectedOrderPanel } from "./SelectedOrderPanel";
import { TopProductsWidget } from "./TopProductsWidget";
import { getOrderActions, orders as initialOrders } from "./ordersData";
import type { Order, OrderAction, OrderFilter, OrderStatus, PaymentStatus, SummaryTone } from "./ordersData";

type SummaryCard = {
  helper: string;
  label: string;
  tone: SummaryTone;
  value: string;
};

type ToastState = {
  id: number;
  message: string;
};

const completedStatuses: OrderStatus[] = ["Servie", "Refusée", "Annulée"];
const activeStatusPriority: OrderStatus[] = ["Nouvelle", "Acceptée", "À payer", "Payée", "En préparation", "Prête"];

const actionMessages: Partial<Record<OrderAction, string>> = {
  Accepter: "Commande acceptée.",
  Refuser: "Commande refusée.",
  "Marquer à régler": "Commande marquée à régler.",
  "Marquer payé": "Paiement confirmé.",
  "Lancer en préparation": "Préparation lancée.",
  "Marquer prête": "Commande prête à servir.",
  "Marquer servie": "Commande marquée comme servie.",
};

export function InteractiveOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrders[0]?.orderNumber ?? null);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [servicePaused, setServicePaused] = useState(false);
  const [successMessage, setSuccessMessage] = useState<ToastState | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const autoCloseTimeoutRef = useRef<number | null>(null);

  const visibleOrders = useMemo(() => filterOrders(orders, activeFilter, searchQuery), [activeFilter, orders, searchQuery]);

  useEffect(() => {
    function refreshLocalOrders() {
      const submittedOrders = getLocalOrders();

      setOrders((currentOrders) => mergeSubmittedLocalOrders(currentOrders, submittedOrders.map(mapLocalOrderToDashboardOrder)));
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === LOCAL_ORDERS_STORAGE_KEY) {
        refreshLocalOrders();
      }
    }

    refreshLocalOrders();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCAL_ORDER_CREATED_EVENT, refreshLocalOrders);
    window.addEventListener(LOCAL_ORDER_UPDATED_EVENT, refreshLocalOrders);
    window.addEventListener(LOCAL_ORDER_RESET_EVENT, refreshLocalOrders);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOCAL_ORDER_CREATED_EVENT, refreshLocalOrders);
      window.removeEventListener(LOCAL_ORDER_UPDATED_EVENT, refreshLocalOrders);
      window.removeEventListener(LOCAL_ORDER_RESET_EVENT, refreshLocalOrders);
    };
  }, []);

  useEffect(() => () => {
    if (autoCloseTimeoutRef.current) {
      window.clearTimeout(autoCloseTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const selectedOrder = selectedOrderId ? visibleOrders.find((order) => order.orderNumber === selectedOrderId) ?? null : null;
  const effectiveSelectedOrderId = selectedOrder?.orderNumber ?? null;
  const selectedActions = selectedOrder ? getOrderActions(selectedOrder.status) : [];
  const summaryCards = useMemo(() => buildSummaryCards(orders), [orders]);
  const topProducts = useMemo(() => buildTopProducts(orders), [orders]);

  function showToast(message: string) {
    setSuccessMessage({ id: Date.now(), message });
  }

  function handleCloseSelectedOrder() {
    if (autoCloseTimeoutRef.current) {
      window.clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }

    setSelectedOrderId(null);
  }

  function updateOrderStatus(orderNumber: string, nextStatus: OrderStatus, nextPaymentStatus?: PaymentStatus) {
    const nextOrders = orders.map((order) => {
      if (order.orderNumber !== orderNumber) {
        return order;
      }

      return {
        ...order,
        status: nextStatus,
        paymentStatus: nextPaymentStatus ?? order.paymentStatus,
        acceptedAt: nextStatus === "Acceptée" ? order.acceptedAt ?? new Date().toISOString() : order.acceptedAt,
        preparationStartedAt: nextStatus === "En préparation" ? order.preparationStartedAt ?? new Date().toISOString() : order.preparationStartedAt,
        mockElapsedMinutes: nextStatus === "En préparation" ? Math.max(order.mockElapsedMinutes, 1) : order.mockElapsedMinutes,
      };
    });

    setOrders(nextOrders);

    const updatedOrder = nextOrders.find((order) => order.orderNumber === orderNumber);

    if (updatedOrder?.source === "public-menu") {
      updateLocalOrder(orderNumber, {
        status: nextStatus,
        paymentStatus: nextPaymentStatus ?? updatedOrder.paymentStatus,
        acceptedAt: updatedOrder.acceptedAt,
        preparationStartedAt: updatedOrder.preparationStartedAt,
        mockElapsedMinutes: updatedOrder.mockElapsedMinutes,
      });
    }

    return nextOrders;
  }

  function handleAction(orderNumber: string, action: OrderAction) {
    if (action === "Voir détail") {
      setSelectedOrderId(orderNumber);
      return;
    }

    if (action === "Refuser") {
      const confirmed = window.confirm("Voulez-vous vraiment refuser cette commande ?");

      if (!confirmed) {
        return;
      }
    }

    const nextState = getNextState(action);

    if (!nextState) {
      return;
    }

    if (autoCloseTimeoutRef.current) {
      window.clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }

    const nextOrders = updateOrderStatus(orderNumber, nextState.status, nextState.paymentStatus);
    setSelectedOrderId(orderNumber);
    showToast(actionMessages[action] ?? "Commande mise à jour.");

    if (isCompletedStatus(nextState.status)) {
      autoCloseTimeoutRef.current = window.setTimeout(() => {
        const nextVisibleOrders = filterOrders(nextOrders, activeFilter, searchQuery);
        const nextActiveOrder = findNextActiveOrder(nextVisibleOrders, orderNumber);

        setSelectedOrderId(nextActiveOrder?.orderNumber ?? null);
        autoCloseTimeoutRef.current = null;
      }, 600);
    }
  }

  function handleTogglePause() {
    setServicePaused((currentValue) => {
      const nextValue = !currentValue;
      showToast(nextValue ? "Commandes mises en pause." : "Commandes rouvertes.");
      return nextValue;
    });
  }


  function handleResetLocalOrders() {
    const confirmed = window.confirm("Voulez-vous vraiment réinitialiser la file des commandes reçues par QR ?");

    if (!confirmed) {
      return;
    }

    clearLocalOrders();
    setOrders((currentOrders) => currentOrders.filter((order) => order.source !== "public-menu"));
    setSelectedOrderId((currentSelectedOrderId) => {
      const currentOrder = orders.find((order) => order.orderNumber === currentSelectedOrderId);

      return currentOrder?.source === "public-menu" ? null : currentSelectedOrderId;
    });
    showToast("File des commandes QR réinitialisée.");
  }

  function handleAddTestOrder() {
    const highestOrderNumber = Math.max(...orders.map((order) => Number.parseInt(order.orderNumber.replace("#", ""), 10)).filter(Number.isFinite));
    const nextOrderNumber = `#${highestOrderNumber + 1}`;
    const newOrder: Order = {
      orderNumber: nextOrderNumber,
      table: "Comptoir",
      time: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      status: "Nouvelle",
      paymentStatus: "À payer",
      createdAt: new Date().toISOString(),
      estimatedPrepMinutes: 12,
      mockElapsedMinutes: 0,
      total: "21,50 €",
      items: [
        { quantity: 1, name: "Burger Classique", price: "18,00 €" },
        { quantity: 1, name: "Limonade", price: "3,50 €" },
      ],
      note: "Commande ajoutée depuis le comptoir.",
    };

    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    setSelectedOrderId(newOrder.orderNumber);
    showToast("Commande ajoutée à la file.");
  }

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Commandes en direct"
        subtitle="Suivez les commandes reçues par QR code, validez-les et préparez-les au bon moment."
      >
        <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800" onClick={handleTogglePause} type="button">
          {servicePaused ? "Reprendre le service" : "Mettre en pause"}
        </button>
        <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800" onClick={handleResetLocalOrders} type="button">
          Réinitialiser la file QR
        </button>
        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700" onClick={handleAddTestOrder} type="button">
          Ajouter une commande
        </button>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-5 lg:p-8">
        <LiveServiceStatusCard servicePaused={servicePaused} />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => (
            <OrderSummaryCard key={card.label} {...card} />
          ))}
        </section>

        <OrdersFilterBar
          activeFilter={activeFilter}
          isFilterOpen={isFilterOpen}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
          onToggleFilters={() => setIsFilterOpen((currentValue) => !currentValue)}
          searchQuery={searchQuery}
        />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">File des commandes</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Les commandes reçues depuis les QR apparaissent ici et avancent selon votre service.</p>
              </div>
              <span className="hidden rounded-full bg-white px-4 py-2 text-sm font-black text-slate-500 ring-1 ring-slate-200 sm:inline-flex">
                {visibleOrders.length} commande{visibleOrders.length > 1 ? "s" : ""}
              </span>
            </div>

            {visibleOrders.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {visibleOrders.map((order) => (
                  <OrderCard
                    actions={getOrderActions(order.status)}
                    key={order.orderNumber}
                    onAction={handleAction}
                    onSelect={setSelectedOrderId}
                    order={order}
                    selected={order.orderNumber === effectiveSelectedOrderId}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrdersState />
            )}
          </div>

          <div className="space-y-6">
            <SelectedOrderPanel actions={selectedActions} onAction={handleAction} onClose={handleCloseSelectedOrder} order={selectedOrder} />
            <TopProductsWidget products={topProducts} />
            <PreparationTimeWidget orders={orders} />
            <PaymentReminderCard />
          </div>
        </section>
      </main>

      {successMessage ? (
        <div className="fixed right-5 top-5 z-50 max-w-sm rounded-3xl border border-emerald-200 bg-white p-4 shadow-2xl shadow-emerald-950/15" role="status">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700" aria-hidden="true">✓</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-950">Action confirmée</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{successMessage.message}</p>
            </div>
            <button className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => setSuccessMessage(null)} type="button">
              <span className="sr-only">Fermer la notification</span>
              ×
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function mergeSubmittedLocalOrders(currentOrders: Order[], submittedOrders: Order[]): Order[] {
  const submittedOrderNumbers = new Set(submittedOrders.map((order) => order.orderNumber));
  const dashboardOrders = currentOrders.filter((order) => order.source !== "public-menu" && !submittedOrderNumbers.has(order.orderNumber));

  return [...submittedOrders, ...dashboardOrders];
}

function filterOrders(orders: Order[], activeFilter: OrderFilter, searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesStatus = matchesOrderFilter(order, activeFilter);
    const searchableContent = [
      order.orderNumber,
      order.table,
      order.note ?? "",
      order.source === "public-menu" ? "QR client Depuis le menu public" : "",
      ...order.items.map((item) => item.name),
    ].join(" ").toLowerCase();
    const matchesSearch = !normalizedQuery || searchableContent.includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });
}

function matchesOrderFilter(order: Order, activeFilter: OrderFilter) {
  switch (activeFilter) {
    case "Toutes":
      return !isCompletedStatus(order.status);
    case "Nouvelles":
      return order.status === "Nouvelle";
    case "En cours":
      return ["Acceptée", "À payer", "Payée", "En préparation"].includes(order.status);
    case "Prêtes":
      return order.status === "Prête";
    case "Terminées":
      return ["Servie", "Refusée", "Annulée"].includes(order.status);
    case "Acceptées":
      return order.status === "Acceptée";
    case "À payer":
      return order.status === "À payer" || order.paymentStatus === "À payer";
    case "Payées":
      return order.paymentStatus === "Payée";
    case "En préparation":
      return order.status === "En préparation";
    case "Servies":
      return order.status === "Servie";
    case "Refusées":
      return order.status === "Refusée";
    case "Annulées":
      return order.status === "Annulée";
  }
}

function isCompletedStatus(status: OrderStatus) {
  return completedStatuses.includes(status);
}

function findNextActiveOrder(orders: Order[], completedOrderNumber: string) {
  const activeOrders = orders.filter((order) => order.orderNumber !== completedOrderNumber && !isCompletedStatus(order.status));

  return [...activeOrders].sort((firstOrder, secondOrder) => {
    const firstPriority = activeStatusPriority.indexOf(firstOrder.status);
    const secondPriority = activeStatusPriority.indexOf(secondOrder.status);

    return firstPriority - secondPriority;
  })[0] ?? null;
}

function getNextState(action: OrderAction): { paymentStatus?: PaymentStatus; status: OrderStatus } | null {
  switch (action) {
    case "Accepter":
      return { status: "Acceptée" };
    case "Refuser":
      return { status: "Refusée", paymentStatus: "Annulée" };
    case "Marquer à régler":
      return { status: "À payer", paymentStatus: "À payer" };
    case "Marquer payé":
      return { status: "Payée", paymentStatus: "Payée" };
    case "Lancer en préparation":
      return { status: "En préparation", paymentStatus: "Payée" };
    case "Marquer prête":
      return { status: "Prête" };
    case "Marquer servie":
      return { status: "Servie", paymentStatus: "Payée" };
    case "Voir détail":
      return null;
  }
}

function buildSummaryCards(orders: Order[]): SummaryCard[] {
  const total = orders.reduce((sum, order) => {
    if (order.status === "Refusée" || order.status === "Annulée") {
      return sum;
    }

    return sum + (parseEuroInput(order.total) ?? 0);
  }, 0);

  return [
    { value: countStatus(orders, "Nouvelle"), label: "Nouvelles commandes", helper: "À valider", tone: "emerald" },
    { value: countStatus(orders, "En préparation"), label: "En préparation", helper: "Cuisine active", tone: "amber" },
    { value: countStatus(orders, "Prête"), label: "Prêtes", helper: "À servir", tone: "sky" },
    { value: countStatus(orders, "Servie"), label: "Servies", helper: "Aujourd’hui", tone: "slate" },
    { value: formatEuro(total), label: "Total du jour", helper: "Règlement sur place", tone: "rose" },
  ];
}

function countStatus(orders: Order[], status: OrderStatus) {
  return String(orders.filter((order) => order.status === status).length);
}

function buildTopProducts(orders: Order[]) {
  const counts = new Map<string, number>();

  orders.forEach((order) => {
    if (order.status === "Refusée" || order.status === "Annulée") {
      return;
    }

    order.items.forEach((item) => {
      counts.set(item.name, (counts.get(item.name) ?? 0) + item.quantity);
    });
  });

  return Array.from(counts, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}
