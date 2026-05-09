export type SummaryItem = {
  value: string;
  label: string;
  helper: string;
  tone: "emerald" | "amber" | "rose" | "sky";
};

export type CategoryItem = {
  id: string;
  name: string;
  productCount: number;
};

export type PromotionType = "Pourcentage" | "Montant offert" | "Menu spécial";

export type ProductItem = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: string;
  availability: "Disponible" | "Rupture";
  promo: "Promo" | "—";
  promotionType: PromotionType;
  promotionValue: string;
  promotionEndDate: string;
  allergens: string[];
  visible: boolean;
  imageTone: string;
};

export const categoryItems: CategoryItem[] = [
  { id: "entrees", name: "Entrées", productCount: 0 },
  { id: "plats", name: "Plats", productCount: 0 },
  { id: "desserts", name: "Desserts", productCount: 0 },
  { id: "boissons", name: "Boissons", productCount: 0 },
];

export const products: ProductItem[] = [
  {
    id: "burger-classique",
    name: "Burger Classique",
    description: "Steak haché, cheddar, salade, tomate, oignons",
    categoryId: "plats",
    price: "18,00 €",
    availability: "Disponible",
    promo: "Promo",
    promotionType: "Pourcentage",
    promotionValue: "-10 %",
    promotionEndDate: "2026-05-31",
    allergens: ["Gluten", "Lait"],
    visible: true,
    imageTone: "from-amber-200 via-orange-100 to-emerald-100",
  },
  {
    id: "salade-cesar",
    name: "Salade César",
    description: "Poulet grillé, parmesan, croûtons, sauce césar",
    categoryId: "entrees",
    price: "13,50 €",
    availability: "Disponible",
    promo: "—",
    promotionType: "Pourcentage",
    promotionValue: "",
    promotionEndDate: "",
    allergens: ["Œuf", "Lait"],
    visible: true,
    imageTone: "from-lime-200 via-emerald-100 to-stone-100",
  },
  {
    id: "frites-maison",
    name: "Frites Maison",
    description: "Frites fraîches",
    categoryId: "plats",
    price: "4,50 €",
    availability: "Disponible",
    promo: "—",
    promotionType: "Menu spécial",
    promotionValue: "",
    promotionEndDate: "",
    allergens: ["Vegan"],
    visible: true,
    imageTone: "from-yellow-200 via-amber-100 to-orange-100",
  },
  {
    id: "limonade",
    name: "Limonade",
    description: "Citron, menthe fraîche",
    categoryId: "boissons",
    price: "3,50 €",
    availability: "Disponible",
    promo: "—",
    promotionType: "Pourcentage",
    promotionValue: "",
    promotionEndDate: "",
    allergens: ["Sans"],
    visible: true,
    imageTone: "from-cyan-100 via-lime-100 to-emerald-100",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    description: "Mascarpone, café, biscuits, cacao",
    categoryId: "desserts",
    price: "6,50 €",
    availability: "Disponible",
    promo: "Promo",
    promotionType: "Pourcentage",
    promotionValue: "-15 %",
    promotionEndDate: "2026-06-15",
    allergens: ["Gluten", "Lait", "Œuf"],
    visible: true,
    imageTone: "from-stone-300 via-amber-100 to-yellow-50",
  },
  {
    id: "cafe-gourmand",
    name: "Café gourmand",
    description: "Assortiment de mini desserts et un café",
    categoryId: "desserts",
    price: "7,50 €",
    availability: "Rupture",
    promo: "—",
    promotionType: "Montant offert",
    promotionValue: "",
    promotionEndDate: "",
    allergens: ["Gluten", "Lait"],
    visible: false,
    imageTone: "from-stone-300 via-zinc-100 to-slate-100",
  },
];

export const summaryItems: SummaryItem[] = [
  { value: "4", label: "Catégories", helper: "Toutes vos catégories", tone: "emerald" },
  { value: "5", label: "Produits actifs", helper: "Disponibles à la vente", tone: "sky" },
  { value: "1", label: "Produit en rupture", helper: "Non disponible", tone: "rose" },
  { value: "2", label: "Promotions actives", helper: "En cours", tone: "amber" },
];
