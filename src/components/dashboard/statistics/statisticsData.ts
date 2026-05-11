export type StatisticsPeriod = "today" | "7d" | "30d" | "lunch" | "dinner";
export type ServiceStatus = "Service fluide" | "Activité soutenue" | "Attention aux retards";
export type TrendBadge = "Top vente" | "En hausse" | "Stable";

export type StatisticsPeriodOption = {
  id: StatisticsPeriod;
  label: string;
  multiplier: number;
  previousDelta: number;
};

export type AnalyticsOrder = {
  id: string;
  table: string;
  hour: "11h" | "12h" | "13h" | "14h" | "19h" | "20h" | "21h";
  total: number;
  prepMinutes: number;
  estimatedPrepMinutes: number;
  status: "new" | "accepted" | "preparing" | "ready" | "served";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

export type AnalyticsReview = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  status: "Nouveau" | "À traiter" | "Répondu" | "Archivé";
  sentiment: "Positif" | "Neutre" | "Négatif";
  time: string;
};

export type ActiveLocation = {
  name: string;
  scans: number;
  orders: number;
};

export const periodOptions: StatisticsPeriodOption[] = [
  { id: "today", label: "Aujourd’hui", multiplier: 1, previousDelta: 6 },
  { id: "7d", label: "7 jours", multiplier: 5.4, previousDelta: 18 },
  { id: "30d", label: "30 jours", multiplier: 19.8, previousDelta: 72 },
  { id: "lunch", label: "Service midi", multiplier: 0.72, previousDelta: 4 },
  { id: "dinner", label: "Service soir", multiplier: 0.42, previousDelta: 2 },
];

export const mockAnalyticsOrders: AnalyticsOrder[] = [
  {
    id: "analytics-1",
    table: "Terrasse 3",
    hour: "11h",
    total: 18,
    prepMinutes: 9,
    estimatedPrepMinutes: 12,
    status: "served",
    items: [{ name: "Burger Classique", quantity: 1, price: 18 }],
  },
  {
    id: "analytics-2",
    table: "Table 1",
    hour: "11h",
    total: 17,
    prepMinutes: 10,
    estimatedPrepMinutes: 12,
    status: "served",
    items: [
      { name: "Salade César", quantity: 1, price: 13.5 },
      { name: "Limonade", quantity: 1, price: 3.5 },
    ],
  },
  {
    id: "analytics-3",
    table: "Terrasse 1",
    hour: "11h",
    total: 19,
    prepMinutes: 8,
    estimatedPrepMinutes: 12,
    status: "served",
    items: [{ name: "Burger Classique", quantity: 1, price: 18 }],
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `analytics-noon-${index + 1}`,
    table: index % 3 === 0 ? "Terrasse 3" : index % 3 === 1 ? "Table 1" : "Table 2",
    hour: "12h" as const,
    total: [18, 22.5, 13.5, 31.5, 27, 17, 14.5, 24, 18][index],
    prepMinutes: [11, 12, 14, 15, 9, 10, 13, 18, 8][index],
    estimatedPrepMinutes: 12,
    status: index < 6 ? "served" as const : "preparing" as const,
    items:
      index % 2 === 0
        ? [{ name: "Burger Classique", quantity: 1, price: 18 }]
        : [
            { name: "Salade César", quantity: 1, price: 13.5 },
            { name: "Limonade", quantity: 1, price: 3.5 },
          ],
  })),
  ...Array.from({ length: 8 }, (_, index) => ({
    id: `analytics-13-${index + 1}`,
    table: index % 2 === 0 ? "Terrasse 3" : "Comptoir",
    hour: "13h" as const,
    total: [18, 13.5, 31.5, 22.5, 6.5, 27, 18, 34][index],
    prepMinutes: [12, 10, 16, 11, 9, 13, 15, 12][index],
    estimatedPrepMinutes: 12,
    status: index < 5 ? "served" as const : "ready" as const,
    items:
      index === 4
        ? [{ name: "Tiramisu", quantity: 1, price: 6.5 }]
        : [{ name: index % 2 === 0 ? "Burger Classique" : "Salade César", quantity: 1, price: index % 2 === 0 ? 18 : 13.5 }],
  })),
  ...Array.from({ length: 4 }, (_, index) => ({
    id: `analytics-14-${index + 1}`,
    table: index % 2 === 0 ? "Table 2" : "Terrasse 1",
    hour: "14h" as const,
    total: [18, 13.5, 4.5, 39][index],
    prepMinutes: [8, 9, 6, 13][index],
    estimatedPrepMinutes: 12,
    status: "served" as const,
    items: [{ name: ["Burger Classique", "Salade César", "Frites Maison", "Tiramisu"][index], quantity: index === 3 ? 6 : 1, price: [18, 13.5, 4.5, 6.5][index] }],
  })),
];

export const mockAnalyticsReviews: AnalyticsReview[] = [
  { id: "review-a", rating: 5, status: "Nouveau", sentiment: "Positif", time: "12:48" },
  { id: "review-b", rating: 4, status: "Nouveau", sentiment: "Positif", time: "12:36" },
  { id: "review-c", rating: 3, status: "À traiter", sentiment: "Neutre", time: "12:24" },
  { id: "review-d", rating: 2, status: "À traiter", sentiment: "Négatif", time: "12:18" },
  { id: "review-e", rating: 5, status: "Répondu", sentiment: "Positif", time: "11:58" },
  { id: "review-f", rating: 5, status: "Archivé", sentiment: "Positif", time: "11:45" },
  { id: "review-g", rating: 4, status: "Répondu", sentiment: "Positif", time: "13:05" },
  { id: "review-h", rating: 5, status: "Nouveau", sentiment: "Positif", time: "13:22" },
  { id: "review-i", rating: 4, status: "Répondu", sentiment: "Positif", time: "13:48" },
  { id: "review-j", rating: 4, status: "Archivé", sentiment: "Positif", time: "14:02" },
];

export const mockActiveLocations: ActiveLocation[] = [
  { name: "Terrasse 3", scans: 21, orders: 5 },
  { name: "Table 1", scans: 18, orders: 4 },
  { name: "Terrasse 1", scans: 14, orders: 3 },
  { name: "Table 2", scans: 11, orders: 2 },
  { name: "Comptoir", scans: 7, orders: 1 },
];
