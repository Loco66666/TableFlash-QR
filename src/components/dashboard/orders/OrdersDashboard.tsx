import { DashboardHeader } from "@/components/dashboard";

import { EmptyOrdersState } from "./EmptyOrdersState";
import { LiveServiceStatusCard } from "./LiveServiceStatusCard";
import { OrderCard } from "./OrderCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { PaymentReminderCard } from "./PaymentReminderCard";
import { PreparationTimeWidget } from "./PreparationTimeWidget";
import { SelectedOrderPanel } from "./SelectedOrderPanel";
import { TopProductsWidget } from "./TopProductsWidget";
import { orders, summaryCards } from "./ordersData";

export function OrdersDashboard() {
  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Commandes en direct"
        subtitle="Suivez les commandes reçues par QR code, validez-les et préparez-les au bon moment."
      >
        <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800" type="button">
          Mettre en pause
        </button>
        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700" type="button">
          Nouvelle commande test
        </button>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-5 lg:p-8">
        <LiveServiceStatusCard />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => (
            <OrderSummaryCard key={card.label} {...card} />
          ))}
        </section>

        <OrdersFilterBar />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">File des commandes</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Vue statique du service en cours, sans backend connecté.</p>
              </div>
              <span className="hidden rounded-full bg-white px-4 py-2 text-sm font-black text-slate-500 ring-1 ring-slate-200 sm:inline-flex">6 commandes</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {orders.map((order) => (
                <OrderCard key={order.orderNumber} order={order} selected={order.orderNumber === "#1257"} />
              ))}
            </div>

            <div className="hidden">
              <EmptyOrdersState />
            </div>
          </div>

          <div className="space-y-6">
            <SelectedOrderPanel />
            <TopProductsWidget />
            <PreparationTimeWidget />
            <PaymentReminderCard />
          </div>
        </section>
      </main>
    </>
  );
}
