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
    label: "Chiffre d’affaires potentiel",
    value: "642 €",
    helper: "Paiement à la caisse ou au serveur",
    tone: "amber" as const,
    icon: <RevenueIcon />,
  },
  {
    label: "Avis clients",
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

const recentOrders = [
  { number: "#1257", table: "Table 8", items: "Burger Classique, Frites Maison", total: "28,50 €", status: "Nouvelle", variant: "warning" as const },
  { number: "#1256", table: "Table 3", items: "Salade César, Limonade", total: "21,00 €", status: "En préparation", variant: "neutral" as const },
  { number: "#1255", table: "Comptoir", items: "Tiramisu, Café gourmand", total: "13,50 €", status: "Prête", variant: "success" as const },
];

const quickActions = [
  "Ajouter un produit au menu",
  "Voir les commandes en direct",
  "Préparer les QR par table",
  "Consulter les avis clients",
];

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Tableau de bord"
        subtitle="Vue d’ensemble de votre établissement"
      >
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">
          Service midi en cours
        </span>
      </DashboardHeader>

      <main className="flex-1 space-y-7 p-5 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </section>

        <section className="grid gap-7 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Aujourd’hui</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Commandes récentes</h2>
              </div>
              <p className="text-sm font-semibold text-slate-500">Données de démonstration</p>
            </div>

            <div className="mt-6 space-y-3">
              {recentOrders.map((order) => (
                <article key={order.number} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-emerald-700 shadow-sm">
                      {order.number.replace("#", "")}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-950">Commande {order.number}</h3>
                        <StatusBadge variant={order.variant}>{order.status}</StatusBadge>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{order.table}</p>
                      <p className="mt-2 text-sm text-slate-600">{order.items}</p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-slate-950">{order.total}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Actions rapides</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Gagner du temps</h2>
            <div className="mt-6 space-y-3">
              {quickActions.map((action, index) => (
                <button
                  className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-black text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
                  key={action}
                  type="button"
                >
                  <span>{action}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs text-white">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-[#ECFDF5] p-5">
              <p className="text-lg font-black text-emerald-950">14 jours offerts</p>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Offre pilote réservée aux 10 premiers restaurants accompagnés par TableFlash.
              </p>
            </div>
          </div>
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
