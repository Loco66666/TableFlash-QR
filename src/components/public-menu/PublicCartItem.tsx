import { formatEuro } from "@/lib/formatters";
import type { PublicCartItem as CartItem } from "./types";

type PublicCartItemProps = {
  item: CartItem;
  onIncrease: (productId: string, note?: string) => void;
  onDecrease: (productId: string, note?: string) => void;
  onNoteChange: (productId: string, note: string | undefined, nextNote: string) => void;
};

export function PublicCartItem({ item, onIncrease, onDecrease, onNoteChange }: PublicCartItemProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-slate-950">{item.name}</p>
          <p className="mt-1 text-sm font-bold text-emerald-700">{formatEuro(item.price)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onDecrease(item.productId, item.note)} className="grid min-h-10 min-w-10 place-items-center rounded-full bg-slate-100 text-lg font-black text-slate-800" aria-label={`Retirer un ${item.name}`}>
            −
          </button>
          <span className="min-w-7 text-center text-base font-black text-slate-950">{item.quantity}</span>
          <button type="button" onClick={() => onIncrease(item.productId, item.note)} className="grid min-h-10 min-w-10 place-items-center rounded-full bg-emerald-700 text-lg font-black text-white" aria-label={`Ajouter un ${item.name}`}>
            +
          </button>
        </div>
      </div>
      <label className="mt-3 block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400" htmlFor={`note-${item.productId}-${item.note ?? "simple"}`}>
        Note
      </label>
      <input
        id={`note-${item.productId}-${item.note ?? "simple"}`}
        value={item.note ?? ""}
        onChange={(event) => onNoteChange(item.productId, item.note, event.target.value)}
        placeholder="Une précision ?"
        className="mt-2 min-h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none ring-emerald-600/20 placeholder:text-slate-400 focus:ring-4"
      />
    </div>
  );
}
