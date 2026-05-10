import { formatEuro } from "@/lib/formatters";

export const LOCAL_ORDERS_STORAGE_KEY = "tableflash.localSubmittedOrders.v1";
export const LOCAL_ORDER_CREATED_EVENT = "tableflash:local-order-created";
export const LOCAL_ORDER_UPDATED_EVENT = "tableflash:local-order-updated";
export const LOCAL_ORDER_RESET_EVENT = "tableflash:local-orders-reset";

export type LocalOrderStatus =
  | "Nouvelle"
  | "Acceptée"
  | "À payer"
  | "Payée"
  | "En préparation"
  | "Prête"
  | "Servie"
  | "Refusée"
  | "Annulée";

export type LocalPaymentStatus = "À payer" | "Payée" | "Annulée";

export type LocalSubmittedOrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
};

export type LocalSubmittedOrder = {
  id: string;
  orderNumber: string;
  restaurantSlug: string;
  restaurantName: string;
  tableId: string;
  tableName: string;
  status: LocalOrderStatus;
  paymentStatus: LocalPaymentStatus;
  createdAt: string;
  acceptedAt?: string;
  preparationStartedAt?: string;
  time: string;
  customerNote: string;
  total: number;
  items: LocalSubmittedOrderItem[];
  source: "public-menu";
  estimatedPrepMinutes: number;
  mockElapsedMinutes: number;
};

export type CreateLocalOrderInput = {
  restaurantSlug: string;
  restaurantName: string;
  tableId: string;
  tableName: string;
  customerNote?: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    note?: string;
  }>;
};

export type LocalDashboardOrder = {
  orderNumber: string;
  table: string;
  time: string;
  status: LocalOrderStatus;
  paymentStatus: LocalPaymentStatus;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    price?: string;
    note?: string;
  }>;
  createdAt: string;
  acceptedAt?: string;
  preparationStartedAt?: string;
  estimatedPrepMinutes: number;
  mockElapsedMinutes: number;
  note?: string;
  source: "public-menu";
  localOrderId: string;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emitLocalOrderEvent(eventName: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
}

function isLocalSubmittedOrder(value: unknown): value is LocalSubmittedOrder {
  if (!value || typeof value !== "object") {
    return false;
  }

  const order = value as Partial<LocalSubmittedOrder>;

  return (
    typeof order.id === "string" &&
    typeof order.orderNumber === "string" &&
    typeof order.restaurantSlug === "string" &&
    typeof order.restaurantName === "string" &&
    typeof order.tableId === "string" &&
    typeof order.tableName === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.time === "string" &&
    typeof order.total === "number" &&
    order.source === "public-menu" &&
    Array.isArray(order.items)
  );
}

function makeLocalOrderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-order-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getNextOrderNumber(existingOrders: LocalSubmittedOrder[]) {
  const highestPublicOrderNumber = existingOrders.reduce((highestOrderNumber, order) => {
    const parsedOrderNumber = Number.parseInt(order.orderNumber.replace("#", ""), 10);

    if (!Number.isFinite(parsedOrderNumber)) {
      return highestOrderNumber;
    }

    return Math.max(highestOrderNumber, parsedOrderNumber);
  }, 2000);

  return `#${highestPublicOrderNumber + 1}`;
}

function formatLocalOrderTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getLocalOrders(): LocalSubmittedOrder[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const storedValue = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isLocalSubmittedOrder);
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders: LocalSubmittedOrder[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function createLocalOrder(input: CreateLocalOrderInput): LocalSubmittedOrder {
  const now = new Date();
  const existingOrders = getLocalOrders();

  return {
    id: makeLocalOrderId(),
    orderNumber: getNextOrderNumber(existingOrders),
    restaurantSlug: input.restaurantSlug,
    restaurantName: input.restaurantName,
    tableId: input.tableId,
    tableName: input.tableName,
    status: "Nouvelle",
    paymentStatus: "À payer",
    createdAt: now.toISOString(),
    time: formatLocalOrderTime(now),
    customerNote: input.customerNote?.trim() ?? "",
    total: input.total,
    items: input.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      note: item.note?.trim() || undefined,
    })),
    source: "public-menu",
    estimatedPrepMinutes: 12,
    mockElapsedMinutes: 0,
  };
}

export function addLocalOrder(order: LocalSubmittedOrder) {
  const existingOrders = getLocalOrders();
  const nextOrders = [order, ...existingOrders.filter((existingOrder) => existingOrder.id !== order.id && existingOrder.orderNumber !== order.orderNumber)];

  saveLocalOrders(nextOrders);
  emitLocalOrderEvent(LOCAL_ORDER_CREATED_EVENT);

  return order;
}

export function updateLocalOrder(orderNumber: string, patch: Partial<LocalSubmittedOrder>) {
  const existingOrders = getLocalOrders();
  let updatedOrder: LocalSubmittedOrder | null = null;

  const nextOrders = existingOrders.map((order) => {
    if (order.orderNumber !== orderNumber) {
      return order;
    }

    updatedOrder = { ...order, ...patch, orderNumber: order.orderNumber, id: order.id, source: "public-menu" };
    return updatedOrder;
  });

  if (!updatedOrder) {
    return null;
  }

  saveLocalOrders(nextOrders);
  emitLocalOrderEvent(LOCAL_ORDER_UPDATED_EVENT);

  return updatedOrder;
}

export function clearLocalOrders() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(LOCAL_ORDERS_STORAGE_KEY);
  emitLocalOrderEvent(LOCAL_ORDER_RESET_EVENT);
}

export function mapLocalOrderToDashboardOrder(order: LocalSubmittedOrder): LocalDashboardOrder {
  return {
    orderNumber: order.orderNumber,
    table: order.tableName,
    time: order.time,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: formatEuro(order.total),
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: formatEuro(item.price * item.quantity),
      note: item.note,
    })),
    createdAt: order.createdAt,
    acceptedAt: order.acceptedAt,
    preparationStartedAt: order.preparationStartedAt,
    estimatedPrepMinutes: order.estimatedPrepMinutes,
    mockElapsedMinutes: order.mockElapsedMinutes,
    note: order.customerNote || undefined,
    source: "public-menu",
    localOrderId: order.id,
  };
}
