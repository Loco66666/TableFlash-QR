import { PublicPaymentNotice } from "./PublicPaymentNotice";
import type { PublicRestaurant } from "./types";

type PublicMenuHeaderProps = {
  restaurant: PublicRestaurant;
  tableName: string;
};

export function PublicMenuHeader({ restaurant, tableName }: PublicMenuHeaderProps) {
  const isOpen = restaurant.serviceStatus === "open";

  return (
    <header className="overflow-hidden rounded-b-[2rem] bg-[#063F2A] px-5 pb-6 pt-5 text-white shadow-2xl shadow-emerald-950/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5" aria-label="TableFlash">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-400 text-lg font-black text-emerald-950 shadow-lg shadow-emerald-950/20">
            ⚡
          </span>
          <span className="text-lg font-black tracking-tight">TableFlash</span>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur"
          aria-label="Langue actuellement en français"
        >
          FR
        </button>
      </div>

      <div className="mt-7">
        <p className="text-sm font-semibold text-emerald-100">{tableName}</p>
        <h1 className="mt-1 text-3xl font-black tracking-[-0.04em]">{restaurant.name}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
              isOpen ? "bg-emerald-300 text-emerald-950" : "bg-slate-200 text-slate-700"
            }`}
          >
            {isOpen ? "Service ouvert" : "Service fermé"}
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50">
            Menu à table
          </span>
        </div>
      </div>

      <div className="mt-5">
        <PublicPaymentNotice note={restaurant.paymentNote} compact />
      </div>
    </header>
  );
}
