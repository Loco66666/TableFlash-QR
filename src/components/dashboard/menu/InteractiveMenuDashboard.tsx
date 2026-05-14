"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DashboardHeader } from "@/components/dashboard";
import { formatEuro, formatPromotionValue, parseEuroInput } from "@/lib/formatters";
import { getFallbackLocalMenu, readLocalMenu, resequenceCategories, saveLocalMenu, withStableCategoryOrder } from "@/lib/localMenu";

import { CategoryList } from "./CategoryList";
import { MenuSummaryCard } from "./MenuSummaryCard";
import { ProductEditPanel } from "./ProductEditPanel";
import { ProductTable, type ActiveMenuFilter, type RowActionState } from "./ProductTable";
import { MobilePreview, PublicMenuPreview } from "./PublicMenuPreview";
import { RestaurantSelectorCard } from "./RestaurantSelectorCard";
import type { CategoryItem, ProductDraft, ProductItem, SummaryItem } from "./menuData";

const blankProductDraft = (categoryId: string): ProductDraft => ({
  name: "",
  description: "",
  categoryId,
  price: "",
  allergens: [],
  available: true,
  promo: false,
  visible: true,
  promoType: "Pourcentage",
  promoValue: "",
  promoEndDate: "",
  imageUrl: null,
  imageAlt: "",
  visualPreset: "auto",
});

const imageTones = [
  "from-amber-200 via-orange-100 to-emerald-100",
  "from-lime-200 via-emerald-100 to-stone-100",
  "from-yellow-200 via-amber-100 to-orange-100",
  "from-cyan-100 via-lime-100 to-emerald-100",
  "from-stone-300 via-amber-100 to-yellow-50",
];

const initialMenu = getFallbackLocalMenu();

