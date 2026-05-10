import { formatEuro } from "@/lib/formatters";
import { PublicAllergenBadge } from "./PublicAllergenBadge";
import type { PublicMenuProduct } from "./types";

type PublicProductCardProps = {
  product: PublicMenuProduct;
  orderingDisabled: boolean;
  onOpenProduct: (product: PublicMenuProduct) => void;
  onQuickAdd: (product: PublicMenuProduct) => void;
};

export function PublicProductCard({ product, orderingDisabled, onOpenProduct, onQuickAdd }: PublicProductCardProps) {
  const canOrder = product.available && !orderingDisabled;

  return (
    <article
      className={`rounded-3xl border bg-white p-4 shadow-sm transition ${
        product.available ? "border-slate-100 shadow-slate-200/70" : "border-slate-100 opacity-60 grayscale"
      }`}
    >
      <button type="button" onClick={() => onOpenProduct(product)} className="block w-full text-left" aria-label={`Voir ${product.name}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">{product.name}</h3>
              {product.promo && product.promoLabel ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">{product.promoLabel}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{product.description}</p>
          </div>
          <p className="shrink-0 text-base font-black text-emerald-700">{formatEuro(product.price)}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.allergens.map((allergen) => (
            <PublicAllergenBadge key={allergen} label={allergen} />
          ))}
        </div>
        {!product.available ? <p className="mt-3 text-sm font-bold text-rose-600">Momentanément indisponible</p> : null}
      </button>

      <button
        type="button"
        onClick={() => onQuickAdd(product)}
        disabled={!canOrder}
        className={`mt-4 min-h-12 w-full rounded-2xl px-4 text-sm font-black transition ${
          canOrder ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15 active:scale-[0.99]" : "cursor-not-allowed bg-slate-100 text-slate-400"
        }`}
      >
        {product.available ? "Ajouter" : "Indisponible"}
      </button>
    </article>
  );
}
