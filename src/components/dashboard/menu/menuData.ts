export type SummaryItem = {
  value: string;
  label: string;
  helper: string;
  tone: "emerald" | "amber" | "rose" | "sky";
};

export type CategoryItem = {
  name: string;
  productCount: number;
};

export type ProductItem = {
  name: string;
  description: string;
  price: string;
  availability: "Disponible" | "Rupture";
  promo: "Promo" | "—";
  allergens: string[];
  visible: boolean;
  imageTone: string;
};

export const summaryItems: SummaryItem[] = [
  { value: "4", label: "Catégories", helper: "Toutes vos catégories", tone: "emerald" },
  { value: "18", label: "Produits actifs", helper: "Disponibles à la vente", tone: "sky" },
  { value: "1", label: "Produit en rupture", helper: "Non disponible", tone: "rose" },
  { value: "2", label: "Promotions actives", helper: "En cours", tone: "amber" },
];

export const categoryItems: CategoryItem[] = [
  { name: "Entrées", productCount: 4 },
  { name: "Plats", productCount: 7 },
  { name: "Desserts", productCount: 3 },
  { name: "Boissons", productCount: 4 },
];

export const products: ProductItem[] = [
  {
    name: "Burger Classique",
    description: "Steak haché, cheddar, salade, tomate, oignons",
    price: "18,00 €",
    availability: "Disponible",
    promo: "Promo",
    allergens: ["Gluten", "Lait"],
    visible: true,
    imageTone: "from-amber-200 via-orange-100 to-emerald-100",
  },
  {
    name: "Salade César",
    description: "Poulet grillé, parmesan, croûtons, sauce césar",
    price: "13,50 €",
    availability: "Disponible",
    promo: "—",
    allergens: ["Œuf", "Lait"],
    visible: true,
    imageTone: "from-lime-200 via-emerald-100 to-stone-100",
  },
  {
    name: "Frites Maison",
    description: "Frites fraîches",
    price: "4,50 €",
    availability: "Disponible",
    promo: "—",
    allergens: ["Vegan"],
    visible: true,
    imageTone: "from-yellow-200 via-amber-100 to-orange-100",
  },
  {
    name: "Limonade",
    description: "Citron, menthe fraîche",
    price: "3,50 €",
    availability: "Disponible",
    promo: "—",
    allergens: ["Sans"],
    visible: true,
    imageTone: "from-cyan-100 via-lime-100 to-emerald-100",
  },
  {
    name: "Tiramisu",
    description: "Mascarpone, café, biscuits, cacao",
    price: "6,50 €",
    availability: "Disponible",
    promo: "Promo",
    allergens: ["Gluten", "Lait", "Œuf"],
    visible: true,
    imageTone: "from-stone-300 via-amber-100 to-yellow-50",
  },
  {
    name: "Café gourmand",
    description: "Assortiment de mini desserts et un café",
    price: "7,50 €",
    availability: "Rupture",
    promo: "—",
    allergens: ["Gluten", "Lait"],
    visible: false,
    imageTone: "from-stone-300 via-zinc-100 to-slate-100",
  },
];
