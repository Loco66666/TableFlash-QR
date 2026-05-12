import type { TrendBadge } from "./statisticsData";

type ProductRow = {
  name: string;
  quantity: number;
  revenue: number;
  badge: TrendBadge;
};

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

const badgeClasses: Record<TrendBadge, string> = {
  "Top vente": "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "En hausse": "bg-sky-50 text-sky-700 ring-sky-100",
  Stable: "bg-slate-100 text-slate-600 ring-slate-200",
};

const productGridClass = "lg:grid-cols-[minmax(0,1fr)_120px_130px_110px]";

export function TopProductsTable({ products }: { products: ProductRow[] }) {
  return (
    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">Classement produits</p>
        <h2 className="text-2xl font-black text-slate-950">Produits les plus commandés</h2>
      </div>

      <div className={`mt-5 hidden gap-4 px-4 text-xs font-black uppercase tracking-[0.06em] text-slate-400 lg:grid ${productGridClass}`}>
        <span>Produit</span>
        <span className="text-right">Commandes</span>
        <span className="text-right">Chiffre potentiel</span>
        <span className="text-center">Tendance</span>
      </div>

      <div className="mt-3 space-y-3">
        {products.map((product) => (
          <div key={product.name} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm hover:shadow-slate-200/70">
            <div className={`grid gap-4 lg:items-center ${productGridClass}`}>
              <p className="min-w-0 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-base font-black leading-6 text-slate-950">
                {product.name}
              </p>

              <div className="flex items-center justify-between gap-4 border-t border-slate-200/70 pt-3 lg:block lg:border-0 lg:pt-0 lg:text-right">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 lg:hidden">Commandes</span>
                <span className="whitespace-nowrap text-sm font-bold tabular-nums text-slate-700">{product.quantity} commandes</span>
              </div>

              <div className="flex items-center justify-between gap-4 lg:block lg:text-right">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 lg:hidden">Chiffre potentiel</span>
                <span className="whitespace-nowrap text-sm font-black tabular-nums text-emerald-700">{formatEuro(product.revenue)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 lg:justify-center">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 lg:hidden">Tendance</span>
                <span className={`inline-flex min-w-[6.75rem] justify-center rounded-full px-3 py-1 text-xs font-black ring-1 ${badgeClasses[product.badge]}`}>{product.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
