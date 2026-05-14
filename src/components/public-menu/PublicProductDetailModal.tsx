import { ProductImage } from "@/components/shared/ProductImage";
import { formatEuro } from "@/lib/formatters";
import { PublicAllergenBadge } from "./PublicAllergenBadge";
import type { PublicMenuProduct } from "./types";

type PublicProductDetailModalProps = {
  product: PublicMenuProduct | null;
  quantity: number;
  note: string;
  orderingDisabled: boolean;
  hydrationReady?: boolean;
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
  hydrationReady = true,
  onQuantityChange,
  onNoteChange,
  onAddToCart,
  onClose,
}: PublicProductDetailModalProps) {
  if (!product) {
    return null;
  }

  const canOrder = product.available && !orderingDisabled;
  const ctaTotal = product.price * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-3 pb-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-[2.25rem] bg-white p-5 shadow-2xl md:rounded-[2.25rem]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="relative overflow-hidden rounded-[1.75rem]">
          <ProductImage
            categoryName={product.category}
            imageAlt={product.imageAlt}
            imageTone={product.imageTone}
            imageUrl={product.imageUrl}
            productName={product.name}
            variant="modal"
            visualPreset={product.visualPreset}
            hydrationReady={hydrationReady}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 grid min-h-11 min-w-11 place-items-center rounded-full bg-white/90 text-xl font-black text-slate-700 shadow-sm"
            aria-label="Fermer la fiche produit"
          >
            ×
          </button>
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            {product.promo && product.promoLabel ? (
              <span className="rounded-full bg-emerald-800 px-3 py-1 text-xs font-black text-white">{product.promoLabel}</span>
            ) : null}
            {!product.available ? (
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">Indisponible</span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="product-modal-title" className="text-2xl font-black tracking-[-0.045em] text-slate-950">
              {product.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
          </div>
          <p className="shrink-0 text-xl font-black text-emerald-800">{formatEuro(product.price)}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.allergens.map((allergen) => (
            <PublicAllergenBadge key={allergen} label={allergen} />
          ))}
        </div>

        {!product.available ? (
          <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
            Ce produit est momentanément indisponible.
          </p>
        ) : null}

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <label className="text-sm font-extrabold text-slate-950" htmlFor="product-note">
            Une demande particulière ?
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
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="grid min-h-11 min-w-11 place-items-center rounded-full bg-slate-100 text-xl font-black text-slate-800"
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <span className="min-w-8 text-center text-xl font-black text-slate-950">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="grid min-h-11 min-w-11 place-items-center rounded-full bg-emerald-800 text-xl font-black text-white"
              aria-label="Augmenter la quantité"
            >
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
            className={`min-h-12 rounded-2xl px-4 text-sm font-black ${
              canOrder
                ? "bg-emerald-800 text-white shadow-lg shadow-emerald-800/20"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {canOrder ? `Ajouter au panier — ${formatEuro(ctaTotal)}` : "Produit indisponible"}
          </button>
        </div>
      </div>
    </div>
  );
}
