import { categoryItems, products as fallbackProducts, type CategoryItem, type ProductItem } from "@/components/dashboard/menu/menuData";
import type { PublicMenuProduct } from "@/components/public-menu/types";

export const LOCAL_MENU_STORAGE_KEY = "tableflash.local-menu.v1";

type StoredLocalMenu = {
  categories: CategoryItem[];
  products: ProductItem[];
};

const canonicalCategoryOrderByName: Record<string, number> = {
  entrees: 10,
  plats: 20,
  desserts: 30,
  boissons: 40,
  menus: 50,
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isStoredLocalMenu(value: unknown): value is StoredLocalMenu {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<StoredLocalMenu>;

  return Array.isArray(candidate.categories) && Array.isArray(candidate.products);
}

function normalizeCategoryName(value: string) {
  return value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function withStableCategoryOrder(categories: CategoryItem[]): CategoryItem[] {
  return categories
    .map((category, index) => {
      const canonicalOrder = canonicalCategoryOrderByName[normalizeCategoryName(category.name)];
      const order = typeof category.order === "number" ? category.order : canonicalOrder ?? 1000 + index;

      return {
        ...category,
        order,
        createdAt: category.createdAt ?? `2026-01-01T00:${String(index).padStart(2, "0")}:00.000Z`,
      };
    })
    .sort((firstCategory, secondCategory) => {
      if ((firstCategory.order ?? 0) !== (secondCategory.order ?? 0)) {
        return (firstCategory.order ?? 0) - (secondCategory.order ?? 0);
      }

      return (firstCategory.createdAt ?? "").localeCompare(secondCategory.createdAt ?? "");
    });
}

export function resequenceCategories(categories: CategoryItem[]): CategoryItem[] {
  return categories.map((category, index) => ({
    ...category,
    order: (index + 1) * 10,
    createdAt: category.createdAt ?? new Date(0).toISOString(),
  }));
}

export function getFallbackLocalMenu(): StoredLocalMenu {
  return {
    categories: withStableCategoryOrder(categoryItems),
    products: fallbackProducts,
  };
}

export function readLocalMenu(): StoredLocalMenu {
  if (!canUseLocalStorage()) {
    return getFallbackLocalMenu();
  }

  const storedValue = window.localStorage.getItem(LOCAL_MENU_STORAGE_KEY);
  if (!storedValue) {
    return getFallbackLocalMenu();
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isStoredLocalMenu(parsedValue)) {
      return getFallbackLocalMenu();
    }

    return {
      categories: parsedValue.categories.length > 0 ? withStableCategoryOrder(parsedValue.categories) : getFallbackLocalMenu().categories,
      products: parsedValue.products.length > 0 ? parsedValue.products : fallbackProducts,
    };
  } catch {
    return getFallbackLocalMenu();
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

export function toPublicMenuCategories(categories: CategoryItem[], products: ProductItem[]): string[] {
  const categoryNames = withStableCategoryOrder(categories).map((category) => category.name);
  const publicProducts = toPublicMenuProducts(products, categories);
  const extraProductCategories = publicProducts
    .map((product) => product.category)
    .filter((categoryName) => !categoryNames.includes(categoryName));

  return [...categoryNames, ...Array.from(new Set(extraProductCategories))];
}
