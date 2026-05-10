"use client";

import { useEffect, useMemo, useState } from "react";
import { addLocalOrder, createLocalOrder } from "@/lib/localOrders";
import { PublicCartBar } from "./PublicCartBar";
import { PublicCartDrawer } from "./PublicCartDrawer";
import { PublicEmptyState } from "./PublicEmptyState";
import { PublicMenuCategoryTabs } from "./PublicMenuCategoryTabs";
import { PublicMenuHeader } from "./PublicMenuHeader";
import { PublicOrderConfirmation } from "./PublicOrderConfirmation";
import { PublicPaymentNotice } from "./PublicPaymentNotice";
import { PublicProductCard } from "./PublicProductCard";
import { PublicProductDetailModal } from "./PublicProductDetailModal";
import { publicMenuCategories, publicMenuProducts, publicRestaurant } from "./publicMenuData";
import type { ConfirmedOrder, PublicCartItem, PublicMenuCategory, PublicMenuProduct } from "./types";

type InteractivePublicMenuProps = {
  restaurantSlug: string;
  tableId: string;
  tableName: string;
};

type Toast = {
  id: number;
  message: string;
};

function makeCartKey(productId: string, note?: string) {
  return `${productId}::${note?.trim() ?? ""}`;
}

export function InteractivePublicMenu({ restaurantSlug, tableId, tableName }: InteractivePublicMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<PublicMenuCategory>(publicMenuCategories[0]);
  const [cartItems, setCartItems] = useState<PublicCartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PublicMenuProduct | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productNote, setProductNote] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [globalNote, setGlobalNote] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const restaurant = publicRestaurant.slug === restaurantSlug ? publicRestaurant : publicRestaurant;
  const orderingDisabled = restaurant.serviceStatus !== "open";

  const categoryCounts = useMemo(
    () =>
      publicMenuCategories.reduce<Record<PublicMenuCategory, number>>((counts, category) => {
        counts[category] = publicMenuProducts.filter((product) => product.category === category).length;
        return counts;
      }, {} as Record<PublicMenuCategory, number>),
    [],
  );

  const cartQuantitiesByProduct = useMemo(
    () =>
      cartItems.reduce<Record<string, number>>((quantities, item) => {
        quantities[item.productId] = (quantities[item.productId] ?? 0) + item.quantity;
        return quantities;
      }, {}),
    [cartItems],
  );

  const visibleProducts = useMemo(
    () => publicMenuProducts.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  );

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  function showToast(message: string) {
    setToast({ id: Date.now(), message });
  }

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 2400);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setSelectedProduct(null);
      setIsCartOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function addProductToCart(product: PublicMenuProduct, quantity = 1, note = "") {
    if (!product.available || orderingDisabled) {
      return;
    }

    const normalizedNote = note.trim();
    const nextItem: PublicCartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      note: normalizedNote || undefined,
    };

    setCartItems((currentItems) => {
      const nextKey = makeCartKey(nextItem.productId, nextItem.note);
      const existingItem = currentItems.find((item) => makeCartKey(item.productId, item.note) === nextKey);

      if (!existingItem) {
        return [...currentItems, nextItem];
      }

      return currentItems.map((item) =>
        makeCartKey(item.productId, item.note) === nextKey
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    });
    showToast("Produit ajouté au panier.");
  }

  function handleOpenProduct(product: PublicMenuProduct) {
    setSelectedProduct(product);
    setProductQuantity(1);
    setProductNote("");
  }

  function handleAddSelectedProduct() {
    if (!selectedProduct) {
      return;
    }

    addProductToCart(selectedProduct, productQuantity, productNote);
    setSelectedProduct(null);
  }

  function handleIncrease(productId: string, note?: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId && item.note === note ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function handleDecrease(productId: string, note?: string) {
    setCartItems((currentItems) => {
      const itemToDecrease = currentItems.find((item) => item.productId === productId && item.note === note);
      const nextItems = currentItems
        .map((item) =>
          item.productId === productId && item.note === note ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0);

      if (itemToDecrease && itemToDecrease.quantity <= 1) {
        showToast("Produit retiré du panier.");
      }

      return nextItems;
    });
  }

  function handleRemove(productId: string, note?: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => !(item.productId === productId && item.note === note)),
    );
    showToast("Produit retiré du panier.");
  }

  function handleItemNoteChange(productId: string, note: string | undefined, nextNote: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId && item.note === note
          ? { ...item, note: nextNote.trim() ? nextNote : undefined }
          : item,
      ),
    );
  }

  function handleValidateOrder() {
    if (cartItems.length === 0) {
      showToast("Ajoutez au moins un produit avant de confirmer.");
      return;
    }

    const localOrder = addLocalOrder(createLocalOrder({
      restaurantSlug,
      restaurantName: restaurant.name,
      tableId,
      tableName,
      customerNote: globalNote,
      total: cartTotal,
      items: cartItems.map((item) => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        note: item.note,
      })),
    }));

    const order: ConfirmedOrder = {
      orderNumber: localOrder.orderNumber,
      tableName: localOrder.tableName,
      total: localOrder.total,
      items: cartItems,
    };

    setConfirmedOrder(order);
    setCartItems([]);
    setGlobalNote("");
    setIsCartOpen(false);
    showToast("Commande transmise au restaurant.");
  }

  function handleBackToMenu() {
    setConfirmedOrder(null);
  }

  function handleNewOrder() {
    setConfirmedOrder(null);
    setSelectedCategory(publicMenuCategories[0]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#D1FAE5_0,#F8FAFC_36%,#F1F5F9_100%)] text-slate-950 md:px-6 md:py-8">
      <div className="mx-auto min-h-screen w-full max-w-[460px] overflow-hidden bg-[#F8FAF7] shadow-none ring-0 md:min-h-[calc(100vh-4rem)] md:rounded-[2.25rem] md:shadow-2xl md:shadow-emerald-950/20 md:ring-1 md:ring-white/80">
        <PublicMenuHeader restaurant={restaurant} tableName={tableName} />

        <div className="px-4 pb-36 pt-5">
          <section className="rounded-[1.75rem] border border-white bg-white/95 p-5 shadow-lg shadow-emerald-950/5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Bienvenue à table</p>
            <h2 className="mt-2 text-[1.7rem] font-black tracking-[-0.05em] text-slate-950">Commandez à votre rythme</h2>
            <p className="mt-3 text-[0.95rem] leading-6 text-slate-600">
              Choisissez vos produits, ajoutez une note si besoin, puis confirmez votre commande. Le règlement se fait ensuite à la caisse ou auprès du serveur.
            </p>
          </section>

          <div className="mt-4">
            <PublicPaymentNotice note={restaurant.paymentNote} />
          </div>

          {orderingDisabled ? (
            <div className="mt-4 rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-800">
              Le service est momentanément fermé.
            </div>
          ) : null}

          <div className="mt-5">
            <PublicMenuCategoryTabs
              categories={publicMenuCategories}
              categoryCounts={categoryCounts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <section className="mt-5" aria-labelledby="products-heading">
            <div className="mb-4 flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">La carte</p>
                <h2 id="products-heading" className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {selectedCategory}
                </h2>
              </div>
              <p className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">{visibleProducts.length} choix</p>
            </div>

            {visibleProducts.length === 0 ? (
              <PublicEmptyState title="Aucun produit disponible." text="Choisissez une autre catégorie du menu." />
            ) : (
              <div className="space-y-3.5">
                {visibleProducts.map((product) => (
                  <PublicProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={cartQuantitiesByProduct[product.id] ?? 0}
                    orderingDisabled={orderingDisabled}
                    onOpenProduct={handleOpenProduct}
                    onQuickAdd={(quickProduct) => addProductToCart(quickProduct)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {toast ? (
        <div className="fixed inset-x-0 top-3 z-[70] flex justify-center px-3" role="status" aria-live="polite">
          <div className="w-full max-w-[460px] rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-slate-950/20">
            {toast.message}
          </div>
        </div>
      ) : null}

      <PublicProductDetailModal
        product={selectedProduct}
        quantity={productQuantity}
        note={productNote}
        orderingDisabled={orderingDisabled}
        onQuantityChange={setProductQuantity}
        onNoteChange={setProductNote}
        onAddToCart={handleAddSelectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <PublicCartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        tableName={tableName}
        paymentNote={restaurant.paymentNote}
        globalNote={globalNote}
        total={cartTotal}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
        onItemNoteChange={handleItemNoteChange}
        onGlobalNoteChange={setGlobalNote}
        onClose={() => setIsCartOpen(false)}
        onValidateOrder={handleValidateOrder}
      />

      <PublicOrderConfirmation
        order={confirmedOrder}
        paymentNote="Le règlement se fera à la caisse ou auprès du serveur."
        onBackToMenu={handleBackToMenu}
        onNewOrder={handleNewOrder}
      />

      <PublicCartBar itemCount={itemCount} total={cartTotal} onOpenCart={() => setIsCartOpen(true)} />
    </main>
  );
}
