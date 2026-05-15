"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavigationItems, isDashboardPathActive } from "./dashboardNavigation";

export function DashboardMobileNav() {
  const pathname = usePathname();
  const isSettingsRoute = isDashboardPathActive(pathname, "/dashboard/settings");

  return (
    <div className={`tableflash-dashboard-mobile-nav border-b border-emerald-100 bg-white px-4 lg:hidden ${isSettingsRoute ? "py-3" : "py-4"}`}>
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="TableFlash dashboard">
          <span className={`${isSettingsRoute ? "h-9 w-9 rounded-xl" : "h-10 w-10 rounded-2xl"} flex items-center justify-center bg-emerald-700 text-white shadow-lg shadow-emerald-900/15`}>
            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.7 2.6 4.9 13.1c-.5.6-.1 1.5.7 1.5h5l-1.3 6.5c-.2 1 .9 1.6 1.6.8l8.5-10.7c.5-.6.1-1.5-.7-1.5h-4.8l1.4-6.3c.2-.9-.9-1.5-1.6-.8Z" />
            </svg>
          </span>
          <span className={`${isSettingsRoute ? "text-lg" : "text-xl"} font-black tracking-tight text-slate-950`}>TableFlash</span>
        </Link>
        <div className="max-w-[42vw] truncate rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
          Le Bistrot
        </div>
      </div>

      <div className={`${isSettingsRoute ? "mt-3 rounded-2xl p-2" : "mt-4 rounded-3xl p-3"} border border-emerald-100 bg-emerald-50/70`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700/80">Restaurant</p>
        <button
          className={`mt-2 flex w-full items-center justify-between bg-white text-left text-sm font-black text-slate-950 shadow-sm ${isSettingsRoute ? "rounded-xl px-3 py-2" : "rounded-2xl px-4 py-3"}`}
          type="button"
        >
          <span className="min-w-0 truncate">Le Bistrot des Halles</span>
          <span aria-hidden="true" className="text-emerald-700">⌄</span>
        </button>
      </div>

      {!isSettingsRoute ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-emerald-700 p-4 text-white shadow-lg shadow-emerald-900/10">
            <p className="text-base font-black">14 jours offerts</p>
            <p className="mt-1 text-sm font-semibold text-emerald-50/80">
              Pour les 10 premiers restaurants pilotes
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-800">
              LB
            </span>
            <div>
              <p className="text-sm font-black text-slate-950">Le Bistrot</p>
              <p className="text-xs font-semibold text-slate-500">Voir mon compte</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Navigation mobile du dashboard">
        {dashboardNavigationItems.map((item) => {
          const active = isDashboardPathActive(pathname, item.href);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                active
                  ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/15"
                  : "bg-slate-100 text-slate-600"
              }`}
              href={item.href}
              key={item.href}
            >
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
