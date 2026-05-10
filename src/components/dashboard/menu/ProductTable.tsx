"use client";

import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";

import { StatusBadge } from "@/components/dashboard";

import type { ProductItem } from "./menuData";

export type ActiveMenuFilter = "all" | "available" | "unavailable" | "promo";

export type RowActionState = {
  productId: string;
  top: number;
  left: number;
};

type ProductTableProps = {
  products: ProductItem[];
  selectedProductId: string | null;
  searchQuery: string;
  activeFilter: ActiveMenuFilter;
  isFilterOpen: boolean;
  rowAction: RowActionState | null;
  onSearchChange: (value: string) => void;
  onToggleFilter: () => void;
  onSelectFilter: (filter: ActiveMenuFilter) => void;
  onSelectProduct: (productId: string) => void;
  onOpenRowActions: (productId: string, buttonRect: DOMRect) => void;
  onCloseRowActions: () => void;
  onEditProduct: (productId: string) => void;
  onDuplicateProduct: (productId: string) => void;
  onToggleVisibility: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
};

const filterLabels: Record<ActiveMenuFilter, string> = {
  all: "Tous",
  available: "Disponibles",
  unavailable: "En rupture",
  promo: "En promotion",
};

const filterOptions = Object.entries(filterLabels) as Array<[ActiveMenuFilter, string]>;