export function InteractiveMenuDashboard() {
  const [mounted, setMounted] = useState(false);
  const [hasLoadedLocalMenu, setHasLoadedLocalMenu] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>(initialMenu.products);
  const [categories, setCategories] = useState<CategoryItem[]>(initialMenu.categories);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialMenu.products[0]?.id ?? null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveMenuFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDraft | null>(() => productToDraft(initialMenu.products[0]));
  const [newProductDraft, setNewProductDraft] = useState<ProductDraft>(() => blankProductDraft(initialMenu.categories[0]?.id ?? "general"));
  const [newCategoryName, setNewCategoryName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rowAction, setRowAction] = useState<RowActionState | null>(null);
  const [reorderMode, setReorderMode] = useState(false);
  const editPanelRef = useRef<HTMLDivElement>(null);

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null;

  useEffect(() => {
    const mountedTimer = window.setTimeout(() => setMounted(true), 0);

    return () => window.clearTimeout(mountedTimer);
  }, []);

  useEffect(() => {
    if (!mounted || hasLoadedLocalMenu) return;

    const loadTimer = window.setTimeout(() => {
      // The stable fallback state is intentionally used for SSR and the first client render.
      // Local menu data is loaded only after mount so every SSR-visible value stays deterministic.
      const localMenu = readLocalMenu();
      const nextSelectedProduct = localMenu.products[0] ?? null;

      setProducts(localMenu.products);
      setCategories(localMenu.categories);
      setSelectedProductId(nextSelectedProduct?.id ?? null);
      setEditingProduct(productToDraft(nextSelectedProduct));
      setNewProductDraft((currentDraft) => ({
        ...currentDraft,
        categoryId: localMenu.categories.some((category) => category.id === currentDraft.categoryId)
          ? currentDraft.categoryId
          : localMenu.categories[0]?.id ?? "general",
      }));
      setHasLoadedLocalMenu(true);
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [hasLoadedLocalMenu, mounted]);

  useEffect(() => {
    if (!mounted || !hasLoadedLocalMenu) return;

    saveLocalMenu({ categories, products });
  }, [categories, hasLoadedLocalMenu, mounted, products]);

  const hydrationReady = mounted && hasLoadedLocalMenu;

  const productCounts = useMemo(() => products.reduce<Record<string, number>>((counts, product) => {
    counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
    return counts;
  }, {}), [products]);

  const summaryItems = useMemo<SummaryItem[]>(() => [
    { value: String(categories.length), label: "Catégories", helper: "Toutes vos catégories", tone: "emerald" },
    { value: String(products.filter((product) => product.available && product.visible).length), label: "Produits actifs", helper: "Disponibles à la vente", tone: "sky" },
    { value: String(products.filter((product) => !product.available).length), label: "Produit en rupture", helper: "Non disponible", tone: "rose" },
    { value: String(products.filter((product) => product.promo).length), label: "Promotions actives", helper: "En cours", tone: "amber" },
  ], [categories.length, products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase("fr-FR");

    return products.filter((product) => {
      const matchesCategory = selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
      const matchesSearch = normalizedSearch.length === 0 || `${product.name} ${product.description}`.toLocaleLowerCase("fr-FR").includes(normalizedSearch);
      const matchesFilter = activeFilter === "all" || (activeFilter === "available" && product.available) || (activeFilter === "unavailable" && !product.available) || (activeFilter === "promo" && product.promo);

      return matchesCategory && matchesSearch && matchesFilter;
    });
  }, [activeFilter, products, searchQuery, selectedCategoryId]);

  const showMessage = (message: string) => setSuccessMessage(message);

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = window.setTimeout(() => setSuccessMessage(""), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const normalizeDraftPrice = (draft: ProductDraft, fallbackPrice: number | string | null | undefined) => {
    const parsedPrice = parseEuroInput(draft.price);
    const fallbackParsedPrice = parseEuroInput(fallbackPrice);

    if (parsedPrice === null && fallbackParsedPrice === null) {
      return draft;
    }

    return {
      ...draft,
      price: formatEuro(parsedPrice ?? fallbackParsedPrice),
    };
  };

  const closeRowActions = useCallback(() => setRowAction(null), []);

  const openRowActions = useCallback((productId: string, buttonRect: DOMRect) => {
    const dropdownWidth = 192;
    const dropdownHeight = 188;
    const margin = 16;
    const top = buttonRect.bottom + dropdownHeight + margin > window.innerHeight
      ? Math.max(margin, buttonRect.top - dropdownHeight - 8)
      : buttonRect.bottom + 8;
    const left = Math.min(Math.max(margin, buttonRect.right - dropdownWidth), window.innerWidth - dropdownWidth - margin);

    setRowAction({ productId, top, left });
  }, []);

  const selectProduct = (productId: string, options: { focusPanel?: boolean } = {}) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    setSelectedProductId(productId);
    setEditingProduct(productToDraft(product));
    setRowAction(null);

    if (options.focusPanel) {
      window.setTimeout(() => editPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  };

  const editProductFromMenu = (productId: string) => selectProduct(productId, { focusPanel: true });

  const saveEditedProduct = () => {
    if (!selectedProductId || !editingProduct) return;

    const normalizedDraft = normalizeDraftPrice(editingProduct, selectedProduct?.price);
    const normalizedPromoValue = formatPromotionValue(editingProduct.promoValue, editingProduct.promoType);
    const parsedPrice = parseEuroInput(normalizedDraft.price) ?? selectedProduct?.price ?? 0;
    const savedDraft = {
      ...normalizedDraft,
      name: normalizedDraft.name.trim(),
      description: normalizedDraft.description.trim(),
      allergens: normalizedDraft.allergens.map((allergen) => allergen.trim()).filter(Boolean),
      promoValue: normalizedPromoValue,
      imageUrl: normalizedDraft.imageUrl ?? null,
      imageAlt: normalizedDraft.imageAlt?.trim() ?? "",
      visualPreset: normalizedDraft.visualPreset ?? "auto",
    };
    const savedProductPatch = { ...savedDraft, price: parsedPrice };

    setProducts((currentProducts) => currentProducts.map((product) => product.id === selectedProductId ? { ...product, ...savedProductPatch } : product));
    setSelectedProductId(selectedProductId);
    setEditingProduct(savedDraft);
    showMessage("Modification enregistrée dans le menu.");
  };

  const cancelEditedProduct = () => {
    if (!selectedProduct) return;

    setEditingProduct(productToDraft(selectedProduct));
    showMessage("Modifications annulées.");
  };

  const toggleVisibility = (productId: string) => {
    setProducts((currentProducts) => currentProducts.map((product) => product.id === productId ? { ...product, visible: !product.visible } : product));
    setRowAction(null);
    if (selectedProductId === productId) {
      setEditingProduct((currentDraft) => currentDraft ? { ...currentDraft, visible: !currentDraft.visible } : currentDraft);
    }
    showMessage("Visibilité du produit mise à jour.");
  };

  const duplicateProduct = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const duplicate: ProductItem = {
      ...product,
      id: createId(`${product.name}-copie-${Date.now()}`),
      name: `${product.name} (copie)`,
      visible: true,
    };

    setProducts((currentProducts) => [duplicate, ...currentProducts]);
    setSelectedProductId(duplicate.id);
    setEditingProduct(productToDraft(duplicate));
    setRowAction(null);
    showMessage("Produit dupliqué dans le menu.");
  };

  const deleteProduct = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product || !window.confirm(`Supprimer ${product.name} du menu ?`)) return;

    const remainingProducts = products.filter((item) => item.id !== productId);
    setProducts(remainingProducts);
    const nextSelected = remainingProducts.find((item) => item.available && item.visible) ?? remainingProducts[0] ?? null;
    setSelectedProductId(nextSelected?.id ?? null);
    setEditingProduct(productToDraft(nextSelected));
    setRowAction(null);
    showMessage("Produit supprimé du menu.");
  };

  const openAddProduct = () => {
    setNewProductDraft(blankProductDraft(selectedCategoryId === "all" ? categories[0]?.id ?? "general" : selectedCategoryId));
    setIsAddProductOpen(true);
  };

  const addProduct = () => {
    const parsedPrice = parseEuroInput(newProductDraft.price);

    if (!newProductDraft.name.trim() || parsedPrice === null) {
      showMessage("Renseignez au minimum le nom et un prix valide pour le produit.");
      return;
    }

    const normalizedDraft = normalizeDraftPrice(newProductDraft, parsedPrice);
    const product: ProductItem = {
      ...normalizedDraft,
      id: createId(`${newProductDraft.name}-${Date.now()}`),
      imageTone: imageTones[products.length % imageTones.length],
      imageUrl: normalizedDraft.imageUrl ?? null,
      imageAlt: normalizedDraft.imageAlt?.trim() || `Visuel premium de ${normalizedDraft.name.trim()}`,
      visualPreset: normalizedDraft.visualPreset ?? "auto",
      name: normalizedDraft.name.trim(),
      description: normalizedDraft.description.trim(),
      price: parsedPrice,
    };

    setProducts((currentProducts) => [product, ...currentProducts]);
    setSelectedProductId(product.id);
    setSelectedCategoryId(product.categoryId);
    setEditingProduct(productToDraft(product));
    setIsAddProductOpen(false);
    showMessage("Produit ajouté dans le menu.");
  };

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      showMessage("Renseignez un nom de catégorie.");
      return;
    }

    const category = {
      id: createId(`${name}-${Date.now()}`),
      name,
      createdAt: new Date().toISOString(),
    };
    setCategories((currentCategories) => resequenceCategories(withStableCategoryOrder([...currentCategories, category])));
    setSelectedCategoryId(category.id);
    setNewCategoryName("");
    setIsAddCategoryOpen(false);
    showMessage("Catégorie ajoutée dans le menu.");
  };

  const deleteCategory = (categoryId: string) => {
    if (categories.length <= 1) {
      showMessage("Conservez au moins une catégorie.");
      return;
    }

    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;

    const count = productCounts[categoryId] ?? 0;
    const confirmed = window.confirm(
      count > 0
        ? "Cette catégorie contient des produits. Voulez-vous vraiment la supprimer ? Les produits seront conservés sans catégorie."
        : "Voulez-vous vraiment supprimer cette catégorie ?",
    );

    if (!confirmed) return;

    const remainingCategories = resequenceCategories(categories.filter((item) => item.id !== categoryId));
    setCategories(remainingCategories);
    setProducts((currentProducts) => currentProducts.map((product) => product.categoryId === categoryId ? { ...product, categoryId: "uncategorized" } : product));
    setEditingProduct((currentDraft) => currentDraft?.categoryId === categoryId ? { ...currentDraft, categoryId: "uncategorized" } : currentDraft);
    setNewProductDraft((currentDraft) => currentDraft.categoryId === categoryId ? { ...currentDraft, categoryId: remainingCategories[0]?.id ?? "uncategorized" } : currentDraft);
    setSelectedCategoryId((currentCategoryId) => currentCategoryId === categoryId ? "all" : currentCategoryId);
    showMessage("Catégorie supprimée.");
  };

  const handleToggleReorderMode = () => {
    setReorderMode((isActive) => !isActive);
  };

  const handleMoveCategoryUp = (categoryId: string) => {
    setCategories((currentCategories) => {
      const index = currentCategories.findIndex((category) => category.id === categoryId);
      if (index <= 0) return currentCategories;

      const nextCategories = [...currentCategories];
      [nextCategories[index - 1], nextCategories[index]] = [nextCategories[index], nextCategories[index - 1]];
      return resequenceCategories(nextCategories);
    });

    showMessage("Ordre des catégories mis à jour dans le menu.");
  };

  const handleMoveCategoryDown = (categoryId: string) => {
    setCategories((currentCategories) => {
      const index = currentCategories.findIndex((category) => category.id === categoryId);
      if (index === -1 || index >= currentCategories.length - 1) return currentCategories;

      const nextCategories = [...currentCategories];
      [nextCategories[index], nextCategories[index + 1]] = [nextCategories[index + 1], nextCategories[index]];
      return resequenceCategories(nextCategories);
    });

    showMessage("Ordre des catégories mis à jour dans le menu.");
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Gestion du menu"
        subtitle="Organisez vos catégories, produits, disponibilités et promotions."
      >
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50" onClick={() => setIsPreviewOpen(true)} type="button">
          Aperçu client
        </button>
        <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100" onClick={() => setIsAddCategoryOpen(true)} type="button">
          Ajouter une catégorie
        </button>
        <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800" onClick={openAddProduct} type="button">
          Ajouter un produit
        </button>
      </DashboardHeader>

      {successMessage ? <Toast message={successMessage} onClose={() => setSuccessMessage("")} /> : null}

      <main className="flex-1 space-y-7 p-5 lg:p-8">
        <RestaurantSelectorCard onClick={() => showMessage("Le changement de restaurant est désactivé dans cette version de démonstration.")} />

        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {summaryItems.map((item) => (
            <MenuSummaryCard key={item.label} {...item} />
          ))}
        </section>

        <section className="grid gap-7 2xl:grid-cols-[300px_minmax(0,1fr)_380px]">
          <div className="space-y-7">
            <CategoryList
              categories={categories}
              productCounts={productCounts}
              reorderMode={reorderMode}
              selectedCategoryId={selectedCategoryId}
              onMoveCategoryDown={handleMoveCategoryDown}
              onMoveCategoryUp={handleMoveCategoryUp}
              onDeleteCategory={deleteCategory}
              onSelectCategory={setSelectedCategoryId}
              onToggleReorderMode={handleToggleReorderMode}
            />
          </div>

          <div className="min-w-0">
            <ProductTable
              activeFilter={activeFilter}
              isFilterOpen={isFilterOpen}
              onDeleteProduct={deleteProduct}
              onDuplicateProduct={duplicateProduct}
              onEditProduct={editProductFromMenu}
              onSearchChange={setSearchQuery}
              onSelectFilter={(filter) => { setActiveFilter(filter); setIsFilterOpen(false); }}
              onSelectProduct={selectProduct}
              onToggleFilter={() => setIsFilterOpen((isOpen) => !isOpen)}
              onCloseRowActions={closeRowActions}
              onOpenRowActions={openRowActions}
              onToggleVisibility={toggleVisibility}
              products={filteredProducts}
              hydrationReady={hydrationReady}
              rowAction={rowAction}
              searchQuery={searchQuery}
              selectedProductId={selectedProductId}
            />
          </div>

          <div className="space-y-7">
            <div ref={editPanelRef}>
              <ProductEditPanel categories={categories} draft={editingProduct} hydrationReady={hydrationReady} onCancel={cancelEditedProduct} onDraftChange={setEditingProduct} onNormalizePrice={() => setEditingProduct((currentDraft) => currentDraft ? normalizeDraftPrice(currentDraft, selectedProduct?.price) : currentDraft)} onSave={saveEditedProduct} product={selectedProduct} />
            </div>
            <PublicMenuPreview categories={categories} products={products} hydrationReady={hydrationReady} selectedCategoryId={selectedCategoryId} onCartClick={() => showMessage("L’aperçu du panier est disponible depuis le menu client.")} />
          </div>
        </section>
      </main>

      {isAddProductOpen ? (
        <Modal title="Ajouter un produit" onClose={() => setIsAddProductOpen(false)}>
          <ProductForm categories={categories} draft={newProductDraft} onChange={setNewProductDraft} onNormalizePrice={() => setNewProductDraft((currentDraft) => normalizeDraftPrice(currentDraft, undefined))} />
          <ModalActions onCancel={() => setIsAddProductOpen(false)} onSave={addProduct} saveLabel="Ajouter" />
        </Modal>
      ) : null}

      {isAddCategoryOpen ? (
        <Modal title="Ajouter une catégorie" onClose={() => setIsAddCategoryOpen(false)}>
          <label className="block">
            <span className="text-sm font-black text-slate-700">Nom de la catégorie</span>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onChange={(event) => setNewCategoryName(event.target.value)} value={newCategoryName} />
          </label>
          <ModalActions onCancel={() => setIsAddCategoryOpen(false)} onSave={addCategory} saveLabel="Ajouter" />
        </Modal>
      ) : null}

      {isPreviewOpen ? (
        <Modal title="Aperçu client" onClose={() => setIsPreviewOpen(false)} wide>
          <MobilePreview categories={categories} products={products.filter((product) => product.visible && (selectedCategoryId === "all" || product.categoryId === selectedCategoryId))} hydrationReady={hydrationReady} selectedCategoryId={selectedCategoryId} onCartClick={() => showMessage("L’aperçu du panier est disponible depuis le menu client.")} />
        </Modal>
      ) : null}
    </>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed right-4 top-4 z-[120] flex w-[min(calc(100vw-2rem),28rem)] items-start gap-3 rounded-3xl border border-emerald-200 bg-white px-5 py-4 text-sm font-black text-emerald-900 shadow-2xl shadow-slate-950/20 ring-1 ring-emerald-100 sm:right-6 sm:top-6" role="status">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs text-white">✓</span>
      <span className="min-w-0 flex-1 leading-6">{message}</span>
      <button aria-label="Fermer la notification" className="rounded-full px-2 text-lg leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button">×</button>
    </div>
  );
}

