import Link from "next/link";

import { DashboardHeader, MetricCard, StatusBadge } from "@/components/dashboard";

const metricCards = [
  {
    label: "Commandes du jour",
    value: "18",
    helper: "+4 commandes depuis 12h00",
    tone: "emerald" as const,
    icon: <OrdersIcon />,
  },
  {
    label: "Ventes estimées",
    value: "642 €",
    helper: "Paiement à la caisse ou auprès du serveur.",
    tone: "amber" as const,
    icon: <RevenueIcon />,
  },
  {
    label: "Note clients",
    value: "4,8/5",
    helper: "12 nouveaux retours cette semaine",
    tone: "blue" as const,
    icon: <StarIcon />,
  },
  {
    label: "Produits actifs",
    value: "46",
    helper: "3 produits en promotion",
    tone: "rose" as const,
    icon: <ProductsIcon />,
  },
];

const servicePoints = [
  { label: "1 commande à valider", href: "/dashboard/orders", tone: "warning" as const },
  { label: "3 commandes en préparation", href: "/dashboard/orders", tone: "neutral" as const },
  { label: "2 avis à traiter", href: "/dashboard/reviews", tone: "success" as const },
];

const priorities = [
  {
    title: "Accepter les nouvelles commandes",
    helper: "Voir les demandes reçues depuis les QR.",
    href: "/dashboard/orders",
    icon: <OrdersIcon />,
  },
  {
    title: "Suivre les commandes en préparation",
    helper: "Gardez le rythme entre salle et cuisine.",
    href: "/dashboard/orders",
    icon: <KitchenIcon />,
  },
  {
    title: "Traiter les avis clients",
    helper: "Répondez aux retours qui attendent.",
    href: "/dashboard/reviews",
    icon: <StarIcon />,
  },
  {
    title: "Vérifier les produits en rupture",
    helper: "Ajustez le menu avant le prochain rush.",
    href: "/dashboard/menu",
    icon: <ProductsIcon />,
  },
];

const recentOrders = [
  { number: "#1257", table: "Table 8", items: "Burger Classique, Frites Maison", total: "28,50 €", status: "Nouvelle", variant: "warning" as const },
  { number: "#1256", table: "Table 3", items: "Salade César, Limonade", total: "21,00 €", status: "En préparation", variant: "neutral" as const },
  { number: "#1255", table: "Comptoir", items: "Tiramisu, Café gourmand", total: "13,50 €", status: "Prête", variant: "success" as const },
];

const quickActions = [
  { label: "Ajouter un produit", href: "/dashboard/menu", icon: <ProductsIcon /> },
  { label: "Gérer les commandes", href: "/dashboard/orders", icon: <OrdersIcon /> },
  { label: "Préparer les QR", href: "/dashboard/tables", icon: <QrIcon /> },
  { label: "Traiter les avis clients", href: "/dashboard/reviews", icon: <StarIcon /> },
];

const dailyInsights = [
  "Pic d’activité autour de 12h.",
  "Burger Classique est le produit le plus demandé.",
  "2 avis clients restent à traiter.",
  "Les commandes QR progressent aujourd’hui.",
];

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Tableau de bord"
        subtitle="Votre cockpit quotidien pour piloter le service, les commandes et les avis."
      >
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">
          Service midi en cours
        </span>
      </DashboardHeader>

      <main className="flex-1 space-y-7 bg-slate-50/60 p-5 lg:p-8">
        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm shadow-emerald-950/5">
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 p-6 text-white lg:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-100">Situation du service</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">Service midi en cours</h2>
                  <p className="mt-3 text-base font-medium leading-7 text-emerald-50">
                    Commandes ouvertes · Paiement à la caisse ou auprès du serveur
                  </p>
                </div>
                <Link
                  className="inline-flex w-fit items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-900 shadow-sm transition hover:bg-emerald-50"
                  href="/dashboard/orders"
                >
                  Ouvrir les commandes
                </Link>
              </div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-3 lg:p-5">
              {servicePoints.map((point) => (
                <Link
                  className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                  href={point.href}
                  key={point.label}
                >
                  <StatusBadge variant={point.tone}>Priorité</StatusBadge>
                  <p className="mt-3 text-base font-black text-slate-950">{point.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Priorités</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">À faire maintenant</h2>
            <div className="mt-5 space-y-3">
              {priorities.map((priority) => (
                <Link
                  className="group flex items-start gap-3 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                  href={priority.href}
                  key={priority.title}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-100 group-hover:ring-emerald-100">
                    {priority.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-slate-950">{priority.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-slate-500">{priority.helper}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </section>

        <section className="grid gap-7 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Aujourd’hui</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Dernières commandes</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">Les dernières commandes reçues depuis les QR.</p>
              </div>
              <Link className="text-sm font-black text-emerald-700 hover:text-emerald-900" href="/dashboard/orders">
                Tout voir
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {recentOrders.map((order) => (
                <Link
                  className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50 md:flex-row md:items-center md:justify-between"
                  href="/dashboard/orders"
                  key={order.number}
                >
                  <span className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-emerald-700 shadow-sm">
                      {order.number.replace("#", "")}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-slate-950">Commande {order.number}</span>
                        <StatusBadge variant={order.variant}>{order.status}</StatusBadge>
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-slate-500">{order.table}</span>
                      <span className="mt-2 block text-sm text-slate-600">{order.items}</span>
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                    <span className="text-lg font-black text-slate-950">{order.total}</span>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Ouvrir</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-7">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Actions rapides</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Gagner du temps</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {quickActions.map((action) => (
                  <Link
                    className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-black text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
                    href={action.href}
                    key={action.label}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        {action.icon}
                      </span>
                      <span>{action.label}</span>
                    </span>
                    <span aria-hidden="true" className="text-emerald-700">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Lecture rapide du jour</p>
              <ul className="mt-5 space-y-3">
                {dailyInsights.map((insight) => (
                  <li className="flex gap-3 text-sm font-semibold leading-6 text-slate-600" key={insight}>
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-[#ECFDF5] p-5 shadow-sm shadow-emerald-950/5 lg:p-6">
              <p className="text-lg font-black text-emerald-950">Offre pilote active</p>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                14 jours offerts pour accompagner les premiers restaurants.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

function OrdersIcon() {
  return <IconFrame><path d="M7 4h10l1 17H6z" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h4" /></IconFrame>;
}

function RevenueIcon() {
  return <IconFrame><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" /></IconFrame>;
}

function StarIcon() {
  return <IconFrame><path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8-4.2-4.1 5.8-.8z" /></IconFrame>;
}

function ProductsIcon() {
  return <IconFrame><path d="M4 7h16" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7a3 3 0 0 1 6 0" /></IconFrame>;
}

function KitchenIcon() {
  return <IconFrame><path d="M4 3h16" /><path d="M7 3v18" /><path d="M17 3v18" /><path d="M4 21h16" /><path d="M9.5 8h5" /><path d="M9.5 12h5" /></IconFrame>;
}

function QrIcon() {
  return <IconFrame><path d="M4 4h6v6H4z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6H4z" /><path d="M14 14h2" /><path d="M18 14h2" /><path d="M14 18h6" /></IconFrame>;
}
