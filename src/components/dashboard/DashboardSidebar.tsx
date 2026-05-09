"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navigationItems: NavigationItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Menus", href: "/dashboard/menu", icon: <MenuIcon /> },
  { label: "Commandes", href: "/dashboard/orders", icon: <OrdersIcon /> },
  { label: "Avis clients", href: "/dashboard/reviews", icon: <ReviewsIcon /> },
  { label: "QR par table", href: "/dashboard/tables", icon: <QrIcon /> },
  { label: "Statistiques", href: "/dashboard/statistics", icon: <StatsIcon /> },
  { label: "Paramètres", href: "/dashboard/settings", icon: <SettingsIcon /> },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-80 shrink-0 flex-col bg-[#063F2A] p-5 text-white shadow-2xl shadow-emerald-950/20 lg:flex">
      <div className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3" aria-label="TableFlash dashboard">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-950/25">
            <FlashIcon />
          </span>
          <span className="text-2xl font-black tracking-tight">TableFlash</span>
        </Link>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100/75">Restaurant</p>
          <button className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-black text-slate-950 shadow-sm" type="button">
            <span>Le Bistrot des Halles</span>
            <span aria-hidden="true" className="text-emerald-700">⌄</span>
          </button>
        </div>

        <nav className="mt-6 space-y-1.5" aria-label="Navigation du dashboard">
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-white text-emerald-950 shadow-lg shadow-emerald-950/15"
                    : "text-emerald-50/82 hover:bg-white/10 hover:text-white"
                }`}
                href={item.href}
                key={item.href}
              >
                <span className={active ? "text-emerald-700" : "text-emerald-100/80"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <div className="overflow-hidden rounded-[1.75rem] bg-emerald-400 p-5 text-emerald-950 shadow-xl shadow-emerald-950/20">
            <p className="text-lg font-black">14 jours offerts</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-950/75">
              Pour les 10 premiers restaurants pilotes
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-[1.75rem] border border-white/10 bg-white/10 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-black text-emerald-800">
              LB
            </span>
            <div>
              <p className="text-sm font-black">Le Bistrot</p>
              <p className="text-xs font-semibold text-emerald-50/65">Voir mon compte</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

function FlashIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.7 2.6 4.9 13.1c-.5.6-.1 1.5.7 1.5h5l-1.3 6.5c-.2 1 .9 1.6 1.6.8l8.5-10.7c.5-.6.1-1.5-.7-1.5h-4.8l1.4-6.3c.2-.9-.9-1.5-1.6-.8Z" />
    </svg>
  );
}

function DashboardIcon() {
  return <IconFrame><path d="M4 13h6V4H4z" /><path d="M14 20h6v-9h-6z" /><path d="M4 20h6v-3H4z" /><path d="M14 7h6V4h-6z" /></IconFrame>;
}

function MenuIcon() {
  return <IconFrame><path d="M5 6h14" /><path d="M5 12h14" /><path d="M5 18h10" /></IconFrame>;
}

function OrdersIcon() {
  return <IconFrame><path d="M7 4h10l1 17H6z" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h4" /></IconFrame>;
}

function ReviewsIcon() {
  return <IconFrame><path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8-4.2-4.1 5.8-.8z" /></IconFrame>;
}

function QrIcon() {
  return <IconFrame><path d="M4 4h6v6H4z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6H4z" /><path d="M14 14h2" /><path d="M20 14v2" /><path d="M16 18h4" /><path d="M14 20h2" /></IconFrame>;
}

function StatsIcon() {
  return <IconFrame><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-3" /></IconFrame>;
}

function SettingsIcon() {
  return <IconFrame><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .2 1.7 1.7 0 0 0-.8 1.7V22H9.2v-.2a1.7 1.7 0 0 0-.8-1.7 1.7 1.7 0 0 0-2-.2l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1.1H3V10h.1a1.7 1.7 0 0 0 1.5-1.1A1.7 1.7 0 0 0 4.3 7l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 2-.2 1.7 1.7 0 0 0 .8-1.7V1h5.6v.2a1.7 1.7 0 0 0 .8 1.7 1.7 1.7 0 0 0 2 .2l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1.1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" /></IconFrame>;
}
