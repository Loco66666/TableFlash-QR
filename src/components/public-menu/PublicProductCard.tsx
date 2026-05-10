import { formatEuro } from "@/lib/formatters";
import { PublicAllergenBadge } from "./PublicAllergenBadge";
import type { PublicMenuProduct } from "./types";

type PublicProductCardProps = {
  product: PublicMenuProduct;
  quantityInCart: number;
  orderingDisabled: boolean;
  onOpenProduct: (product: PublicMenuProduct) => void;
  onQuickAdd: (product: PublicMenuProduct) => void;
};

export function PublicProductCard({
  product,
  quantityInCart,
  orderingDisabled,
  onOpenProduct,
  onQuickAdd,
}: PublicProductCardProps) {
  const canOrder = product.available && !orderingDisabled;

  return (
    <article
      className={`overflow-hidden rounded-[1.65rem] border bg-white shadow-sm transition ${
        product.available ? "border-white shadow-slate-200/80" : "border-slate-100 bg-slate-50 opacity-70 grayscale"
      }`}
    >
      <button type="button" onClick={() => onOpenProduct(product)} className="block w-full p-4 text-left" aria-label={`Voir ${product.name}`}>
        <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3.5">
          <div className="relative h-20 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-stone-100 to-amber-100">
            <div className="absolute inset-3 rounded-[1.25rem] border border-white/60 bg-white/25" />
            <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-emerald-800/85 shadow-lg" />
            {quantityInCart > 0 ? (
              <span className="absolute left-2 top-2 rounded-full bg-slate-950 px-2 py-1 text-xs font-black text-white">
                ×{quantityInCart}
              </span>
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[1.05rem] font-black leading-5 tracking-[-0.025em] text-slate-950">{product.name}</h3>
                  {product.promo && product.promoLabel ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.68rem] font-black text-emerald-700">
                      {product.promoLabel}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">{product.description}</p>
              </div>
              <p className="shrink-0 text-base font-black text-emerald-800">{formatEuro(product.price)}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.allergens.map((allergen) => (
                <PublicAllergenBadge key={allergen} label={allergen} />
              ))}
            </div>
          </div>
        </div>

        {!product.available ? (
          <p className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-sm font-extrabold text-rose-700">
            Momentanément indisponible
          </p>
        ) : null}
      </button>

      <div className="border-t border-slate-100 px-4 py-3">
        <button
          type="button"
          onClick={() => onQuickAdd(product)}
          disabled={!canOrder}
          className={`min-h-11 w-full rounded-2xl px-4 text-sm font-black transition active:scale-[0.99] ${
            canOrder
              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          {product.available ? "Ajouter" : "Momentanément indisponible"}
        </button>
      </div>
    </article>
  );
}
