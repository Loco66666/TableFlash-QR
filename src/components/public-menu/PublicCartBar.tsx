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
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-5">
      <button
        type="button"
        onClick={onOpenCart}
        className="flex min-h-16 w-full max-w-[428px] items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-[#063F2A] px-4 text-white shadow-2xl shadow-emerald-950/25 ring-1 ring-emerald-200/20 backdrop-blur active:scale-[0.99] md:max-w-[428px]"
      >
        <span className="text-left">
          <span className="block text-sm font-extrabold text-emerald-100">
            {itemCount} article{itemCount > 1 ? "s" : ""}
          </span>
          <span className="mt-0.5 block text-lg font-black tracking-[-0.03em]">{formatEuro(total)}</span>
        </span>
        <span className="flex items-center gap-2 rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-950/15">
          Vérifier ma commande
          <span aria-hidden="true">→</span>
        </span>
      </button>
    </div>
  );
}
