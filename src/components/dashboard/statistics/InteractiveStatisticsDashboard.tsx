"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard";
import {
  LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY,
  LOCAL_RESTAURANT_SETTINGS_UPDATED_EVENT,
  getLocalRestaurantSettings,
} from "@/lib/localRestaurantSettings";
import {
  getCurrentServiceContext,
  getTodayServiceHours,
  type CurrentServiceContext,
} from "@/lib/serviceContext";
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
import { PreparationPerformanceCard } from "./PreparationPerformanceCard";
import { QuickServiceReadingCard } from "./QuickServiceReadingCard";
import { RevenueTrendCard } from "./RevenueTrendCard";
import { ReviewsInsightCard } from "./ReviewsInsightCard";
import { ServiceHealthCard } from "./ServiceHealthCard";
import { StatisticsEmptyState } from "./StatisticsEmptyState";
import { StatisticsFilterBar } from "./StatisticsFilterBar";
import { StatisticsSummaryCard } from "./StatisticsSummaryCard";
import { StatisticsToast } from "./StatisticsToast";
import { TopProductsTable } from "./TopProductsTable";
import {
  referenceActiveLocations,
  referenceAnalyticsOrders,
  referenceAnalyticsReviews,
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

type ServiceHours = {
  startTime: string;
  endTime: string;
} | null;

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


function getPeriodReadingTitle(period: StatisticsPeriod, serviceContext: CurrentServiceContext | null) {
  if (period === "current") {
    return serviceContext?.status === "open"
      ? `Lecture du ${serviceContext.label.toLowerCase()}`
      : "Lecture du dernier service disponible";
  }

  const titles: Record<Exclude<StatisticsPeriod, "current">, string> = {
    today: "Résumé du service",
    "7d": "Tendance de la semaine",
    "30d": "Vue mensuelle",
    lunch: "Lecture du service midi",
    dinner: "Lecture du service soir",
  };

  return titles[period];
}

function buildServiceSummary({ orderCount, revenue, delayedOrders, averageRating, peakHour }: { orderCount: number; revenue: number; delayedOrders: number; averageRating: number; peakHour: string }) {
  const activity = revenue >= 900 || orderCount >= 80 ? "Activité forte" : orderCount >= 25 ? "Service solide" : "Service à installer";
  const kitchen = delayedOrders > 0 ? `la cuisine reste globalement maîtrisée avec ${delayedOrders} commandes à reprendre en priorité` : "la cuisine tient le rythme prévu";
  const satisfaction = averageRating >= 4.3 ? "La satisfaction client est positive" : averageRating >= 3.6 ? "Les retours clients restent corrects" : "Les avis clients demandent une attention particulière";

  return `${activity} sur la période. Les commandes QR se concentrent autour de ${peakHour} et ${kitchen}. ${satisfaction}.`;
}

function buildServiceWrapUp(delayedOrders: number, topProductName: string, averageRating: number) {
  const kitchenFocus = delayedOrders > 0 ? "Les prochains gains se situent sur la préparation pendant les pics" : "La régularité cuisine permet de consolider le rythme du service";
  const reviewFocus = averageRating >= 4 ? "la valorisation des clients satisfaits" : "le traitement rapide des retours clients";

  return `Le service est porté par les commandes QR et ${topProductName}. ${kitchenFocus} et ${reviewFocus}.`;
}

function buildRecommendedDecisions({ peakHour, topProductName, delayedOrders, averageRating, topLocationName }: { peakHour: string; topProductName: string; delayedOrders: number; averageRating: number; topLocationName: string }) {
  return [
    {
      title: `Renforcer l’équipe autour de ${peakHour}`,
      description: "Pic d’activité observé sur ce créneau.",
    },
    {
      title: `Mettre en avant ${topProductName}`,
      description: "Produit le plus commandé sur la période.",
    },
    delayedOrders > 0
      ? {
          title: "Surveiller les délais de préparation",
          description: "Certaines commandes dépassent le délai estimé.",
        }
      : {
          title: "Maintenir le rythme cuisine",
          description: "Les commandes restent dans les délais prévus.",
        },
    averageRating >= 4
      ? {
          title: "Valoriser les clients satisfaits",
          description: "Les avis positifs peuvent être orientés vers Google Avis.",
        }
      : {
          title: `Analyser ${topLocationName}`,
          description: "Cet emplacement concentre l’activité et mérite un suivi attentif.",
        },
  ];
}


function formatServiceHours(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) {
    return null;
  }

  return `${startTime} — ${endTime}`;
}

