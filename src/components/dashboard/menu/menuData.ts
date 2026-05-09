export type SummaryItem = {
  value: string;
  label: string;
  helper: string;
  tone: "emerald" | "amber" | "rose" | "sky";
};

export type CategoryItem = {
  id: string;
  name: string;
};

export type PromoType = "Pourcentage" | "Montant fixe";

export type ProductItem = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: string;
  allergens: string[];
  available: boolean;
  promo: boolean;
  visible: boolean;
  promoType: PromoType;
  promoValue: string;
  promoEndDate: string;
  imageTone: string;
};

export type ProductDraft = Omit<ProductItem, "id" | "imageTone">;

export const categoryItems: CategoryItem[] = [
  { id: "entrees", name: "Entrées" },
  { id: "plats", name: "Plats" },
  { id: "desserts", name: "Desserts" },
  { id: "boissons", name: "Boissons" },
];

export const products: ProductItem[] = [
  {
    id: "burger-classique",
    name: "Burger Classique",
    description: "Steak haché, cheddar, salade, tomate, oignons rouges, sauce maison.",
    categoryId: "plats",
    price: "18,00 €",
    allergens: ["Gluten", "Lait"],
    available: true,
    promo: true,
    visible: true,
    promoType: "Pourcentage",
    promoValue: "-10 %",
    promoEndDate: "2026-05-31",
    imageTone: "from-amber-200 via-orange-100 to-emerald-100",
  },
  {
    id: "salade-cesar",
    name: "Salade César",
    description: "Poulet grillé, parmesan, croûtons, sauce césar",
    categoryId: "entrees",
    price: "13,50 €",
    allergens: ["Œuf", "Lait"],
    available: true,
    promo: false,
    visible: true,
    promoType: "Pourcentage",
    promoValue: "",
    promoEndDate: "",
    imageTone: "from-lime-200 via-emerald-100 to-stone-100",
  },
  {
    id: "frites-maison",
    name: "Frites Maison",
    description: "Frites fraîches",
    categoryId: "plats",
    price: "4,50 €",
    allergens: ["Vegan"],
    available: true,
    promo: false,
    visible: true,
    promoType: "Pourcentage",
    promoValue: "",
    promoEndDate: "",
    imageTone: "from-yellow-200 via-amber-100 to-orange-100",
  },
  {
    id: "limonade",
    name: "Limonade",
    description: "Citron, menthe fraîche",
    categoryId: "boissons",
    price: "3,50 €",
    allergens: ["Sans"],
    available: true,
    promo: false,
    visible: true,
    promoType: "Pourcentage",
    promoValue: "",
    promoEndDate: "",
    imageTone: "from-cyan-100 via-lime-100 to-emerald-100",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    description: "Mascarpone, café, biscuits, cacao",
    categoryId: "desserts",
    price: "6,50 €",
    allergens: ["Gluten", "Lait", "Œuf"],
    available: true,
    promo: true,
    visible: true,
    promoType: "Pourcentage",
    promoValue: "-10 %",
    promoEndDate: "2026-05-31",
    imageTone: "from-stone-300 via-amber-100 to-yellow-50",
  },
  {
    id: "cafe-gourmand",
    name: "Café gourmand",
    description: "Assortiment de mini desserts et un café",
    categoryId: "desserts",
    price: "7,50 €",
    allergens: ["Gluten", "Lait"],
    available: false,
    promo: false,
    visible: false,
    promoType: "Pourcentage",
    promoValue: "",
    promoEndDate: "",
    imageTone: "from-stone-300 via-zinc-100 to-slate-100",
  },
];

export const summaryItems: SummaryItem[] = [
  { value: "4", label: "Catégories", helper: "Toutes vos catégories", tone: "emerald" },
  { value: "18", label: "Produits actifs", helper: "Disponibles à la vente", tone: "sky" },
  { value: "1", label: "Produit en rupture", helper: "Non disponible", tone: "rose" },
  { value: "2", label: "Promotions actives", helper: "En cours", tone: "amber" },
];
