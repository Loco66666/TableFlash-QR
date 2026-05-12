"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard";
import {
  LOCAL_ORDER_CREATED_EVENT,
  LOCAL_ORDER_RESET_EVENT,
  LOCAL_ORDER_UPDATED_EVENT,
  LOCAL_ORDERS_STORAGE_KEY,
  getLocalOrders,
  type LocalSubmittedOrder,
} from "@/lib/localOrders";
import {
  LOCAL_REVIEW_CREATED_EVENT,
  LOCAL_REVIEWS_RESET_EVENT,
  LOCAL_REVIEWS_STORAGE_KEY,
  getLocalReviews,
  type LocalSubmittedReview,
} from "@/lib/localReviews";
import { ActiveTablesTable } from "./ActiveTablesTable";
import { OrdersTrendCard } from "./OrdersTrendCard";
import { PeakHoursChart } from "./PeakHoursChart";
import { PreparationPerformanceCard } from "./PreparationPerformanceCard";
import { RevenueTrendCard } from "./RevenueTrendCard";
import { ReviewsInsightCard } from "./ReviewsInsightCard";
import { ServiceHealthCard } from "./ServiceHealthCard";
import { StatisticsEmptyState } from "./StatisticsEmptyState";
import { StatisticsFilterBar } from "./StatisticsFilterBar";
import { StatisticsSummaryCard } from "./StatisticsSummaryCard";
import { StatisticsToast } from "./StatisticsToast";
import { TopProductsTable } from "./TopProductsTable";
import {
  mockActiveLocations,
  mockAnalyticsOrders,
  mockAnalyticsReviews,
  periodOptions,
  type ActiveLocation,
  type AnalyticsOrder,
  type AnalyticsReview,
  type ServiceStatus,
  type StatisticsPeriod,
  type TrendBadge,
} from "./statisticsData";

type ProductRow = {
  name: string;
  quantity: number;
  revenue: number;
  badge: TrendBadge;
};

type ActiveTableRow = ActiveLocation & {
  conversion: number;
};

const defaultTopProducts: ProductRow[] = [
  { name: "Burger Classique", quantity: 18, revenue: 324, badge: "Top vente" },
  { name: "Salade César", quantity: 12, revenue: 162, badge: "En hausse" },
  { name: "Limonade", quantity: 9, revenue: 31.5, badge: "Stable" },
  { name: "Tiramisu", quantity: 7, revenue: 45.5, badge: "En hausse" },
  { name: "Frites Maison", quantity: 6, revenue: 27, badge: "Stable" },
];

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

function scale(value: number, multiplier: number) {
  return Math.max(0, Math.round(value * multiplier));
}

function formatOrderDelta(delta: number) {
  if (delta <= 0) {
    return "Activité stable par rapport à hier";
  }

  return `${delta} ${delta > 1 ? "commandes" : "commande"} de plus qu’hier`;
}

function mapLocalOrderToAnalytics(order: LocalSubmittedOrder): AnalyticsOrder {
  const hour = order.time.startsWith("11") ? "11h" : order.time.startsWith("13") ? "13h" : order.time.startsWith("14") ? "14h" : "12h";

  return {
    id: order.id,
    table: order.tableName,
    hour,
    total: order.total,
    prepMinutes: order.mockElapsedMinutes || order.estimatedPrepMinutes,
    estimatedPrepMinutes: order.estimatedPrepMinutes,
    status: order.status === "Servie" ? "served" : order.status === "Prête" ? "ready" : order.status === "En préparation" ? "preparing" : "accepted",
    items: order.items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
  };
}

function mapLocalReviewToAnalytics(review: LocalSubmittedReview): AnalyticsReview {
  return {
    id: review.id,
    rating: review.rating,
    status: review.status,
    sentiment: review.sentiment,
    time: review.time,
  };
}

function buildTopProducts(orders: AnalyticsOrder[], multiplier: number): ProductRow[] {
  const productMap = new Map<string, ProductRow>();

  defaultTopProducts.forEach((product) => {
    productMap.set(product.name, { ...product, quantity: scale(product.quantity, multiplier), revenue: product.revenue * multiplier });
  });

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = productMap.get(item.name) ?? { name: item.name, quantity: 0, revenue: 0, badge: "En hausse" as TrendBadge };
      productMap.set(item.name, {
        ...current,
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + item.price * item.quantity,
      });
    });
  });

  return Array.from(productMap.values())
    .sort((firstProduct, secondProduct) => secondProduct.quantity - firstProduct.quantity)
    .slice(0, 5)
    .map((product, index) => ({ ...product, badge: index === 0 ? "Top vente" : product.badge }));
}

