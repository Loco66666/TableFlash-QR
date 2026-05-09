"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileItems = [
  { label: "Accueil", href: "/dashboard" },
  { label: "Menus", href: "/dashboard/menu" },
  { label: "Commandes", href: "/dashboard/orders" },
  { label: "Avis", href: "/dashboard/reviews" },
  { label: "QR", href: "/dashboard/tables" },
  { label: "Stats", href: "/dashboard/statistics" },
  { label: "Réglages", href: "/dashboard/settings" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-emerald-100 bg-white px-4 py-4 lg:hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="TableFlash dashboard">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.7 2.6 4.9 13.1c-.5.6-.1 1.5.7 1.5h5l-1.3 6.5c-.2 1 .9 1.6 1.6.8l8.5-10.7c.5-.6.1-1.5-.7-1.5h-4.8l1.4-6.3c.2-.9-.9-1.5-1.6-.8Z" />
            </svg>
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950">TableFlash</span>
        </Link>
        <div className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
          Le Bistrot
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Navigation mobile du dashboard">
        {mobileItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                active ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
