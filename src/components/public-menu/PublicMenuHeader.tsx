import { PublicPaymentNotice } from "./PublicPaymentNotice";
import type { PublicRestaurant } from "./types";

type PublicMenuHeaderProps = {
  restaurant: PublicRestaurant;
  tableName: string;
};

export function PublicMenuHeader({ restaurant, tableName }: PublicMenuHeaderProps) {
  const isOpen = restaurant.serviceStatus === "open";

  return (
    <header className="relative overflow-hidden bg-[#063F2A] px-5 pb-6 pt-5 text-white shadow-2xl shadow-emerald-950/20">
      <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-emerald-300/20 blur-2xl" />
      <div className="absolute -bottom-20 left-6 h-40 w-40 rounded-full bg-lime-200/10 blur-2xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5" aria-label="TableFlash">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-300 text-lg font-black text-emerald-950 shadow-lg shadow-emerald-950/20">
            ⚡
          </span>
          <span className="text-base font-black tracking-tight text-emerald-50">TableFlash</span>
        </div>
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-extrabold shadow-sm ${
            isOpen ? "bg-emerald-300 text-emerald-950" : "bg-slate-200 text-slate-700"
          }`}
        >
          {isOpen ? "Service ouvert" : "Service fermé"}
        </span>
      </div>

      <div className="relative mt-7">
        <p className="text-sm font-bold text-emerald-100">{tableName}</p>
        <h1 className="mt-1 max-w-[18rem] text-[2rem] font-black leading-[1.02] tracking-[-0.055em]">
          {restaurant.name}
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-6 text-emerald-50/85">
          Une carte courte, lisible et préparée par l’équipe du restaurant.
        </p>
      </div>

      <div className="relative mt-5">
        <PublicPaymentNotice note={restaurant.paymentNote} compact inverted />
      </div>
    </header>
  );
}
