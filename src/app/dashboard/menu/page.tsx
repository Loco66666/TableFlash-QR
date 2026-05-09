import { DashboardHeader } from "@/components/dashboard";
import {
  CategoryList,
  MenuSummaryCard,
  ProductEditPanel,
  ProductTable,
  PublicMenuPreview,
  RestaurantSelectorCard,
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
        <RestaurantSelectorCard />

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
