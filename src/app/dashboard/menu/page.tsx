import { DashboardHeader } from "@/components/dashboard";
import {
  CategoryList,
  MenuSummaryCard,
  ProductEditPanel,
  ProductTable,
  PublicMenuPreview,
  categoryItems,
  products,
  summaryItems,
} from "@/components/dashboard/menu";

export default function Page() {
  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Gestion du menu"
        subtitle="Organisez vos catégories, produits, disponibilités et promotions."
      >
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50" type="button">
          Aperçu public
        </button>
        <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100" type="button">
          Ajouter une catégorie
        </button>
        <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800" type="button">
          Ajouter un produit
        </button>
      </DashboardHeader>

      <main className="flex-1 space-y-7 p-5 lg:p-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:p-5">
          <button className="flex w-full items-center justify-between gap-4 rounded-[1.5rem] bg-slate-50 p-3 text-left transition hover:bg-emerald-50" type="button">
            <span className="flex min-w-0 items-center gap-4">
              <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-500 to-amber-200 shadow-lg shadow-emerald-900/10">
                <span className="absolute inset-x-3 bottom-2 h-5 rounded-full bg-white/30 blur-sm" />
                <span className="m-auto text-base font-black text-white">LB</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-lg font-black tracking-tight text-slate-950">Le Bistrot des Halles</span>
                <span className="mt-1 block text-sm font-bold text-slate-500">Restaurant</span>
              </span>
            </span>
            <ChevronDownIcon />
          </button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {summaryItems.map((item) => (
            <MenuSummaryCard key={item.label} {...item} />
          ))}
        </section>

        <section className="grid gap-7 2xl:grid-cols-[300px_minmax(0,1fr)_380px]">
          <div className="space-y-7">
            <CategoryList categories={categoryItems} />
          </div>

          <div className="min-w-0">
            <ProductTable products={products} />
          </div>

          <div className="space-y-7">
            <ProductEditPanel />
            <PublicMenuPreview />
          </div>
        </section>
      </main>
    </>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-emerald-700" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
