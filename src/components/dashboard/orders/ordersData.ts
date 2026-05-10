export type OrderStatus =
  | "Nouvelle"
  | "Acceptée"
  | "Payée"
  | "En préparation"
  | "Prête"
  | "Servie"
  | "Refusée"
  | "Annulée";

export type PaymentStatus = "À payer" | "Payée" | "Annulée";

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
  actions: string[];
};

export const summaryCards = [
  { value: "4", label: "Nouvelles commandes", helper: "À valider", tone: "emerald" },
  { value: "6", label: "En préparation", helper: "Cuisine active", tone: "amber" },
  { value: "3", label: "Prêtes", helper: "À servir", tone: "sky" },
  { value: "12", label: "Servies", helper: "Aujourd’hui", tone: "slate" },
  { value: "286,50 €", label: "Total du jour", helper: "Paiement physique", tone: "rose" },
] satisfies Array<{ value: string; label: string; helper: string; tone: SummaryTone }>;

export const orderFilters = [
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

export const orders: Order[] = [
  {
    orderNumber: "#1257",
    table: "Table 12",
    time: "12:42",
    status: "Nouvelle",
    paymentStatus: "À payer",
    total: "31,50 €",
    items: [
      { quantity: 1, name: "Burger Classique" },
      { quantity: 1, name: "Frites Maison" },
      { quantity: 1, name: "Limonade" },
    ],
    note: "Sans oignons.",
    actions: ["Accepter", "Refuser"],
  },
  {
    orderNumber: "#1256",
    table: "Terrasse 3",
    time: "12:38",
    status: "Acceptée",
    paymentStatus: "À payer",
    total: "44,00 €",
    items: [
      { quantity: 2, name: "Salade César" },
      { quantity: 2, name: "Limonade" },
    ],
    actions: ["À payer", "En préparation"],
  },
  {
    orderNumber: "#1255",
    table: "Comptoir",
    time: "12:31",
    status: "Payée",
    paymentStatus: "Payée",
    total: "18,00 €",
    items: [{ quantity: 1, name: "Burger Classique" }],
    actions: ["En préparation"],
  },
  {
    orderNumber: "#1254",
    table: "Table 7",
    time: "12:24",
    status: "En préparation",
    paymentStatus: "Payée",
    total: "26,50 €",
    items: [
      { quantity: 1, name: "Tiramisu" },
      { quantity: 2, name: "Café gourmand" },
    ],
    actions: ["Prête"],
  },
  {
    orderNumber: "#1253",
    table: "Table 4",
    time: "12:18",
    status: "Prête",
    paymentStatus: "Payée",
    total: "39,50 €",
    items: [
      { quantity: 2, name: "Burger Classique" },
      { quantity: 1, name: "Frites Maison" },
    ],
    actions: ["Servie"],
  },
  {
    orderNumber: "#1252",
    table: "Terrasse 1",
    time: "12:10",
    status: "Servie",
    paymentStatus: "Payée",
    total: "52,00 €",
    items: [
      { quantity: 2, name: "Salade César" },
      { quantity: 2, name: "Tiramisu" },
    ],
    actions: ["Voir détail"],
  },
];

export const selectedOrderItems = [
  { name: "Burger Classique", price: "18,00 €", note: "Sans oignons" },
  { name: "Frites Maison", price: "4,50 €" },
  { name: "Limonade", price: "3,50 €" },
];

export const quickActions = [
  "Accepter",
  "Refuser",
  "Marquer à payer",
  "Marquer payée",
  "En préparation",
  "Prête",
  "Servie",
];

export const topProducts = [
  { name: "Burger Classique", count: "18 commandes", percentage: "w-full" },
  { name: "Salade César", count: "12 commandes", percentage: "w-2/3" },
  { name: "Limonade", count: "9 commandes", percentage: "w-1/2" },
  { name: "Tiramisu", count: "7 commandes", percentage: "w-2/5" },
];
