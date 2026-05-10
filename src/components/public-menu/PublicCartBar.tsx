import { formatEuro } from "@/lib/formatters";

type PublicCartBarProps = {
  itemCount: number;
  total: number;
  onOpenCart: () => void;
};

export function PublicCartBar({ itemCount, total, onOpenCart }: PublicCartBarProps) {
  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center bg-gradient-to-t from-slate-950/15 to-transparent p-3">
      <button
        type="button"
        onClick={onOpenCart}
        className="flex min-h-16 w-full max-w-[520px] items-center justify-between rounded-3xl bg-slate-950 px-5 text-white shadow-2xl shadow-slate-950/30 active:scale-[0.99]"
      >
        <span className="text-left">
          <span className="block text-base font-black">Voir le panier</span>
          <span className="block text-xs font-semibold text-slate-300">{itemCount} article{itemCount > 1 ? "s" : ""}</span>
        </span>
        <span className="rounded-2xl bg-emerald-500 px-4 py-2 text-base font-black text-emerald-950">{formatEuro(total)}</span>
      </button>
    </div>
  );
}