function formatNextServiceLabel(label: string | null) {
  if (!label) {
    return null;
  }

  return label
    .replace(/^Service\s+/i, "")
    .replace(/^service\s+/i, "");
}

function getServiceCardTone(status: CurrentServiceContext["status"]) {
  if (status === "open") return "border-emerald-200 bg-white shadow-emerald-900/5";
  if (status === "between-services") return "border-amber-200 bg-amber-50/70 shadow-amber-900/5";
  if (status === "paused") return "border-orange-200 bg-orange-50/70 shadow-orange-900/5";
  return "border-slate-200 bg-white shadow-slate-200/70";
}

function ServiceContextCard({ serviceContext }: { serviceContext: CurrentServiceContext | null }) {
  if (!serviceContext) {
    return (
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-slate-400">Contexte de service</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Analyse du service…</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Les horaires du restaurant seront chargés après l’ouverture du tableau de bord.</p>
      </section>
    );
  }

  const serviceHours = formatServiceHours(serviceContext.startTime, serviceContext.endTime);
  const nextServiceName = formatNextServiceLabel(serviceContext.nextServiceLabel);
  const statusHelper = serviceContext.status === "open" && serviceHours
    ? `${serviceHours} · ${serviceContext.message}`
    : serviceContext.status === "between-services" && nextServiceName && serviceContext.nextServiceStart
      ? `Prochain service : ${nextServiceName.toLowerCase()} à ${serviceContext.nextServiceStart}`
      : serviceContext.message;

  return (
    <section className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-sm ${getServiceCardTone(serviceContext.status)}`}>
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-100/60 blur-3xl" aria-hidden="true" />
      <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-700">Contexte de service</p>
          <h2 className="mt-3 break-words text-2xl font-black tracking-tight text-slate-950">{serviceContext.label}</h2>
          <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-600">{statusHelper}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {serviceHours ? (
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700">{serviceHours}</span>
          ) : null}
          <span className={`rounded-full border px-4 py-2 text-sm font-black ${serviceContext.status === "open" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600"}`}>
            {serviceContext.status === "open" ? "Commandes ouvertes" : serviceContext.label}
          </span>
        </div>
      </div>
    </section>
  );
}

function mapLocalOrderToAnalytics(order: LocalSubmittedOrder): AnalyticsOrder {
  const hour = order.time.startsWith("11") ? "11h" : order.time.startsWith("13") ? "13h" : order.time.startsWith("14") ? "14h" : "12h";

  return {
    id: order.id,
    table: order.tableName,
    hour,
    total: order.total,
    prepMinutes: order.elapsedMinutes || order.estimatedPrepMinutes,
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

  referenceActiveLocations.forEach((location) => {
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
  const [activePeriod, setActivePeriod] = useState<StatisticsPeriod>("current");
  const [localOrders, setLocalOrders] = useState<LocalSubmittedOrder[]>([]);
  const [localReviews, setLocalReviews] = useState<LocalSubmittedReview[]>([]);
  const [serviceContext, setServiceContext] = useState<CurrentServiceContext | null>(null);
  const [todayLunchHours, setTodayLunchHours] = useState<ServiceHours>(null);
  const [todayDinnerHours, setTodayDinnerHours] = useState<ServiceHours>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [periodPanelOpen, setPeriodPanelOpen] = useState(false);

  const activeOption = periodOptions.find((period) => period.id === activePeriod) ?? periodOptions[0];
  const analyticsOrders = useMemo(() => [...referenceAnalyticsOrders, ...localOrders.map(mapLocalOrderToAnalytics)], [localOrders]);
  const analyticsReviews = useMemo(() => [...referenceAnalyticsReviews, ...localReviews.map(mapLocalReviewToAnalytics)], [localReviews]);
  const currentServiceMultiplier = serviceContext?.status === "open"
    ? serviceContext.activePeriod === "soir" ? 0.42 : serviceContext.activePeriod === "all-day" ? 1 : 0.72
    : 0.72;
  const multiplier = activePeriod === "current" ? currentServiceMultiplier : activeOption.multiplier;

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
  const status: ServiceStatus = delayedOrders > 0 ? "Attention aux retards" : "Service fluide";
  const stats = {
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
    recommendation: delayedOrders > 0 ? "Certaines commandes dépassent le délai estimé. Priorité aux commandes en préparation." : "Les commandes restent dans les délais prévus.",
    latestSentiment: analyticsReviews[0]?.sentiment ?? "Positif",
    topProducts: buildTopProducts(analyticsOrders, multiplier),
  };

  const trendPoints = ["11h", "12h", "13h", "14h"].map((hour) => {
    const ordersAtHour = analyticsOrders.filter((order) => order.hour === hour);

    return {
      hour,
      orders: scale(ordersAtHour.length, multiplier),
      revenue: ordersAtHour.reduce((sum, order) => sum + order.total, 0) * multiplier,
    };
  });

  const peakPoint = trendPoints.reduce((bestPoint, point) => (point.orders > bestPoint.orders ? point : bestPoint), trendPoints[0]);
  const topProductName = stats.topProducts[0]?.name ?? "Burger Classique";
  const topLocationName = stats.activeTables[0]?.name ?? "Terrasse 3";
  const quickInsights = [
    { label: "Pic d’activité", value: peakPoint ? peakPoint.hour : "12h", helper: peakPoint ? `${peakPoint.orders} commandes` : "Commandes du jour" },
    { label: "Produit le plus demandé", value: topProductName, helper: `${stats.topProducts[0]?.quantity ?? 0} commandes` },
    { label: "Emplacement le plus actif", value: topLocationName, helper: `${stats.activeTables[0]?.orders ?? 0} commandes` },
    {
      label: "Point à surveiller",
      value: stats.delayedOrders > 0 ? `${stats.delayedOrders} commandes en retard` : "Aucun retard",
      helper: stats.delayedOrders > 0 ? "Priorité à la préparation" : "Service dans les délais",
    },
  ];

  const recommendedDecisions = buildRecommendedDecisions({
    peakHour: peakPoint ? peakPoint.hour : "12h",
    topProductName,
    delayedOrders: stats.delayedOrders,
    averageRating: stats.averageRating,
    topLocationName,
  });
  const serviceSummary = buildServiceSummary({
    orderCount: stats.orderCount,
    revenue: stats.revenue,
    delayedOrders: stats.delayedOrders,
    averageRating: stats.averageRating,
    peakHour: peakPoint ? peakPoint.hour : "12h",
  });
  const serviceWrapUp = buildServiceWrapUp(stats.delayedOrders, topProductName, stats.averageRating);
  const periodReadingTitle = getPeriodReadingTitle(activePeriod, serviceContext);

  useEffect(() => {
    function refreshServiceContext() {
      const nextSettings = getLocalRestaurantSettings();
      const currentTime = new Date();

      setServiceContext(getCurrentServiceContext(nextSettings, currentTime));
      setTodayLunchHours(getTodayServiceHours(nextSettings, currentTime, "midi"));
      setTodayDinnerHours(getTodayServiceHours(nextSettings, currentTime, "soir"));
    }

    refreshServiceContext();
    window.addEventListener(LOCAL_RESTAURANT_SETTINGS_UPDATED_EVENT, refreshServiceContext);
    window.addEventListener("focus", refreshServiceContext);

    return () => {
      window.removeEventListener(LOCAL_RESTAURANT_SETTINGS_UPDATED_EVENT, refreshServiceContext);
      window.removeEventListener("focus", refreshServiceContext);
    };
  }, []);

  useEffect(() => {
    function refreshLocalData() {
      setLocalOrders(getLocalOrders());
      setLocalReviews(getLocalReviews());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === LOCAL_ORDERS_STORAGE_KEY || event.key === LOCAL_REVIEWS_STORAGE_KEY || event.key === LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY) {
        refreshLocalData();
        if (event.key === LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY) {
          const nextSettings = getLocalRestaurantSettings();
          const currentTime = new Date();

          setServiceContext(getCurrentServiceContext(nextSettings, currentTime));
          setTodayLunchHours(getTodayServiceHours(nextSettings, currentTime, "midi"));
          setTodayDinnerHours(getTodayServiceHours(nextSettings, currentTime, "soir"));
        }
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
    const nextSettings = getLocalRestaurantSettings();
    const currentTime = new Date();

    setServiceContext(getCurrentServiceContext(nextSettings, currentTime));
    setTodayLunchHours(getTodayServiceHours(nextSettings, currentTime, "midi"));
    setTodayDinnerHours(getTodayServiceHours(nextSettings, currentTime, "soir"));
    setLocalOrders(getLocalOrders());
    setLocalReviews(getLocalReviews());
    setToast("Statistiques actualisées.");
  }

  function handleExport() {
    setToast("Export du rapport préparé.");
  }

  function handleCustomPeriod() {
    setPeriodPanelOpen((isOpen) => !isOpen);
    setToast("Le choix de période est prêt à être affiné.");
  }

  const hasData = stats.orderCount > 0 || analyticsReviews.length > 0;

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Analyse du service"
        subtitle="Suivez vos commandes QR, vos ventes estimées, vos produits forts et les points à surveiller."
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
            Le rapport suit l’activité des commandes QR et les points opérationnels du service.
          </section>
        ) : null}

        <ServiceContextCard serviceContext={serviceContext} />

        <StatisticsFilterBar
          periods={periodOptions}
          activePeriod={activePeriod}
          onChange={setActivePeriod}
          serviceContext={serviceContext}
          lunchHours={todayLunchHours}
          dinnerHours={todayDinnerHours}
        />

        {!hasData ? (
          <StatisticsEmptyState onRefresh={handleRefresh} />
        ) : (
          <>
            <section className="grid min-w-0 max-w-full gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <StatisticsSummaryCard label="Commandes reçues" value={String(stats.orderCount)} helper={formatOrderDelta(activeOption.previousDelta)} />
              <StatisticsSummaryCard label="Ventes estimées" value={formatEuro(stats.revenue)} helper="Paiement caisse / serveur" tone="sky" />
              <StatisticsSummaryCard label="Panier moyen" value={formatEuro(stats.averageBasket)} helper="Par commande" tone="slate" />
              <StatisticsSummaryCard label="Préparation moyenne" value={`${stats.averagePrep} min`} helper={stats.delayedOrders > 0 ? `${stats.delayedOrders} commandes en retard` : "Service fluide"} tone={stats.delayedOrders > 0 ? "rose" : "emerald"} />
              <StatisticsSummaryCard label="Note clients" value={`${stats.averageRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5`} helper="Note moyenne" tone="amber" />
              <StatisticsSummaryCard label="Emplacements actifs" value={String(stats.activeTables.length)} helper="Zones scannées" tone="emerald" />
            </section>

            <section className="grid min-w-0 max-w-full gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <QuickServiceReadingCard title={periodReadingTitle} summary={serviceSummary} insights={quickInsights} />
              <OrdersTrendCard title="Décisions recommandées" subtitle="Actions concrètes à préparer pour le prochain service." insights={recommendedDecisions} />
            </section>

            <section className="grid min-w-0 max-w-full gap-6 2xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
              <RevenueTrendCard points={trendPoints} />
              <ServiceHealthCard status={stats.serviceStatus} recommendation={stats.recommendation} />
            </section>

            <section className="grid min-w-0 max-w-full grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
              <TopProductsTable products={stats.topProducts} />
              <ActiveTablesTable rows={stats.activeTables} />
            </section>

            <section className="grid min-w-0 max-w-full gap-6 xl:grid-cols-2">
              <PreparationPerformanceCard averageMinutes={stats.averagePrep} delayedOrders={stats.delayedOrders} watchOrders={stats.watchOrders} onTimeOrders={stats.onTimeOrders} />
              <ReviewsInsightCard averageRating={stats.averageRating} positiveReviews={stats.positiveReviews} reviewsToHandle={stats.reviewsToHandle} latestSentiment={stats.latestSentiment} />
            </section>

            <section className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-emerald-950 p-6 text-white shadow-xl shadow-emerald-950/15">
              <p className="text-sm font-black uppercase tracking-[0.10em] text-emerald-200">Bilan opérationnel</p>
              <h2 className="mt-2 break-words text-2xl font-black">Bilan du service</h2>
              <p className="mt-4 max-w-4xl break-words text-base font-semibold leading-7 text-emerald-50">{serviceWrapUp}</p>
            </section>
          </>
        )}
      </main>

      {toast ? <StatisticsToast message={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}