function buildActiveTables(orders: AnalyticsOrder[], multiplier: number): ActiveTableRow[] {
  const locationMap = new Map<string, ActiveLocation>();

  mockActiveLocations.forEach((location) => {
    locationMap.set(location.name, {
      name: location.name,
      scans: scale(location.scans, multiplier),
      orders: scale(location.orders, multiplier),
    });
  });

  orders.forEach((order) => {
    const current = locationMap.get(order.table) ?? { name: order.table, scans: 0, orders: 0 };
    locationMap.set(order.table, { ...current, scans: current.scans + 1, orders: current.orders + 1 });
  });

  return Array.from(locationMap.values())
    .map((location) => ({
      ...location,
      conversion: location.scans > 0 ? (location.orders / location.scans) * 100 : 0,
    }))
    .sort((firstLocation, secondLocation) => secondLocation.scans - firstLocation.scans)
    .slice(0, 5);
}

export function InteractiveStatisticsDashboard() {
  const [activePeriod, setActivePeriod] = useState<StatisticsPeriod>("today");
  const [localOrders, setLocalOrders] = useState<LocalSubmittedOrder[]>([]);
  const [localReviews, setLocalReviews] = useState<LocalSubmittedReview[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [periodPanelOpen, setPeriodPanelOpen] = useState(false);

  const activeOption = periodOptions.find((period) => period.id === activePeriod) ?? periodOptions[0];
  const analyticsOrders = useMemo(() => [...mockAnalyticsOrders, ...localOrders.map(mapLocalOrderToAnalytics)], [localOrders]);
  const analyticsReviews = useMemo(() => [...mockAnalyticsReviews, ...localReviews.map(mapLocalReviewToAnalytics)], [localReviews]);
  const multiplier = activeOption.multiplier;

  const stats = useMemo(() => {
    const orderCount = scale(analyticsOrders.length, multiplier);
    const localRevenue = localOrders.reduce((sum, order) => sum + order.total, 0);
    const baseRevenue = analyticsOrders.reduce((sum, order) => sum + order.total, 0) - localRevenue;
    const revenue = baseRevenue * multiplier + localRevenue;
    const averageBasket = orderCount > 0 ? revenue / orderCount : 0;
    const averagePrep = Math.round(analyticsOrders.reduce((sum, order) => sum + order.prepMinutes, 0) / Math.max(analyticsOrders.length, 1));
    const delayedOrders = analyticsOrders.filter((order) => order.prepMinutes > order.estimatedPrepMinutes + 2).length;
    const watchOrders = analyticsOrders.filter((order) => order.prepMinutes > order.estimatedPrepMinutes && order.prepMinutes <= order.estimatedPrepMinutes + 2).length;
    const onTimeOrders = Math.max(0, analyticsOrders.length - delayedOrders - watchOrders);
    const averageRating = analyticsReviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(analyticsReviews.length, 1);
    const positiveReviews = scale(analyticsReviews.filter((review) => review.rating >= 4).length, multiplier);
    const reviewsToHandle = analyticsReviews.filter((review) => review.status === "À traiter" || review.status === "Nouveau").length;
    const activeTables = buildActiveTables(analyticsOrders, multiplier);
    const status: ServiceStatus = delayedOrders > 0 ? "Attention aux retards" : orderCount > 20 ? "Activité soutenue" : "Service fluide";

    return {
      orderCount,
      revenue,
      averageBasket,
      averagePrep,
      delayedOrders,
      watchOrders,
      onTimeOrders,
      averageRating,
      positiveReviews,
      reviewsToHandle,
      activeTables,
      serviceStatus: status,
      recommendation: delayedOrders > 0 ? "Surveillez les commandes en préparation." : "Le service reste stable.",
      latestSentiment: analyticsReviews[0]?.sentiment ?? "Positif",
      topProducts: buildTopProducts(analyticsOrders, multiplier),
    };
  }, [analyticsOrders, analyticsReviews, localOrders, multiplier]);

  const trendPoints = useMemo(
    () => ["11h", "12h", "13h", "14h"].map((hour) => {
      const ordersAtHour = analyticsOrders.filter((order) => order.hour === hour);

      return {
        hour,
        orders: scale(ordersAtHour.length, multiplier),
        revenue: ordersAtHour.reduce((sum, order) => sum + order.total, 0) * multiplier,
      };
    }),
    [analyticsOrders, multiplier],
  );

  const insights = [
    {
      title: "Produit à mettre en avant",
      value: stats.topProducts[0]?.name ?? "Burger Classique",
      description: `${stats.topProducts[0]?.name ?? "Burger Classique"} génère le plus de commandes aujourd’hui.`,
    },
    {
      title: "Table la plus active",
      value: stats.activeTables[0]?.name ?? "Terrasse 3",
      description: `${stats.activeTables[0]?.name ?? "Terrasse 3"} concentre le plus de scans.`,
    },
    {
      title: "Avis à traiter",
      value: `${stats.reviewsToHandle} retours`,
      description: `${stats.reviewsToHandle} retours nécessitent une réponse.`,
    },
  ];

  useEffect(() => {
    function refreshLocalData() {
      setLocalOrders(getLocalOrders());
      setLocalReviews(getLocalReviews());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === LOCAL_ORDERS_STORAGE_KEY || event.key === LOCAL_REVIEWS_STORAGE_KEY) {
        refreshLocalData();
      }
    }

    refreshLocalData();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCAL_ORDER_CREATED_EVENT, refreshLocalData);
    window.addEventListener(LOCAL_ORDER_UPDATED_EVENT, refreshLocalData);
    window.addEventListener(LOCAL_ORDER_RESET_EVENT, refreshLocalData);
    window.addEventListener(LOCAL_REVIEW_CREATED_EVENT, refreshLocalData);
    window.addEventListener(LOCAL_REVIEWS_RESET_EVENT, refreshLocalData);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOCAL_ORDER_CREATED_EVENT, refreshLocalData);
      window.removeEventListener(LOCAL_ORDER_UPDATED_EVENT, refreshLocalData);
      window.removeEventListener(LOCAL_ORDER_RESET_EVENT, refreshLocalData);
      window.removeEventListener(LOCAL_REVIEW_CREATED_EVENT, refreshLocalData);
      window.removeEventListener(LOCAL_REVIEWS_RESET_EVENT, refreshLocalData);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function handleRefresh() {
    setLocalOrders(getLocalOrders());
    setLocalReviews(getLocalReviews());
    setToast("Statistiques actualisées.");
  }

  function handleExport() {
    setToast("Export du rapport simulé dans la maquette.");
  }

  function handleCustomPeriod() {
    setPeriodPanelOpen((isOpen) => !isOpen);
    setToast("Sélection de période disponible dans la prochaine étape.");
  }

  const hasData = stats.orderCount > 0 || analyticsReviews.length > 0;

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Statistiques"
        subtitle="Analysez vos commandes QR, vos tables les plus actives, vos produits populaires et la fluidité du service."
      >
        <button type="button" onClick={handleExport} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-800">
          Exporter le rapport
        </button>
        <button type="button" onClick={handleRefresh} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-sm transition hover:bg-emerald-100">
          Actualiser
        </button>
        <button type="button" onClick={handleCustomPeriod} className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800">
          Période personnalisée
        </button>
      </DashboardHeader>

      <main className="min-w-0 flex-1 space-y-6 overflow-x-hidden bg-slate-50/70 p-4 sm:p-5 lg:p-8">
        {periodPanelOpen ? (
          <section className="min-w-0 max-w-full break-words rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 text-sm font-semibold text-emerald-900 shadow-sm">
            La sélection de dates personnalisées sera connectée dans une prochaine étape. La maquette reste locale et sans API externe.
          </section>
        ) : null}

        <StatisticsFilterBar periods={periodOptions} activePeriod={activePeriod} onChange={setActivePeriod} />

        {!hasData ? (
          <StatisticsEmptyState onRefresh={handleRefresh} />
        ) : (
          <>
            <section className="grid min-w-0 max-w-full gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <StatisticsSummaryCard label="Commandes QR" value={String(stats.orderCount)} helper={formatOrderDelta(activeOption.previousDelta)} />
              <StatisticsSummaryCard label="Chiffre potentiel" value={formatEuro(stats.revenue)} helper="Paiement caisse / serveur" tone="sky" />
              <StatisticsSummaryCard label="Panier moyen" value={formatEuro(stats.averageBasket)} helper="Par commande QR" tone="slate" />
              <StatisticsSummaryCard label="Temps moyen préparation" value={`${stats.averagePrep} min`} helper={stats.delayedOrders > 0 ? `${stats.delayedOrders} commandes en retard` : "Service fluide"} tone={stats.delayedOrders > 0 ? "rose" : "emerald"} />
              <StatisticsSummaryCard label="Avis clients" value={`${stats.averageRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5`} helper="Note moyenne" tone="amber" />
              <StatisticsSummaryCard label="Tables actives" value={String(stats.activeTables.length)} helper="Emplacements scannés" tone="emerald" />
            </section>

            <section className="grid min-w-0 max-w-full gap-6 2xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
              <RevenueTrendCard points={trendPoints} />
              <ServiceHealthCard status={stats.serviceStatus} recommendation={stats.recommendation} />
            </section>

            <section className="grid min-w-0 max-w-full grid-cols-1 gap-6 xl:grid-cols-2">
              <TopProductsTable products={stats.topProducts} />
              <ActiveTablesTable rows={stats.activeTables} />
            </section>

            <section className="grid min-w-0 max-w-full gap-6 xl:grid-cols-2 2xl:grid-cols-3">
              <PreparationPerformanceCard averageMinutes={stats.averagePrep} delayedOrders={stats.delayedOrders} watchOrders={stats.watchOrders} onTimeOrders={stats.onTimeOrders} />
              <ReviewsInsightCard averageRating={stats.averageRating} positiveReviews={stats.positiveReviews} reviewsToHandle={stats.reviewsToHandle} latestSentiment={stats.latestSentiment} />
              <PeakHoursChart hours={trendPoints.map((point) => ({ hour: point.hour, orders: point.orders }))} />
            </section>

            <OrdersTrendCard insights={insights} />
          </>
        )}
      </main>

      {toast ? <StatisticsToast message={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}
