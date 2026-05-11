export const LOCAL_REVIEWS_STORAGE_KEY = "tableflash.localSubmittedReviews.v1";
export const LOCAL_REVIEW_CREATED_EVENT = "tableflash:local-review-created";
export const LOCAL_REVIEWS_RESET_EVENT = "tableflash:local-reviews-reset";

export type LocalReviewRating = 1 | 2 | 3 | 4 | 5;
export type LocalReviewSentiment = "Positif" | "Neutre" | "Négatif";
export type LocalReviewStatus = "Nouveau" | "À traiter" | "Répondu" | "Archivé";

export type LocalSubmittedReview = {
  id: string;
  customerName: string;
  rating: LocalReviewRating;
  comment: string;
  restaurantSlug: string;
  restaurantName: string;
  tableId: string;
  tableName: string;
  orderNumber: string;
  createdAt: string;
  time: string;
  source: "TableFlash";
  status: LocalReviewStatus;
  sentiment: LocalReviewSentiment;
  tags: string[];
  response?: string;
  googleReviewSuggested: boolean;
};

export type CreateLocalReviewInput = {
  customerName?: string;
  rating: LocalReviewRating;
  comment?: string;
  restaurantSlug: string;
  restaurantName: string;
  tableId: string;
  tableName: string;
  orderNumber: string;
};

export type LocalReviewPatch = Partial<Omit<LocalSubmittedReview, "id" | "source">> & {
  status?: LocalReviewStatus;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emitLocalReviewEvent(eventName: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
}

function makeLocalReviewId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-review-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatLocalReviewDate(date: Date) {
  return new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatLocalReviewTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getSentimentFromRating(rating: LocalReviewRating): LocalReviewSentiment {
  if (rating >= 4) {
    return "Positif";
  }

  if (rating === 3) {
    return "Neutre";
  }

  return "Négatif";
}

function getTagsFromRating(rating: LocalReviewRating) {
  if (rating >= 4) {
    return ["Client satisfait", "Après repas"];
  }

  if (rating === 3) {
    return ["Retour client", "À écouter"];
  }

  return ["Retour prioritaire", "Expérience à améliorer"];
}

function isLocalReviewRating(value: unknown): value is LocalReviewRating {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function isLocalSubmittedReview(value: unknown): value is LocalSubmittedReview {
  if (!value || typeof value !== "object") {
    return false;
  }

  const review = value as Partial<LocalSubmittedReview>;

  return (
    typeof review.id === "string" &&
    typeof review.customerName === "string" &&
    isLocalReviewRating(review.rating) &&
    typeof review.comment === "string" &&
    typeof review.restaurantSlug === "string" &&
    typeof review.restaurantName === "string" &&
    typeof review.tableId === "string" &&
    typeof review.tableName === "string" &&
    typeof review.orderNumber === "string" &&
    typeof review.createdAt === "string" &&
    typeof review.time === "string" &&
    review.source === "TableFlash" &&
    (review.status === "Nouveau" || review.status === "À traiter" || review.status === "Répondu" || review.status === "Archivé") &&
    (review.sentiment === "Positif" || review.sentiment === "Neutre" || review.sentiment === "Négatif") &&
    Array.isArray(review.tags) &&
    typeof review.googleReviewSuggested === "boolean"
  );
}

export function getLocalReviews(): LocalSubmittedReview[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const storedValue = window.localStorage.getItem(LOCAL_REVIEWS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isLocalSubmittedReview);
  } catch {
    return [];
  }
}

export function saveLocalReviews(reviews: LocalSubmittedReview[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

export function createLocalReview(input: CreateLocalReviewInput): LocalSubmittedReview {
  const now = new Date();
  const customerName = input.customerName?.trim() || "Client";
  const comment = input.comment?.trim() || "Aucun commentaire ajouté.";

  return {
    id: makeLocalReviewId(),
    customerName,
    rating: input.rating,
    comment,
    restaurantSlug: input.restaurantSlug,
    restaurantName: input.restaurantName,
    tableId: input.tableId,
    tableName: input.tableName,
    orderNumber: input.orderNumber,
    createdAt: formatLocalReviewDate(now),
    time: formatLocalReviewTime(now),
    source: "TableFlash",
    status: "Nouveau",
    sentiment: getSentimentFromRating(input.rating),
    tags: getTagsFromRating(input.rating),
    googleReviewSuggested: input.rating >= 4,
  };
}

export function findLocalReviewByOrderNumber(orderNumber: string) {
  return getLocalReviews().find((review) => review.orderNumber === orderNumber) ?? null;
}

export function hasLocalReviewForOrder(orderNumber: string) {
  return Boolean(findLocalReviewByOrderNumber(orderNumber));
}

export function addLocalReview(review: LocalSubmittedReview) {
  const existingReviews = getLocalReviews();
  const nextReviews = [review, ...existingReviews.filter((existingReview) => existingReview.id !== review.id && existingReview.orderNumber !== review.orderNumber)];

  saveLocalReviews(nextReviews);
  emitLocalReviewEvent(LOCAL_REVIEW_CREATED_EVENT);

  return review;
}

export function updateLocalReview(reviewId: string, patch: LocalReviewPatch) {
  const existingReviews = getLocalReviews();
  let updatedReview: LocalSubmittedReview | null = null;

  const nextReviews = existingReviews.map((review) => {
    if (review.id !== reviewId) {
      return review;
    }

    updatedReview = {
      ...review,
      ...patch,
      source: "TableFlash",
      status: patch.status ?? review.status,
    };

    return updatedReview;
  });

  if (updatedReview) {
    saveLocalReviews(nextReviews);
  }

  return updatedReview;
}

export function clearLocalReviews() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(LOCAL_REVIEWS_STORAGE_KEY);
  emitLocalReviewEvent(LOCAL_REVIEWS_RESET_EVENT);
}
