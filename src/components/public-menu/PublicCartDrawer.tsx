import { formatEuro } from "@/lib/formatters";
import { PublicCartItem } from "./PublicCartItem";
import { PublicEmptyState } from "./PublicEmptyState";
import type { PublicCartItem as CartItem } from "./types";

type PublicCartDrawerProps = {
  isOpen: boolean;
  items: CartItem[];
  tableName: string;
  paymentNote: string;
  globalNote: string;
  total: number;
  onIncrease: (productId: string, note?: string) => void;
  onDecrease: (productId: string, note?: string) => void;
  onRemove: (productId: string, note?: string) => void;
  onItemNoteChange: (productId: string, note: string | undefined, nextNote: string) => void;
  onGlobalNoteChange: (note: string) => void;
  onClose: () => void;
  onValidateOrder: () => void;
};

export function PublicCartDrawer({
  isOpen,
  items,
  tableName,
  paymentNote,
  globalNote,
  total,
  onIncrease,
  onDecrease,
  onRemove,
  onItemNoteChange,
  onGlobalNoteChange,
  onClose,
  onValidateOrder,
}: PublicCartDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-3 pb-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-[2.25rem] bg-[#F8FAF7] p-5 shadow-2xl md:rounded-[2.25rem]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="cart-drawer-title" className="text-2xl font-black tracking-[-0.04em] text-slate-950">
              Votre commande
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {tableName} · {paymentNote}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white text-xl font-black text-slate-600 shadow-sm"
            aria-label="Fermer le panier"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <PublicEmptyState title="Votre panier est vide." text="Ajoutez un plat ou une boisson depuis le menu." />
          ) : (
            items.map((item) => (
              <PublicCartItem
                key={`${item.productId}-${item.note ?? ""}`}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
                onNoteChange={onItemNoteChange}
              />
            ))
          )}
        </div>

        <label className="mt-5 block text-sm font-extrabold text-slate-950" htmlFor="global-order-note">
          Une demande particulière ?
        </label>
        <textarea
          id="global-order-note"
          value={globalNote}
          onChange={(event) => onGlobalNoteChange(event.target.value)}
          placeholder="Ex : sans oignons, sauce à part, servir les boissons avant les plats..."
          className="mt-3 min-h-24 w-full rounded-3xl border border-slate-200 bg-white p-4 text-base outline-none ring-emerald-600/20 placeholder:text-slate-400 focus:ring-4"
        />

        <div className="mt-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500">
            <span>Sous-total</span>
            <span>{formatEuro(total)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-lg font-black text-slate-950">
            <span>Total</span>
            <span>{formatEuro(total)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <p className="font-black">Paiement au restaurant</p>
          <p className="mt-1">Le règlement se fera à la caisse ou auprès du serveur.</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" onClick={onClose} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700">
            Continuer le menu
          </button>
          <button type="button" onClick={onValidateOrder} className="min-h-12 rounded-2xl bg-emerald-800 px-4 text-sm font-black text-white shadow-lg shadow-emerald-800/20">
            Confirmer la commande
          </button>
        </div>
      </div>
    </div>
  );
}