function ProductForm({ categories, draft, onChange, onNormalizePrice }: { categories: CategoryItem[]; draft: ProductDraft; onChange: (draft: ProductDraft) => void; onNormalizePrice: () => void }) {
  const updateDraft = (patch: Partial<ProductDraft>) => onChange({ ...draft, ...patch });

  return (
    <div className="space-y-4">
      <FormField label="Nom" value={draft.name} onChange={(value) => updateDraft({ name: value })} />
      <label className="block">
        <span className="text-sm font-black text-slate-700">Catégorie</span>
        <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none" onChange={(event) => updateDraft({ categoryId: event.target.value })} value={draft.categoryId}>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <FormField label="Prix" value={draft.price} onBlur={onNormalizePrice} onChange={(value) => updateDraft({ price: value })} />
      <FormField label="Description" value={draft.description} onChange={(value) => updateDraft({ description: value })} multiline />
    </div>
  );
}

function FormField({ label, value, onChange, onBlur, multiline = false }: { label: string; value: string; onChange: (value: string) => void; onBlur?: () => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      {multiline ? (
        <textarea className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
      )}
    </label>
  );
}

function Modal({ children, onClose, title, wide = false }: { children: React.ReactNode; onClose: () => void; title: string; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <section className={`max-h-[90vh] w-full overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 ${wide ? "max-w-xl" : "max-w-lg"}`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Menu du restaurant</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>
          </div>
          <button aria-label="Fermer" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200" onClick={onClose} type="button">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ModalActions({ onCancel, onSave, saveLabel }: { onCancel: () => void; onSave: () => void; saveLabel: string }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm" onClick={onCancel} type="button">Annuler</button>
      <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15" onClick={onSave} type="button">{saveLabel}</button>
    </div>
  );
}

function productToDraft(product: ProductItem | null | undefined): ProductDraft | null {
  if (!product) return null;

  return {
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    price: formatEuro(product.price),
    allergens: [...product.allergens],
    available: product.available,
    promo: product.promo,
    visible: product.visible,
    promoType: product.promoType,
    promoValue: product.promoValue,
    promoEndDate: product.promoEndDate,
    imageUrl: product.imageUrl ?? null,
    imageAlt: product.imageAlt ?? "",
    visualPreset: product.visualPreset ?? "auto",
  };
}

function createId(value: string) {
  return value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
