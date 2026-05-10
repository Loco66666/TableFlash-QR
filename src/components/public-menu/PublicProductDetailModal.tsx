import { formatEuro } from "@/lib/formatters";
import { PublicAllergenBadge } from "./PublicAllergenBadge";
import type { PublicMenuProduct } from "./types";

type PublicProductDetailModalProps = {
  product: PublicMenuProduct | null;
  quantity: number;
  note: string;
  orderingDisabled: boolean;
  onQuantityChange: (quantity: number) => void;
  onNoteChange: (note: string) => void;
  onAddToCart: () => void;
  onClose: () => void;
};

export function PublicProductDetailModal({
  product,
  quantity,
  note,
  orderingDisabled,
  onQuantityChange,
  onNoteChange,
  onAddToCart,
  onClose,
}: PublicProductDetailModalProps) {
  if (!product) {
    return null;
  }

  const canOrder = product.available && !orderingDisabled;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-3 pb-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <div className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.promo && product.promoLabel ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{product.promoLabel}</span> : null}
              {!product.available ? <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">Indisponible</span> : null}
            </div>
            <h2 id="product-modal-title" className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-950">
              {product.name}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-slate-100 text-xl font-black text-slate-600" aria-label="Fermer la fiche produit">
            ×
          </button>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
        <p className="mt-4 text-2xl font-black text-emerald-700">{formatEuro(product.price)}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.allergens.map((allergen) => (
            <PublicAllergenBadge key={allergen} label={allergen} />
          ))}
        </div>

        {!product.available ? <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">Momentanément indisponible</p> : null}

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <label className="text-sm font-extrabold text-slate-950" htmlFor="product-note">
            Précision pour ce plat
          </label>
          <textarea
            id="product-note"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Ex : sans oignons, sauce à part..."
            className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-3 text-base text-slate-900 outline-none ring-emerald-600/20 placeholder:text-slate-400 focus:ring-4"
          />
        </div>

        <div className="mt-5 flex items-center justify-between rounded-3xl border border-slate-100 p-3">
          <span className="text-sm font-extrabold text-slate-700">Quantité</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-slate-100 text-xl font-black text-slate-800" aria-label="Diminuer la quantité">
              −
            </button>
            <span className="min-w-8 text-center text-xl font-black text-slate-950">{quantity}</span>
            <button type="button" onClick={() => onQuantityChange(quantity + 1)} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-emerald-700 text-xl font-black text-white" aria-label="Augmenter la quantité">
              +
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" onClick={onClose} className="min-h-12 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-700">
            Fermer
          </button>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={!canOrder}
            className={`min-h-12 rounded-2xl px-4 text-sm font-black ${canOrder ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}
          >
            {canOrder ? "Ajouter au panier" : "Indisponible"}
          </button>
        </div>
      </div>
    </div>
  );
}
