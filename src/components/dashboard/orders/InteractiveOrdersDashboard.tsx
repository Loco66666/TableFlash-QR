"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardHeader } from "@/components/dashboard";
import { formatEuro, parseEuroInput } from "@/lib/formatters";

import { EmptyOrdersState } from "./EmptyOrdersState";
import { LiveServiceStatusCard } from "./LiveServiceStatusCard";
import { OrderCard } from "./OrderCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { PaymentReminderCard } from "./PaymentReminderCard";
import { PreparationTimeWidget } from "./PreparationTimeWidget";
import { SelectedOrderPanel } from "./SelectedOrderPanel";
import { TopProductsWidget } from "./TopProductsWidget";
import { filterStatusMap, getOrderActions, orders as initialOrders } from "./ordersData";
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

const actionMessages: Partial<Record<OrderAction, string>> = {
  Accepter: "Commande acceptée dans la maquette.",
  Refuser: "Commande refusée dans la maquette.",
  "Marquer à payer": "Commande marquée à payer.",
  "Marquer payée": "Commande marquée payée.",
  "En préparation": "Commande passée en préparation.",
  Prête: "Commande prête à servir.",
  Servie: "Commande marquée comme servie.",
};

export function InteractiveOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrders[0]?.orderNumber ?? null);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [servicePaused, setServicePaused] = useState(false);
  const [successMessage, setSuccessMessage] = useState<ToastState | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const visibleOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filterStatus = filterStatusMap[activeFilter];

    return orders.filter((order) => {
      const matchesStatus = !filterStatus || order.status === filterStatus;
      const searchableContent = [
        order.orderNumber,
        order.table,
        order.note ?? "",
        ...order.items.map((item) => item.name),
      ].join(" ").toLowerCase();
      const matchesSearch = !normalizedQuery || searchableContent.includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, orders, searchQuery]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const selectedOrder = visibleOrders.find((order) => order.orderNumber === selectedOrderId) ?? visibleOrders[0] ?? null;
  const effectiveSelectedOrderId = selectedOrder?.orderNumber ?? null;
  const selectedActions = selectedOrder ? getOrderActions(selectedOrder.status) : [];
  const summaryCards = useMemo(() => buildSummaryCards(orders), [orders]);
  const topProducts = useMemo(() => buildTopProducts(orders), [orders]);

  function showToast(message: string) {
    setSuccessMessage({ id: Date.now(), message });
  }

  function updateOrderStatus(orderNumber: string, nextStatus: OrderStatus, nextPaymentStatus?: PaymentStatus) {
    setOrders((currentOrders) => currentOrders.map((order) => {
      if (order.orderNumber !== orderNumber) {
        return order;
      }

      return {
        ...order,
        status: nextStatus,
        paymentStatus: nextPaymentStatus ?? order.paymentStatus,
      };
    }));
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

    updateOrderStatus(orderNumber, nextState.status, nextState.paymentStatus);
    setSelectedOrderId(orderNumber);
    showToast(actionMessages[action] ?? "Commande mise à jour dans la maquette.");
  }

  function handleTogglePause() {
    setServicePaused((currentValue) => {
      const nextValue = !currentValue;
      showToast(nextValue ? "Commandes mises en pause." : "Commandes rouvertes.");
      return nextValue;
    });
  }

  function handleAddTestOrder() {
    const highestOrderNumber = Math.max(...orders.map((order) => Number.parseInt(order.orderNumber.replace("#", ""), 10)).filter(Number.isFinite));
    const nextOrderNumber = `#${highestOrderNumber + 1}`;
    const newOrder: Order = {
      orderNumber: nextOrderNumber,
      table: "Table test",
      time: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      status: "Nouvelle",
      paymentStatus: "À payer",
      total: "21,50 €",
      items: [
        { quantity: 1, name: "Burger Classique", price: "18,00 €" },
        { quantity: 1, name: "Limonade", price: "3,50 €" },
      ],
      note: "Commande de démonstration.",
    };

    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    setSelectedOrderId(newOrder.orderNumber);
    showToast("Commande test ajoutée dans la maquette.");
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
        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700" onClick={handleAddTestOrder} type="button">
          Nouvelle commande test
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

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">File des commandes</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Démonstration locale interactive, sans backend connecté.</p>
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
            <SelectedOrderPanel actions={selectedActions} onAction={handleAction} order={selectedOrder} />
            <TopProductsWidget products={topProducts} />
            <PreparationTimeWidget />
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

function getNextState(action: OrderAction): { paymentStatus?: PaymentStatus; status: OrderStatus } | null {
  switch (action) {
    case "Accepter":
      return { status: "Acceptée" };
    case "Refuser":
      return { status: "Refusée", paymentStatus: "Annulée" };
    case "Marquer à payer":
      return { status: "À payer", paymentStatus: "À payer" };
    case "Marquer payée":
      return { status: "Payée", paymentStatus: "Payée" };
    case "En préparation":
      return { status: "En préparation" };
    case "Prête":
      return { status: "Prête" };
    case "Servie":
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
    { value: formatEuro(total), label: "Total du jour", helper: "Paiement physique", tone: "rose" },
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
