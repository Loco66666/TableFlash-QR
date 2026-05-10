export type OrderStatus =
  | "Nouvelle"
  | "Acceptée"
  | "À payer"
  | "Payée"
  | "En préparation"
  | "Prête"
  | "Servie"
  | "Refusée"
  | "Annulée";

export type PaymentStatus = "À payer" | "Payée" | "Annulée";

export type OrderAction =
  | "Accepter"
  | "Refuser"
  | "Marquer à payer"
  | "Marquer payée"
  | "En préparation"
  | "Prête"
  | "Servie"
  | "Voir détail";

export type OrderFilter =
  | "Toutes"
  | "Nouvelles"
  | "En cours"
  | "Prêtes"
  | "Terminées"
  | "Acceptées"
  | "À payer"
  | "Payées"
  | "En préparation"
  | "Servies"
  | "Refusées"
  | "Annulées";

export type SummaryTone = "emerald" | "amber" | "sky" | "slate" | "rose" | "green";

export type TimingStatusLabel =
  | "En attente"
  | "Dans les temps"
  | "À surveiller"
  | "En retard"
  | "Prête à servir"
  | "Commande clôturée";

export type OrderItem = {
  name: string;
  quantity: number;
  price?: string;
  note?: string;
};

export type Order = {
  orderNumber: string;
  table: string;
  time: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: string;
  items: OrderItem[];
  createdAt: string;
  acceptedAt?: string;
  preparationStartedAt?: string;
  estimatedPrepMinutes: number;
  mockElapsedMinutes: number;
  note?: string;
  source?: "public-menu";
  localOrderId?: string;
};

export const mainOrderFilters: OrderFilter[] = ["Toutes", "Nouvelles", "En cours", "Prêtes", "Terminées"];

export const advancedOrderFilters: OrderFilter[] = [
  "Acceptées",
  "À payer",
  "Payées",
  "En préparation",
  "Servies",
  "Refusées",
  "Annulées",
];

export const orders: Order[] = [
  {
    orderNumber: "#1257",
    table: "Table 12",
    time: "12:42",
    createdAt: "2026-05-10T12:42:00+02:00",
    status: "Nouvelle",
    paymentStatus: "À payer",
    estimatedPrepMinutes: 12,
    mockElapsedMinutes: 5,
    total: "31,50 €",
    items: [
      { quantity: 1, name: "Burger Classique", price: "18,00 €" },
      { quantity: 1, name: "Frites Maison", price: "4,50 €" },
      { quantity: 1, name: "Limonade", price: "3,50 €" },
    ],
    note: "Sans oignons.",
  },
  {
    orderNumber: "#1256",
    table: "Terrasse 3",
    time: "12:38",
    createdAt: "2026-05-10T12:38:00+02:00",
    acceptedAt: "2026-05-10T12:40:00+02:00",
    status: "Acceptée",
    paymentStatus: "À payer",
    estimatedPrepMinutes: 12,
    mockElapsedMinutes: 11,
    total: "44,00 €",
    items: [
      { quantity: 2, name: "Salade César", price: "29,00 €" },
      { quantity: 2, name: "Limonade", price: "7,00 €" },
    ],
  },
  {
    orderNumber: "#1255",
    table: "Comptoir",
    time: "12:31",
    createdAt: "2026-05-10T12:31:00+02:00",
    acceptedAt: "2026-05-10T12:32:00+02:00",
    status: "Payée",
    paymentStatus: "Payée",
    estimatedPrepMinutes: 12,
    mockElapsedMinutes: 8,
    total: "18,00 €",
    items: [{ quantity: 1, name: "Burger Classique", price: "18,00 €" }],
  },
  {
    orderNumber: "#1254",
    table: "Table 7",
    time: "12:24",
    createdAt: "2026-05-10T12:24:00+02:00",
    acceptedAt: "2026-05-10T12:25:00+02:00",
    preparationStartedAt: "2026-05-10T12:26:00+02:00",
    status: "En préparation",
    paymentStatus: "Payée",
    estimatedPrepMinutes: 12,
    mockElapsedMinutes: 18,
    total: "26,50 €",
    items: [
      { quantity: 1, name: "Tiramisu", price: "6,50 €" },
      { quantity: 2, name: "Café gourmand", price: "20,00 €" },
    ],
  },
  {
    orderNumber: "#1253",
    table: "Table 4",
    time: "12:18",
    createdAt: "2026-05-10T12:18:00+02:00",
    acceptedAt: "2026-05-10T12:19:00+02:00",
    preparationStartedAt: "2026-05-10T12:21:00+02:00",
    status: "Prête",
    paymentStatus: "Payée",
    estimatedPrepMinutes: 12,
    mockElapsedMinutes: 14,
    total: "39,50 €",
    items: [
      { quantity: 2, name: "Burger Classique", price: "36,00 €" },
      { quantity: 1, name: "Frites Maison", price: "3,50 €" },
    ],
  },
  {
    orderNumber: "#1252",
    table: "Terrasse 1",
    time: "12:10",
    createdAt: "2026-05-10T12:10:00+02:00",
    acceptedAt: "2026-05-10T12:11:00+02:00",
    preparationStartedAt: "2026-05-10T12:13:00+02:00",
    status: "Servie",
    paymentStatus: "Payée",
    estimatedPrepMinutes: 12,
    mockElapsedMinutes: 13,
    total: "52,00 €",
    items: [
      { quantity: 2, name: "Salade César", price: "29,00 €" },
      { quantity: 2, name: "Tiramisu", price: "13,00 €" },
    ],
  },
];

export function getOrderActions(status: OrderStatus): OrderAction[] {
  switch (status) {
    case "Nouvelle":
      return ["Accepter", "Refuser"];
    case "Acceptée":
      return ["Marquer à payer", "En préparation"];
    case "À payer":
      return ["Marquer payée"];
    case "Payée":
      return ["En préparation"];
    case "En préparation":
      return ["Prête"];
    case "Prête":
      return ["Servie"];
    case "Servie":
    case "Refusée":
    case "Annulée":
      return [];
  }
}

export function getOrderTimingStatus(order: Order): TimingStatusLabel {
  if (["Nouvelle", "Acceptée", "À payer", "Payée"].includes(order.status)) {
    return "En attente";
  }

  if (order.status === "En préparation") {
    if (order.mockElapsedMinutes <= order.estimatedPrepMinutes) {
      return "Dans les temps";
    }

    if (order.mockElapsedMinutes <= order.estimatedPrepMinutes + 5) {
      return "À surveiller";
    }

    return "En retard";
  }

  if (order.status === "Prête") {
    return "Prête à servir";
  }

  return "Commande clôturée";
}

export function getDelayedOrdersCount(orders: Order[]) {
  return orders.filter((order) => getOrderTimingStatus(order) === "En retard").length;
}

export function getWatchOrdersCount(orders: Order[]) {
  return orders.filter((order) => getOrderTimingStatus(order) === "À surveiller").length;
}

export function getAveragePreparationMinutes(orders: Order[]) {
  const relevantOrders = orders.filter((order) => order.status !== "Refusée" && order.status !== "Annulée");

  if (relevantOrders.length === 0) {
    return 0;
  }

  const totalMinutes = relevantOrders.reduce((sum, order) => sum + order.estimatedPrepMinutes, 0);

  return Math.round(totalMinutes / relevantOrders.length);
}
