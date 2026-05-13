import type { ProductVisualPresetId } from "@/components/shared/ProductImage";

export type PublicMenuCategory = string;

export type PublicMenuProduct = {
  id: string;
  category: PublicMenuCategory;
  name: string;
  price: number;
  description: string;
  allergens: string[];
  available: boolean;
  promo: boolean;
  promoLabel?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  visualPreset?: ProductVisualPresetId;
  imageTone?: string;
};

export type PublicRestaurant = {
  name: string;
  slug: string;
  serviceStatus: "open" | "closed";
  paymentNote: string;
};

export type PublicCartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

export type ConfirmedOrder = {
  orderNumber: string;
  restaurantSlug: string;
  restaurantName: string;
  tableId: string;
  tableName: string;
  total: number;
  items: PublicCartItem[];
  customerNote?: string;
};