export function ProductTable({
  products,
  selectedProductId,
  searchQuery,
  activeFilter,
  isFilterOpen,
  rowAction,
  onSearchChange,
  onToggleFilter,
  onSelectFilter,
  onSelectProduct,
  onOpenRowActions,
  onCloseRowActions,
  onEditProduct,
  onDuplicateProduct,
  onToggleVisibility,
  onDeleteProduct,
}: ProductTableProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const activeActionProduct = useMemo(() => products.find((product) => product.id === rowAction?.productId) ?? null, [products, rowAction?.productId]);

  useEffect(() => {
    if (!rowAction) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const clickedDropdown = dropdownRef.current?.contains(target) ?? false;
      const clickedButton = buttonRefs.current.get(rowAction.productId)?.contains(target) ?? false;

      if (!clickedDropdown && !clickedButton) {
        onCloseRowActions();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRowActions();
    };

    const handleScroll = () => onCloseRowActions();

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onCloseRowActions, rowAction]);

  const handleActionButtonClick = (productId: string, button: HTMLButtonElement) => {
    if (rowAction?.productId === productId) {
      onCloseRowActions();
      return;
    }

    onOpenRowActions(productId, button.getBoundingClientRect());
  };

  const registerButton = (productId: string, node: HTMLButtonElement | null) => {
    if (node) {
      buttonRefs.current.set(productId, node);
    } else {
      buttonRefs.current.delete(productId);
    }
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-100 p-5 lg:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Catalogue</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Produits</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">Filtre actif : <span className="text-emerald-700">{filterLabels[activeFilter]}</span></p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-80">
              <span className="sr-only">Rechercher un produit</span>
              <SearchIcon />
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Rechercher un produit..."
                type="search"
                value={searchQuery}
              />
            </label>
            <div className="relative">
              <button
                aria-expanded={isFilterOpen}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 sm:w-auto"
                onClick={onToggleFilter}
                type="button"
              >
                <FilterIcon />
                Filtres · {filterLabels[activeFilter]}
              </button>
              {isFilterOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                  {filterOptions.map(([value, label]) => (
                    <button
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${activeFilter === value ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}
                      key={value}
                      onClick={() => onSelectFilter(value)}
                      type="button"
                    >
                      {label}
                      {activeFilter === value ? <span aria-hidden="true">✓</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {products.length === 0 ? <EmptyProductsState /> : null}

      {products.length > 0 ? (
        <div className="divide-y divide-slate-100 lg:hidden">
          {products.map((product) => (
            <article className={`p-5 transition ${rowClassName(product, selectedProductId)}`} key={product.id} onClick={() => onSelectProduct(product.id)}>
              <div className="flex items-start gap-4">
                <ProductThumbnail product={product} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={`font-black ${product.visible ? "text-slate-950" : "text-slate-400"}`}>{product.name}</h3>
                      <p className="mt-1 text-sm font-medium leading-5 text-slate-500">{product.description}</p>
                    </div>
                    <ActionsButton onButtonClick={handleActionButtonClick} product={product} registerButton={registerButton} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <MobileMeta label="Prix" value={product.price} strong />
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Disponibilité</p>
                      <div className="mt-2"><StatusBadge variant={product.available ? "success" : "danger"}>{product.available ? "Disponible" : "Rupture"}</StatusBadge></div>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Promo</p>
                      <div className="mt-2">{product.promo ? <StatusBadge variant="warning">Promo</StatusBadge> : <span className="text-sm font-bold text-slate-400">—</span>}</div>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Visibilité</p>
                      <button className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600" onClick={(event) => { event.stopPropagation(); onToggleVisibility(product.id); }} type="button">
                        <VisibilityIcon visible={product.visible} />
                        {product.visible ? "Visible" : "Masqué"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {product.allergens.map((allergen) => (
                      <AllergenBadge allergen={allergen} key={allergen} />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {products.length > 0 ? (
        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-[920px] w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                <th className="px-5 py-4 lg:px-6">Produit</th>
                <th className="px-4 py-4">Prix</th>
                <th className="px-4 py-4">Allergènes</th>
                <th className="px-4 py-4">Disponibilité</th>
                <th className="px-4 py-4">Promo</th>
                <th className="px-4 py-4">Visibilité</th>
                <th className="px-5 py-4 text-right lg:px-6"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className={`group cursor-pointer border-t border-slate-100 transition ${rowClassName(product, selectedProductId)}`} key={product.id} onClick={() => onSelectProduct(product.id)}>
                  <td className="border-t border-slate-100 px-5 py-4 lg:px-6">
                    <div className="flex items-center gap-4">
                      <ProductThumbnail product={product} />
                      <span>
                        <span className={`block font-black ${product.visible ? "text-slate-950" : "text-slate-400 line-through decoration-slate-300"}`}>{product.name}</span>
                        <span className="mt-1 block max-w-xs text-sm font-medium text-slate-500">{product.description}</span>
                      </span>
                    </div>
                  </td>
                  <td className="border-t border-slate-100 px-4 py-4 text-sm font-black text-slate-950">{product.price}</td>
                  <td className="border-t border-slate-100 px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {product.allergens.map((allergen) => (
                        <AllergenBadge allergen={allergen} key={allergen} />
                      ))}
                    </div>
                  </td>
                  <td className="border-t border-slate-100 px-4 py-4">
                    <StatusBadge variant={product.available ? "success" : "danger"}>{product.available ? "Disponible" : "Rupture"}</StatusBadge>
                  </td>
                  <td className="border-t border-slate-100 px-4 py-4">
                    {product.promo ? <StatusBadge variant="warning">Promo</StatusBadge> : <span className="text-sm font-bold text-slate-400">—</span>}
                  </td>
                  <td className="border-t border-slate-100 px-4 py-4">
                    <button aria-label={`${product.visible ? "Masquer" : "Afficher"} ${product.name}`} onClick={(event) => { event.stopPropagation(); onToggleVisibility(product.id); }} type="button">
                      <VisibilityIcon visible={product.visible} />
                    </button>
                  </td>
                  <td className="border-t border-slate-100 px-5 py-4 text-right lg:px-6">
                    <ActionsButton onButtonClick={handleActionButtonClick} product={product} registerButton={registerButton} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {rowAction && activeActionProduct ? (
        <RowActionDropdown
          onDeleteProduct={onDeleteProduct}
          onDuplicateProduct={onDuplicateProduct}
          onEditProduct={onEditProduct}
          onToggleVisibility={onToggleVisibility}
          position={{ left: rowAction.left, top: rowAction.top }}
          product={activeActionProduct}
          refObject={dropdownRef}
        />
      ) : null}
    </section>
  );
}

function rowClassName(product: ProductItem, selectedProductId: string | null) {
  if (selectedProductId === product.id) return product.visible ? "bg-emerald-50/70" : "bg-slate-100/80";
  return product.visible ? "bg-white hover:bg-slate-50" : "bg-slate-50/80 opacity-70 hover:bg-slate-100";
}

function ActionsButton({ product, onButtonClick, registerButton }: {
  product: ProductItem;
  onButtonClick: (productId: string, button: HTMLButtonElement) => void;
  registerButton: (productId: string, node: HTMLButtonElement | null) => void;
}) {
  return (
    <span className="inline-flex" onClick={(event) => event.stopPropagation()}>
      <button
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        type="button"
        aria-label={`Actions pour ${product.name}`}
        onClick={(event) => onButtonClick(product.id, event.currentTarget)}
        ref={(node) => registerButton(product.id, node)}
      >
        <DotsIcon />
      </button>
    </span>
  );
}

function RowActionDropdown({ product, position, refObject, onEditProduct, onDuplicateProduct, onToggleVisibility, onDeleteProduct }: {
  product: ProductItem;
  position: { top: number; left: number };
  refObject: RefObject<HTMLDivElement | null>;
  onEditProduct: (productId: string) => void;
  onDuplicateProduct: (productId: string) => void;
  onToggleVisibility: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}) {
  return (
    <div
      className="fixed z-[80] w-48 rounded-3xl border border-slate-200 bg-white p-2 text-left shadow-2xl shadow-slate-900/20"
      ref={refObject}
      role="menu"
      style={{ left: position.left, top: position.top }}
    >
      <ActionMenuButton onClick={() => onEditProduct(product.id)}>Modifier</ActionMenuButton>
      <ActionMenuButton onClick={() => onDuplicateProduct(product.id)}>Dupliquer</ActionMenuButton>
      <ActionMenuButton onClick={() => onToggleVisibility(product.id)}>{product.visible ? "Masquer" : "Afficher"}</ActionMenuButton>
      <ActionMenuButton danger onClick={() => onDeleteProduct(product.id)}>Supprimer</ActionMenuButton>
    </div>
  );
}

function ActionMenuButton({ children, danger = false, onClick }: { children: ReactNode; danger?: boolean; onClick: () => void }) {
  return <button className={`block w-full rounded-2xl px-4 py-2.5 text-left text-sm font-black transition ${danger ? "text-rose-700 hover:bg-rose-50" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"}`} onClick={onClick} role="menuitem" type="button">{children}</button>;
}

function EmptyProductsState() {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-400"><SearchIcon /></div>
      <h3 className="mt-4 text-lg font-black text-slate-950">Aucun produit trouvé</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">Aucun produit ne correspond à votre recherche ou à vos filtres. Essayez une autre catégorie, un autre filtre ou ajoutez un nouveau produit.</p>
    </div>
  );
}

function ProductThumbnail({ product }: { product: ProductItem }) {
  return (
    <span className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${product.imageUrl ? "bg-slate-100" : `bg-gradient-to-br ${product.imageTone}`} text-xs font-black text-emerald-900`}>
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" className="h-full w-full object-cover" src={product.imageUrl} />
      ) : (
        product.name.split(" ").map((word) => word[0]).join("").slice(0, 2)
      )}
    </span>
  );
}

function AllergenBadge({ allergen }: { allergen: string }) {
  return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">{allergen}</span>;
}

function MobileMeta({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`mt-2 text-sm ${strong ? "font-black text-slate-950" : "font-bold text-slate-500"}`}>{value}</p>
    </div>
  );
}

function SearchIcon() {
  return <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" /></svg>;
}

function FilterIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h4" /></svg>;
}

function DotsIcon() {
  return <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5h.01M12 12h.01M12 17.5h.01" /></svg>;
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
  ) : (
    <svg aria-hidden="true" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 18M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58M9.88 4.24A9.45 9.45 0 0 1 12 4c6 0 9.75 8 9.75 8a16.38 16.38 0 0 1-2.45 3.66M6.12 6.12C3.7 7.82 2.25 12 2.25 12s3.75 8 9.75 8c1.26 0 2.42-.25 3.47-.68" /></svg>
  );
}
