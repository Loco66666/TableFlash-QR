import { categoryItems, products as fallbackProducts, type CategoryItem, type ProductItem } from "@/components/dashboard/menu/menuData";
import type { PublicMenuProduct } from "@/components/public-menu/types";

export const LOCAL_MENU_STORAGE_KEY = "tableflash.local-menu.v1";

type StoredLocalMenu = {
  categories: CategoryItem[];
  products: ProductItem[];
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isStoredLocalMenu(value: unknown): value is StoredLocalMenu {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<StoredLocalMenu>;

  return Array.isArray(candidate.categories) && Array.isArray(candidate.products);
}

export function readLocalMenu(): StoredLocalMenu {
  if (!canUseLocalStorage()) {
    return { categories: categoryItems, products: fallbackProducts };
  }

  const storedValue = window.localStorage.getItem(LOCAL_MENU_STORAGE_KEY);
  if (!storedValue) {
    return { categories: categoryItems, products: fallbackProducts };
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isStoredLocalMenu(parsedValue)) {
      return { categories: categoryItems, products: fallbackProducts };
    }

    return {
      categories: parsedValue.categories.length > 0 ? parsedValue.categories : categoryItems,
      products: parsedValue.products.length > 0 ? parsedValue.products : fallbackProducts,
    };
  } catch {
    return { categories: categoryItems, products: fallbackProducts };
  }
}

export function saveLocalMenu(menu: StoredLocalMenu) {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(LOCAL_MENU_STORAGE_KEY, JSON.stringify(menu));
}

export function toPublicMenuProducts(products: ProductItem[], categories: CategoryItem[]): PublicMenuProduct[] {
  const categoryNameById = categories.reduce<Record<string, string>>((names, category) => {
    names[category.id] = category.name;
    return names;
  }, {});

  return products
    .filter((product) => product.visible)
    .map((product) => ({
      id: product.id,
      category: categoryNameById[product.categoryId] ?? "Sans catégorie",
      name: product.name,
      price: product.price,
      description: product.description,
      allergens: product.allergens,
      available: product.available,
      promo: product.promo,
      promoLabel: product.promo ? product.promoValue || undefined : undefined,
      imageUrl: product.imageUrl ?? null,
      imageAlt: product.imageAlt,
      visualPreset: product.visualPreset,
      imageTone: product.imageTone,
    }));
}
