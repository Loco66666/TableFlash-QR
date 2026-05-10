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
  | "Acceptées"
  | "À payer"
  | "Payées"
  | "En préparation"
  | "Prêtes"
  | "Servies"
  | "Refusées"
  | "Annulées";

export type SummaryTone = "emerald" | "amber" | "sky" | "slate" | "rose" | "green";

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
  note?: string;
};

export const orderFilters: OrderFilter[] = [
  "Toutes",
  "Nouvelles",
  "Acceptées",
  "À payer",
  "Payées",
  "En préparation",
  "Prêtes",
  "Servies",
  "Refusées",
  "Annulées",
];

export const filterStatusMap: Partial<Record<OrderFilter, OrderStatus>> = {
  Nouvelles: "Nouvelle",
  Acceptées: "Acceptée",
  "À payer": "À payer",
  Payées: "Payée",
  "En préparation": "En préparation",
  Prêtes: "Prête",
  Servies: "Servie",
  Refusées: "Refusée",
  Annulées: "Annulée",
};

export const orders: Order[] = [
  {
    orderNumber: "#1257",
    table: "Table 12",
    time: "12:42",
    status: "Nouvelle",
    paymentStatus: "À payer",
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
    status: "Acceptée",
    paymentStatus: "À payer",
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
    status: "Payée",
    paymentStatus: "Payée",
    total: "18,00 €",
    items: [{ quantity: 1, name: "Burger Classique", price: "18,00 €" }],
  },
  {
    orderNumber: "#1254",
    table: "Table 7",
    time: "12:24",
    status: "En préparation",
    paymentStatus: "Payée",
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
    status: "Prête",
    paymentStatus: "Payée",
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
    status: "Servie",
    paymentStatus: "Payée",
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
      return ["Voir détail"];
    case "Refusée":
    case "Annulée":
      return [];
  }
}
