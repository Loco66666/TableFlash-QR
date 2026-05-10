"use client";

import { useEffect, useMemo, useState } from "react";
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
  tableName: string;
};

type Toast = {
  id: number;
  message: string;
};

function makeCartKey(productId: string, note?: string) {
  return `${productId}::${note?.trim() ?? ""}`;
}

function makeOrderNumber() {
  return `#${Math.floor(1000 + Math.random() * 9000)}`;
}

export function InteractivePublicMenu({ restaurantSlug, tableName }: InteractivePublicMenuProps) {
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
      showToast("Ajoutez au moins un produit avant de valider.");
      return;
    }

    const order: ConfirmedOrder = {
      orderNumber: makeOrderNumber(),
      tableName,
      total: cartTotal,
      items: cartItems,
    };

    setConfirmedOrder(order);
    setCartItems([]);
    setGlobalNote("");
    setIsCartOpen(false);
    showToast("Commande envoyée au restaurant.");
  }

  function handleBackToMenu() {
    setConfirmedOrder(null);
  }

  function handleNewOrder() {
    setConfirmedOrder(null);
    setSelectedCategory(publicMenuCategories[0]);
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-slate-950">
      <div className="mx-auto min-h-screen max-w-[520px] bg-[#F9FAFB] shadow-2xl shadow-slate-950/10">
        <PublicMenuHeader restaurant={restaurant} tableName={tableName} />

        <div className="px-4 pb-28 pt-5">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-900/5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Bienvenue</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">Commandez depuis votre table</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Ajoutez vos plats au panier, validez votre commande, puis réglez à la caisse ou auprès du serveur.
            </p>
          </section>

          {orderingDisabled ? (
            <div className="mt-4 rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-800">
              Le service est momentanément fermé.
            </div>
          ) : null}

          <div className="mt-5">
            <PublicMenuCategoryTabs categories={publicMenuCategories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>

          <section className="mt-5" aria-labelledby="products-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-emerald-700">Menu</p>
                <h2 id="products-heading" className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {selectedCategory}
                </h2>
              </div>
              <p className="text-sm font-bold text-slate-400">{visibleProducts.length} choix</p>
            </div>

            {visibleProducts.length === 0 ? (
              <PublicEmptyState title="Aucun produit disponible." text="Choisissez une autre catégorie du menu." />
            ) : (
              <div className="space-y-3">
                {visibleProducts.map((product) => (
                  <PublicProductCard
                    key={product.id}
                    product={product}
                    orderingDisabled={orderingDisabled}
                    onOpenProduct={handleOpenProduct}
                    onQuickAdd={(quickProduct) => addProductToCart(quickProduct)}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="mt-6">
            <PublicPaymentNotice note={restaurant.paymentNote} />
          </div>
        </div>
      </div>

      {toast ? (
        <div className="fixed inset-x-0 top-3 z-[70] flex justify-center px-3" role="status" aria-live="polite">
          <div className="w-full max-w-[520px] rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-slate-950/20">
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
