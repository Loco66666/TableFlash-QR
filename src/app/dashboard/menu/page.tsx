"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard";
import {
  CategoryList,
  MenuSummaryCard,
  ProductEditPanel,
  ProductTable,
  PublicMenuPreview,
  RestaurantSelectorCard,
  categoryItems as initialCategories,
  products as initialProducts,
} from "@/components/dashboard/menu";
import type { ProductEditForm } from "@/components/dashboard/menu/ProductEditPanel";
import type { ProductFilter, RowAction } from "@/components/dashboard/menu/ProductTable";
import type { CategoryItem, ProductItem } from "@/components/dashboard/menu/menuData";

type ModalType = "product" | "category" | "preview" | null;

type AddProductForm = {
  name: string;
  categoryId: string;
  price: string;
  description: string;
};

const emptyProductForm: AddProductForm = {
  name: "",
  categoryId: initialCategories[0]?.id ?? "entrees",
  price: "",
  description: "",
};

function createEditForm(product: ProductItem): ProductEditForm {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    allergens: product.allergens,
    availability: product.availability,
    promo: product.promo,
    promotionType: product.promotionType,
    promotionValue: product.promotionValue,
    promotionEndDate: product.promotionEndDate,
  };
}

export default function Page() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0]?.id ?? "");
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const [editForm, setEditForm] = useState<ProductEditForm>(() => createEditForm(initialProducts[0]));
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [actionsProductId, setActionsProductId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [addProductForm, setAddProductForm] = useState<AddProductForm>(emptyProductForm);
  const [newCategoryName, setNewCategoryName] = useState("");

  const categoriesWithCounts = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      productCount: products.filter((product) => product.categoryId === category.id).length,
    }));
  }, [categories, products]);

  const summaryItems = useMemo(() => ([
    { value: String(categories.length), label: "Catégories", helper: "Toutes vos catégories", tone: "emerald" as const },
    { value: String(products.filter((product) => product.availability === "Disponible").length), label: "Produits actifs", helper: "Disponibles à la vente", tone: "sky" as const },
    { value: String(products.filter((product) => product.availability === "Rupture").length), label: "Produit en rupture", helper: "Non disponible", tone: "rose" as const },
    { value: String(products.filter((product) => product.promo === "Promo").length), label: "Promotions actives", helper: "En cours", tone: "amber" as const },
  ]), [categories.length, products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategoryId === "all" || product.categoryId === activeCategoryId;
      const matchesSearch = normalizedSearch.length === 0 || `${product.name} ${product.description}`.toLowerCase().includes(normalizedSearch);
      const matchesFilter =
        activeFilter === "Tous" ||
        (activeFilter === "Disponibles" && product.availability === "Disponible") ||
        (activeFilter === "En rupture" && product.availability === "Rupture") ||
        (activeFilter === "En promotion" && product.promo === "Promo");

      return matchesCategory && matchesSearch && matchesFilter;
    });
  }, [activeCategoryId, activeFilter, products, searchQuery]);

  function showToast(message: string) {
    setToastMessage(message);
  }

  function selectProduct(productId: string) {
    const nextProduct = products.find((product) => product.id === productId);

    if (!nextProduct) {
      return;
    }

    setSelectedProductId(productId);
    setEditForm(createEditForm(nextProduct));
    setToastMessage("");
  }

  function saveEditForm() {
    if (!selectedProduct) {
      return;
    }

    setProducts((currentProducts) => currentProducts.map((product) => product.id === selectedProduct.id ? { ...product, ...editForm } : product));
    showToast("Modification enregistrée dans la maquette.");
  }

  function resetEditForm() {
    if (selectedProduct) {
      setEditForm(createEditForm(selectedProduct));
      setToastMessage("");
    }
  }

  function toggleVisibility(productId: string) {
    setProducts((currentProducts) => currentProducts.map((product) => product.id === productId ? { ...product, visible: !product.visible } : product));
  }

  function handleRowAction(productId: string, action: RowAction) {
    const product = products.find((item) => item.id === productId);
    setActionsProductId(null);

    if (!product) {
      return;
    }

    if (action === "edit") {
      selectProduct(productId);
      return;
    }

    if (action === "duplicate") {
      const duplicate: ProductItem = {
        ...product,
        id: `${product.id}-copie-${Date.now()}`,
        name: `${product.name} copie`,
      };
      setProducts((currentProducts) => [...currentProducts, duplicate]);
      setSelectedProductId(duplicate.id);
      setEditForm(createEditForm(duplicate));
      showToast("Produit dupliqué dans la maquette.");
      return;
    }

    if (action === "hide") {
      toggleVisibility(productId);
      return;
    }

    if (window.confirm(`Supprimer ${product.name} de la maquette ?`)) {
      const remainingProducts = products.filter((item) => item.id !== productId);
      setProducts(remainingProducts);
      const nextProduct = remainingProducts[0];

      if (nextProduct) {
        setSelectedProductId(nextProduct.id);
        setEditForm(createEditForm(nextProduct));
      }

      showToast("Produit supprimé dans la maquette.");
    }
  }

  function saveNewProduct() {
    const trimmedName = addProductForm.name.trim();

    if (!trimmedName) {
      return;
    }

    const newProduct: ProductItem = {
      id: `${slugify(trimmedName)}-${Date.now()}`,
      name: trimmedName,
      categoryId: addProductForm.categoryId,
      price: addProductForm.price.trim() || "0,00 €",
      description: addProductForm.description.trim() || "Description courte du produit.",
      availability: "Disponible",
      promo: "—",
      promotionType: "Pourcentage",
      promotionValue: "",
      promotionEndDate: "",
      allergens: ["Sans"],
      visible: true,
      imageTone: "from-emerald-200 via-lime-100 to-amber-100",
    };

    setProducts((currentProducts) => [...currentProducts, newProduct]);
    setSelectedProductId(newProduct.id);
    setEditForm(createEditForm(newProduct));
    setAddProductForm(emptyProductForm);
    setModal(null);
    showToast("Produit ajouté dans la maquette.");
  }

  function saveNewCategory() {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      return;
    }

    const newCategory: CategoryItem = {
      id: `${slugify(trimmedName)}-${Date.now()}`,
      name: trimmedName,
      productCount: 0,
    };

    setCategories((currentCategories) => [...currentCategories, newCategory]);
    setActiveCategoryId(newCategory.id);
    setNewCategoryName("");
    setModal(null);
    showToast("Catégorie ajoutée dans la maquette.");
  }

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Gestion du menu"
        subtitle="Organisez vos catégories, produits, disponibilités et promotions."
      >
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50" onClick={() => setModal("preview")} type="button">
          Aperçu public
        </button>
        <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100" onClick={() => setModal("category")} type="button">
          Ajouter une catégorie
        </button>
        <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800" onClick={() => setModal("product")} type="button">
          Ajouter un produit
        </button>
      </DashboardHeader>

      <main className="flex-1 space-y-7 p-5 lg:p-8">
        {toastMessage ? <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800 shadow-sm">{toastMessage}</p> : null}
        <RestaurantSelectorCard />

        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {summaryItems.map((item) => (
            <MenuSummaryCard key={item.label} {...item} />
          ))}
        </section>

        <section className="grid gap-7 2xl:grid-cols-[300px_minmax(0,1fr)_380px]">
          <div className="space-y-7">
            <CategoryList activeCategoryId={activeCategoryId} categories={categoriesWithCounts} onSelectCategory={setActiveCategoryId} />
          </div>

          <div className="min-w-0">
            <ProductTable
              activeFilter={activeFilter}
              actionsProductId={actionsProductId}
              products={filteredProducts}
              searchQuery={searchQuery}
              selectedProductId={selectedProduct?.id ?? ""}
              showFilterMenu={showFilterMenu}
              onAction={handleRowAction}
              onSearchChange={setSearchQuery}
              onSelectFilter={(filter) => { setActiveFilter(filter); setShowFilterMenu(false); }}
              onSelectProduct={selectProduct}
              onToggleActions={(productId) => setActionsProductId((currentId) => currentId === productId ? null : productId)}
              onToggleFilterMenu={() => setShowFilterMenu((open) => !open)}
              onToggleVisibility={toggleVisibility}
            />
          </div>

          <div className="space-y-7">
            <ProductEditPanel form={editForm} product={selectedProduct} successMessage={toastMessage === "Modification enregistrée dans la maquette." ? toastMessage : undefined} onCancel={resetEditForm} onChange={setEditForm} onSave={saveEditForm} />
            <PublicMenuPreview activeCategoryId={activeCategoryId === "all" ? selectedProduct?.categoryId : activeCategoryId} categories={categoriesWithCounts} products={products} selectedProduct={selectedProduct} />
          </div>
        </section>
      </main>

      {modal === "product" ? (
        <Modal title="Ajouter un produit" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <ModalField label="Nom" value={addProductForm.name} onChange={(value) => setAddProductForm({ ...addProductForm, name: value })} />
            <label className="block">
              <span className="text-sm font-black text-slate-700">Catégorie</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" value={addProductForm.categoryId} onChange={(event) => setAddProductForm({ ...addProductForm, categoryId: event.target.value })}>
                {categoriesWithCounts.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <ModalField label="Prix" value={addProductForm.price} onChange={(value) => setAddProductForm({ ...addProductForm, price: value })} />
            <ModalField label="Description" value={addProductForm.description} multiline onChange={(value) => setAddProductForm({ ...addProductForm, description: value })} />
            <button className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15" onClick={saveNewProduct} type="button">Enregistrer</button>
          </div>
        </Modal>
      ) : null}

      {modal === "category" ? (
        <Modal title="Ajouter une catégorie" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <ModalField label="Nom" value={newCategoryName} onChange={setNewCategoryName} />
            <button className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15" onClick={saveNewCategory} type="button">Enregistrer</button>
          </div>
        </Modal>
      ) : null}

      {modal === "preview" ? (
        <Modal wide title="Aperçu public" onClose={() => setModal(null)}>
          <PublicMenuPreview activeCategoryId={activeCategoryId === "all" ? selectedProduct?.categoryId : activeCategoryId} categories={categoriesWithCounts} products={products} selectedProduct={selectedProduct} />
        </Modal>
      ) : null}
    </>
  );
}

function Modal({ children, onClose, title, wide = false }: { children: ReactNode; onClose: () => void; title: string; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <section className={`max-h-[90vh] overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 ${wide ? "w-full max-w-xl" : "w-full max-w-md"}`}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700" onClick={onClose} type="button" aria-label="Fermer">
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ModalField({ label, multiline = false, onChange, value }: { label: string; multiline?: boolean; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      {multiline ? (
        <textarea className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" onChange={(event) => onChange(event.target.value)} value={value} />
      )}
    </label>
  );
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "item";
}
