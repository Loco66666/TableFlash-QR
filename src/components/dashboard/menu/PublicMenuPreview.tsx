import type { CategoryItem, ProductItem } from "./menuData";

type PublicMenuPreviewProps = {
  categories: CategoryItem[];
  products: ProductItem[];
  selectedCategoryId: string | "all";
  onCartClick: () => void;
};

export function PublicMenuPreview({ categories, products, selectedCategoryId, onCartClick }: PublicMenuPreviewProps) {
  const visibleProducts = products.filter((product) => product.visible && (selectedCategoryId === "all" || product.categoryId === selectedCategoryId));

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Client</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Aperçu menu public</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">Mobile</span>
      </div>

      <MobilePreview categories={categories} products={visibleProducts} selectedCategoryId={selectedCategoryId} onCartClick={onCartClick} />
    </section>
  );
}

export function MobilePreview({ categories, products, selectedCategoryId, onCartClick }: PublicMenuPreviewProps) {
  return (
    <div className="mt-6 flex justify-center">
      <div className="w-full max-w-[330px] rounded-[2.5rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-900/15">
        <div className="overflow-hidden rounded-[2rem] bg-white">
          <div className="bg-[#063F2A] px-5 pb-5 pt-6 text-white">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/30" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">Menu QR</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight">Le Bistrot des Halles</h3>
            <p className="mt-2 text-sm font-semibold text-emerald-50/80">Commande à table · Paiement au serveur</p>
          </div>

          <div className="space-y-4 bg-slate-50 px-4 py-5">
            <div className="flex gap-2 overflow-hidden">
              {categories.map((category) => (
                <span className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${selectedCategoryId === category.id ? "bg-emerald-700 text-white" : "bg-white text-slate-500"}`} key={category.id}>{category.name}</span>
              ))}
            </div>

            {products.length > 0 ? products.slice(0, 4).map((product) => (
              <PreviewRow key={product.id} name={product.name} description={product.description} price={product.price} promo={product.promo} promoValue={product.promoValue} available={product.available} />
            )) : (
              <p className="rounded-3xl bg-white p-4 text-center text-sm font-bold text-slate-500">Aucun produit visible dans cette sélection.</p>
            )}

            <button className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20" onClick={onCartClick} type="button">
              Voir le panier · 1 article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type PreviewRowProps = {
  name: string;
  description: string;
  price: string;
  promo?: boolean;
  promoValue?: string;
  available?: boolean;
};

function PreviewRow({ name, description, price, promo = false, promoValue = "Promo", available = true }: PreviewRowProps) {
  return (
    <article className={`flex gap-3 rounded-3xl bg-white p-3 shadow-sm shadow-slate-200/70 ${available ? "" : "opacity-60"}`}>
      <span className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-amber-200 via-orange-100 to-emerald-100" />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="font-black text-slate-950">{name}</span>
          {promo ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">{promoValue || "Promo"}</span> : null}
        </span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{description}</span>
        <span className="mt-2 block text-sm font-black text-emerald-700">{price}</span>
        {!available ? <span className="mt-1 block text-xs font-black text-rose-600">En rupture</span> : null}
      </span>
    </article>
  );
}
