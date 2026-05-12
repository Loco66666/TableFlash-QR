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

const productGridClass = "xl:grid-cols-[minmax(0,1fr)_3.25rem_6rem_6rem]";

export function TopProductsTable({ products }: { products: ProductRow[] }) {
  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="min-w-0 max-w-full break-words">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">Classement produits</p>
        <h2 className="text-2xl font-black leading-tight text-slate-950">Produits les plus commandés</h2>
      </div>

      <div className={`mt-5 hidden min-w-0 max-w-full gap-3 px-3 text-[0.68rem] font-black uppercase tracking-[0.06em] text-slate-400 xl:grid ${productGridClass}`}>
        <span className="min-w-0">Produit</span>
        <span className="text-right" title="Commandes" aria-label="Commandes">Cmd.</span>
        <span className="text-right">Chiffre</span>
        <span className="text-center">Tendance</span>
      </div>

      <div className="mt-3 min-w-0 max-w-full space-y-3">
        {products.map((product) => (
          <div key={product.name} className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 p-3.5 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm hover:shadow-slate-200/70 sm:p-4">
            <div className={`grid min-w-0 max-w-full gap-3 xl:items-center ${productGridClass}`}>
              <p className="min-w-0 overflow-hidden break-normal [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-base font-black leading-tight text-slate-950" title={product.name}>
                {product.name}
              </p>

              <div className="flex min-w-0 items-center justify-between gap-3 border-t border-slate-200/70 pt-3 xl:block xl:border-0 xl:pt-0 xl:text-right">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 xl:hidden" title="Commandes" aria-label="Commandes">Cmd.</span>
                <span className="whitespace-nowrap text-sm font-bold tabular-nums text-slate-700">{product.quantity}</span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 xl:block xl:text-right">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 xl:hidden">Chiffre</span>
                <span className="whitespace-nowrap text-sm font-black tabular-nums text-emerald-700">{formatEuro(product.revenue)}</span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 xl:justify-center">
                <span className="text-xs font-black uppercase tracking-[0.06em] text-slate-400 xl:hidden">Tendance</span>
                <span className={`inline-flex max-w-full justify-center truncate rounded-full px-2.5 py-1 text-[0.7rem] font-black leading-none ring-1 sm:min-w-[5.75rem] ${badgeClasses[product.badge]}`}>{product.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
