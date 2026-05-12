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

const productGridClass = "xl:grid-cols-[minmax(0,1fr)_3.25rem_5.75rem_5.75rem]";
const cardClass = "flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6";
const sectionHeaderClass = "min-w-0 max-w-full break-words";
const eyebrowClass = "text-sm font-black uppercase tracking-[0.08em] text-emerald-700";
const titleClass = "text-2xl font-black leading-tight text-slate-950";
const tableHeaderClass = "mt-5 hidden h-8 min-w-0 max-w-full items-center gap-3 px-3 text-[0.68rem] font-black uppercase tracking-[0.10em] text-slate-400 xl:grid";
const rowsClass = "mt-3 flex min-w-0 max-w-full flex-1 flex-col gap-3";
const rowClass = "flex min-h-[60px] min-w-0 max-w-full items-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 p-3.5 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm hover:shadow-slate-200/70 sm:p-3 xl:h-16";
const mobileLabelClass = "text-xs font-black uppercase tracking-[0.10em] text-slate-400 xl:hidden";
const mutedValueClass = "whitespace-nowrap text-sm font-bold tabular-nums text-slate-700";
const strongValueClass = "whitespace-nowrap text-sm font-black tabular-nums text-emerald-700";

export function TopProductsTable({ products }: { products: ProductRow[] }) {
  return (
    <article className={cardClass}>
      <div className={sectionHeaderClass}>
        <p className={eyebrowClass}>Classement produits</p>
        <h2 className={titleClass}>Produits les plus commandés</h2>
      </div>

      <div className={`${tableHeaderClass} ${productGridClass}`}>
        <span className="min-w-0">Produit</span>
        <span className="text-right" title="Commandes" aria-label="Commandes">Cmd.</span>
        <span className="text-right">Chiffre</span>
        <span className="text-center">Tendance</span>
      </div>

      <div className={rowsClass}>
        {products.map((product) => (
          <div key={product.name} className={rowClass}>
            <div className={`grid w-full min-w-0 max-w-full gap-3 xl:items-center ${productGridClass}`}>
              <p className="line-clamp-2 min-w-0 max-w-[13rem] overflow-hidden text-base font-black leading-tight text-slate-950 xl:max-w-none" title={product.name}>
                {product.name}
              </p>

              <div className="flex min-w-0 items-center justify-between gap-3 border-t border-slate-200/70 pt-3 xl:block xl:border-0 xl:pt-0 xl:text-right">
                <span className={mobileLabelClass} title="Commandes" aria-label="Commandes">Cmd.</span>
                <span className={mutedValueClass}>{product.quantity}</span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 xl:block xl:text-right">
                <span className={mobileLabelClass}>Chiffre</span>
                <span className={strongValueClass}>{formatEuro(product.revenue)}</span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 xl:justify-center">
                <span className={mobileLabelClass}>Tendance</span>
                <span className={`inline-flex max-w-full justify-center truncate rounded-full px-2.5 py-1 text-[0.7rem] font-black leading-none ring-1 sm:min-w-[5.5rem] ${badgeClasses[product.badge]}`}>{product.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
