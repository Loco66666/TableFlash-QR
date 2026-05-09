export const dashboardNavigationItems = [
  { label: "Tableau de bord", href: "/dashboard", shortLabel: "Accueil" },
  { label: "Menus", href: "/dashboard/menu", shortLabel: "Menus" },
  { label: "Commandes", href: "/dashboard/orders", shortLabel: "Commandes" },
  { label: "Avis clients", href: "/dashboard/reviews", shortLabel: "Avis" },
  { label: "QR par table", href: "/dashboard/tables", shortLabel: "QR" },
  { label: "Statistiques", href: "/dashboard/statistics", shortLabel: "Stats" },
  { label: "Paramètres", href: "/dashboard/settings", shortLabel: "Réglages" },
] as const;

export type DashboardNavigationHref = (typeof dashboardNavigationItems)[number]["href"];

export function isDashboardPathActive(pathname: string, href: DashboardNavigationHref) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
