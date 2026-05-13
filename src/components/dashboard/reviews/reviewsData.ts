export type Review = {
  id: string;
  customerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  tableName: string;
  orderNumber: string;
  createdAt: string;
  time: string;
  source: "TableFlash" | "Google";
  status: "Nouveau" | "À traiter" | "Répondu" | "Archivé";
  sentiment: "Positif" | "Neutre" | "Négatif";
  tags: string[];
  response?: string;
  googleReviewSuggested: boolean;
};

export type ReviewFilter = "Tous" | "Nouveaux" | "À traiter" | "Positifs" | "Négatifs" | "Google" | "Répondus" | "Archivés";

export type ReviewSort = "Plus récents" | "Meilleure note" | "Moins bonne note" | "À traiter d’abord";

export const reviewFilters: ReviewFilter[] = ["Tous", "Nouveaux", "À traiter", "Positifs", "Négatifs", "Google", "Répondus", "Archivés"];

export const reviewSorts: ReviewSort[] = ["Plus récents", "Meilleure note", "Moins bonne note", "À traiter d’abord"];

export const initialReviews: Review[] = [
  {
    id: "review-1",
    customerName: "Camille",
    rating: 5,
    comment: "Service rapide, menu clair et commande très simple depuis la table.",
    tableName: "Table 1",
    orderNumber: "#2002",
    createdAt: "2026-05-11",
    time: "12:48",
    source: "TableFlash",
    status: "Nouveau",
    sentiment: "Positif",
    tags: ["Service rapide", "Commande QR", "Burger"],
    googleReviewSuggested: false,
  },
  {
    id: "review-2",
    customerName: "Nicolas",
    rating: 4,
    comment: "Très pratique pour commander sans attendre. L’expérience était fluide.",
    tableName: "Terrasse 3",
    orderNumber: "#2001",
    createdAt: "2026-05-11",
    time: "12:36",
    source: "TableFlash",
    status: "Nouveau",
    sentiment: "Positif",
    tags: ["Terrasse", "Boissons"],
    googleReviewSuggested: false,
  },
  {
    id: "review-3",
    customerName: "Laura",
    rating: 3,
    comment: "Bonne expérience, l’équipe a été réactive.",
    tableName: "Table 7",
    orderNumber: "#1254",
    createdAt: "2026-05-11",
    time: "12:24",
    source: "TableFlash",
    status: "À traiter",
    sentiment: "Neutre",
    tags: ["Attente", "Service"],
    googleReviewSuggested: false,
  },
  {
    id: "review-4",
    customerName: "Mehdi",
    rating: 2,
    comment: "Le service était un peu long, mais la commande était simple à passer.",
    tableName: "Table 12",
    orderNumber: "#1257",
    createdAt: "2026-05-11",
    time: "12:18",
    source: "TableFlash",
    status: "À traiter",
    sentiment: "Négatif",
    tags: ["Retard", "Préparation"],
    googleReviewSuggested: false,
  },
  {
    id: "review-5",
    customerName: "Inès",
    rating: 5,
    comment: "Accueil chaleureux, carte lisible et service attentionné.",
    tableName: "Comptoir",
    orderNumber: "#1255",
    createdAt: "2026-05-11",
    time: "11:58",
    source: "Google",
    status: "Répondu",
    sentiment: "Positif",
    tags: ["Personnel", "QR simple"],
    response: "Merci beaucoup Inès, au plaisir de vous revoir bientôt.",
    googleReviewSuggested: false,
  },
  {
    id: "review-6",
    customerName: "Antoine",
    rating: 5,
    comment: "Commande rapide depuis la table et desserts excellents.",
    tableName: "Table 2",
    orderNumber: "#1256",
    createdAt: "2026-05-11",
    time: "11:45",
    source: "TableFlash",
    status: "Archivé",
    sentiment: "Positif",
    tags: ["Concept", "Rapidité"],
    googleReviewSuggested: true,
  },
];
