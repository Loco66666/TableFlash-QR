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
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center bg-gradient-to-t from-slate-950/20 via-slate-950/5 to-transparent p-3">
      <button
        type="button"
        onClick={onOpenCart}
        className="flex min-h-16 w-full max-w-[460px] items-center justify-between gap-4 rounded-[1.5rem] bg-slate-950 px-4 text-white shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 active:scale-[0.99]"
      >
        <span className="text-left">
          <span className="block text-sm font-extrabold text-slate-300">
            {itemCount} article{itemCount > 1 ? "s" : ""} · {formatEuro(total)}
          </span>
          <span className="mt-0.5 block text-base font-black">Voir le panier</span>
        </span>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 text-lg font-black text-emerald-950">→</span>
      </button>
    </div>
  );
}
