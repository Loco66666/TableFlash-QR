import { StatusBadge } from "@/components/dashboard";

import type { ProductItem } from "./menuData";

export type ProductFilter = "Tous" | "Disponibles" | "En rupture" | "En promotion";
export type RowAction = "edit" | "duplicate" | "hide" | "delete";

type ProductTableProps = {
  activeFilter: ProductFilter;
  actionsProductId: string | null;
  products: ProductItem[];
  searchQuery: string;
  selectedProductId: string;
  showFilterMenu: boolean;
  onAction: (productId: string, action: RowAction) => void;
  onSelectFilter: (filter: ProductFilter) => void;
  onSelectProduct: (productId: string) => void;
  onSearchChange: (value: string) => void;
  onToggleActions: (productId: string) => void;
  onToggleFilterMenu: () => void;
  onToggleVisibility: (productId: string) => void;
};

const filters: ProductFilter[] = ["Tous", "Disponibles", "En rupture", "En promotion"];

export function ProductTable({
  activeFilter,
  actionsProductId,
  products,
  searchQuery,
  selectedProductId,
  showFilterMenu,
  onAction,
  onSelectFilter,
  onSelectProduct,
  onSearchChange,
  onToggleActions,
  onToggleFilterMenu,
  onToggleVisibility,
}: ProductTableProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-100 p-5 lg:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Catalogue</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Produits</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">Filtre actif : <span className="text-emerald-700">{activeFilter}</span></p>
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
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 sm:w-auto" onClick={onToggleFilterMenu} type="button" aria-expanded={showFilterMenu}>
                <FilterIcon />
                Filtres · {activeFilter}
              </button>
              {showFilterMenu ? (
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  {filters.map((filter) => (
                    <button
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${filter === activeFilter ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}
                      key={filter}
                      onClick={() => onSelectFilter(filter)}
                      type="button"
                    >
                      {filter}
                      {filter === activeFilter ? <CheckIcon /> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {products.length === 0 ? <EmptyProductsState /> : null}

      <div className="divide-y divide-slate-100 lg:hidden">
        {products.map((product) => {
          const selected = product.id === selectedProductId;

          return (
            <article className={`p-5 transition ${selected ? "bg-emerald-50/70" : "bg-white"}`} key={product.id}>
              <div className="flex cursor-pointer items-start gap-4" onClick={() => onSelectProduct(product.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelectProduct(product.id); }} role="button" tabIndex={0}>
                <ProductThumbnail product={product} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-slate-950">{product.name}</h3>
                      <p className="mt-1 text-sm font-medium leading-5 text-slate-500">{product.description}</p>
                    </div>
                    <span className="relative">
                      <ActionsButton product={product} actionsProductId={actionsProductId} onAction={onAction} onToggleActions={onToggleActions} />
                    </span>
                  </div>
                  <MobileProductMeta product={product} onToggleVisibility={onToggleVisibility} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={`${products.length === 0 ? "hidden" : "hidden overflow-x-auto lg:block"}`}>
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
            {products.map((product) => {
              const selected = product.id === selectedProductId;

              return (
                <tr className={`group cursor-pointer border-t border-slate-100 transition ${selected ? "bg-emerald-50/80" : "hover:bg-slate-50"}`} key={product.id} onClick={() => onSelectProduct(product.id)}>
                  <td className="border-t border-slate-100 px-5 py-4 lg:px-6">
                    <div className="flex items-center gap-4">
                      <ProductThumbnail product={product} />
                      <span>
                        <span className="block font-black text-slate-950">{product.name}</span>
                        <span className="mt-1 block max-w-xs text-sm font-medium text-slate-500">{product.description}</span>
                      </span>
                    </div>
                  </td>
                  <td className="border-t border-slate-100 px-4 py-4 text-sm font-black text-slate-950">{product.price}</td>
                  <td className="border-t border-slate-100 px-4 py-4"><AllergensList allergens={product.allergens} /></td>
                  <td className="border-t border-slate-100 px-4 py-4"><StatusBadge variant={product.availability === "Disponible" ? "success" : "danger"}>{product.availability}</StatusBadge></td>
                  <td className="border-t border-slate-100 px-4 py-4">{product.promo === "Promo" ? <StatusBadge variant="warning">Promo</StatusBadge> : <span className="text-sm font-bold text-slate-400">—</span>}</td>
                  <td className="border-t border-slate-100 px-4 py-4">
                    <button onClick={(event) => { event.stopPropagation(); onToggleVisibility(product.id); }} type="button" aria-label={product.visible ? `Masquer ${product.name}` : `Afficher ${product.name}`}>
                      <VisibilityIcon visible={product.visible} />
                    </button>
                  </td>
                  <td className="relative border-t border-slate-100 px-5 py-4 text-right lg:px-6">
                    <ActionsButton product={product} actionsProductId={actionsProductId} onAction={onAction} onToggleActions={onToggleActions} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function MobileProductMeta({ product, onToggleVisibility }: { product: ProductItem; onToggleVisibility: (productId: string) => void }) {
  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <MobileMeta label="Prix" value={product.price} strong />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Disponibilité</p>
          <div className="mt-2"><StatusBadge variant={product.availability === "Disponible" ? "success" : "danger"}>{product.availability}</StatusBadge></div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Promo</p>
          <div className="mt-2">{product.promo === "Promo" ? <StatusBadge variant="warning">Promo</StatusBadge> : <span className="text-sm font-bold text-slate-400">—</span>}</div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Visibilité</p>
          <button className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600" onClick={(event) => { event.stopPropagation(); onToggleVisibility(product.id); }} type="button">
            <VisibilityIcon visible={product.visible} />
            {product.visible ? "Visible" : "Masqué"}
          </button>
        </div>
      </div>
      <div className="mt-4"><AllergensList allergens={product.allergens} /></div>
    </>
  );
}

function ActionsButton({ product, actionsProductId, onAction, onToggleActions }: { product: ProductItem; actionsProductId: string | null; onAction: (productId: string, action: RowAction) => void; onToggleActions: (productId: string) => void }) {
  const open = actionsProductId === product.id;

  function handleAction(action: RowAction) {
    onAction(product.id, action);
  }

  return (
    <span className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
      <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" type="button" aria-label={`Actions pour ${product.name}`} aria-expanded={open} onClick={() => onToggleActions(product.id)}>
        <DotsIcon />
      </button>
      {open ? (
        <span className="absolute right-0 top-11 z-20 w-40 rounded-3xl border border-slate-200 bg-white p-2 text-left shadow-xl shadow-slate-900/10">
          <ActionItem label="Modifier" onClick={() => handleAction("edit")} />
          <ActionItem label="Dupliquer" onClick={() => handleAction("duplicate")} />
          <ActionItem label={product.visible ? "Masquer" : "Afficher"} onClick={() => handleAction("hide")} />
          <ActionItem danger label="Supprimer" onClick={() => handleAction("delete")} />
        </span>
      ) : null}
    </span>
  );
}

function ActionItem({ danger = false, label, onClick }: { danger?: boolean; label: string; onClick: () => void }) {
  return (
    <button className={`block w-full rounded-2xl px-3 py-2 text-left text-sm font-black transition ${danger ? "text-rose-700 hover:bg-rose-50" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}

function EmptyProductsState() {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
        <SearchIconInline />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950">Aucun produit trouvé</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">Essayez une autre recherche, changez de catégorie ou repassez le filtre sur Tous.</p>
    </div>
  );
}

function ProductThumbnail({ product }: { product: ProductItem }) {
  return (
    <span className={`relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${product.imageTone}`}>
      <span className="absolute inset-x-3 bottom-2 h-5 rounded-full bg-white/55 blur-sm" />
      <span className="m-auto h-7 w-7 rounded-full bg-white/50 ring-1 ring-white/60" />
    </span>
  );
}

function AllergensList({ allergens }: { allergens: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {allergens.map((allergen) => <AllergenBadge allergen={allergen} key={allergen} />)}
    </div>
  );
}

function AllergenBadge({ allergen }: { allergen: string }) {
  return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{allergen}</span>;
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  return (
    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${visible ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`} title={visible ? "Visible" : "Masqué"}>
      {visible ? <EyeIcon /> : <EyeOffIcon />}
    </span>
  );
}

function MobileMeta({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`mt-2 ${strong ? "font-black text-slate-950" : "font-bold text-slate-600"}`}>{value}</p>
    </div>
  );
}

function SearchIcon() {
  return <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}

function SearchIconInline() {
  return <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}

function FilterIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5h18" /><path d="M6 12h12" /><path d="M10 19h4" /></svg>;
}

function CheckIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>;
}

function EyeIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
}

function EyeOffIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.3A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.4 3.3" /><path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.7-1.2" /></svg>;
}

function DotsIcon() {
  return <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>;
}
