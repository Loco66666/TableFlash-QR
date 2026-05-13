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
  "À surveiller": "bg-amber-50 text-amber-700 ring-amber-100",
  "Complément fréquent": "bg-violet-50 text-violet-700 ring-violet-100",
};

function getProductReading(product: ProductRow, index: number): TrendBadge {
  if (index === 0) {
    return "Top vente";
  }

  if (product.name.toLowerCase().includes("frites") || product.name.toLowerCase().includes("limonade")) {
    return "Complément fréquent";
  }

  if (product.quantity <= 5) {
    return "À surveiller";
  }

  return product.badge;
}

const productGridClass = "xl:grid-cols-[minmax(13rem,1fr)_7rem_9.5rem_9rem]";
const cardClass = "flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6";
const eyebrowClass = "text-sm font-black uppercase tracking-[0.08em] text-emerald-700";
const titleClass = "text-2xl font-black leading-tight text-slate-950";
const subtitleClass = "mt-2 break-words text-sm font-semibold leading-6 text-slate-500";
const tableHeaderClass = "mt-5 hidden h-8 min-w-0 max-w-full items-center gap-4 px-3 text-[0.68rem] font-black uppercase tracking-[0.10em] text-slate-400 xl:grid";
const rowsClass = "mt-3 flex min-w-0 max-w-full flex-1 flex-col gap-3";
const rowClass = "flex min-h-[60px] min-w-0 max-w-full items-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 p-3.5 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm hover:shadow-slate-200/70 sm:p-3 xl:h-16";
const mobileLabelClass = "text-xs font-black uppercase tracking-[0.10em] text-slate-400 xl:hidden";
const mutedValueClass = "whitespace-nowrap text-sm font-bold tabular-nums text-slate-700";
const strongValueClass = "whitespace-nowrap text-sm font-black tabular-nums text-emerald-700";

export function TopProductsTable({ products }: { products: ProductRow[] }) {
  return (
    <article className={cardClass}>
      <div className="min-w-0 max-w-full break-words">
        <p className={eyebrowClass}>Produits les plus commandés</p>
        <h2 className={titleClass}>Produits les plus commandés</h2>
        <p className={subtitleClass}>Identifiez les produits qui portent la carte.</p>
      </div>

      <div className={`${tableHeaderClass} ${productGridClass}`}>
        <span className="min-w-0">Produit</span>
        <span className="text-right">Commandes</span>
        <span className="text-right">Ventes estimées</span>
        <span className="text-center">Lecture</span>
      </div>

      <div className={rowsClass}>
        {products.map((product, index) => {
          const reading = getProductReading(product, index);

          return (
            <div key={product.name} className={rowClass}>
              <div className={`grid w-full min-w-0 max-w-full gap-3 xl:items-center xl:gap-4 ${productGridClass}`}>
                <p className="line-clamp-2 min-w-0 max-w-full overflow-hidden text-base font-black leading-tight text-slate-950 xl:max-w-none" title={product.name}>
                  {product.name}
                </p>

                <div className="flex min-w-0 items-center justify-between gap-3 border-t border-slate-200/70 pt-3 xl:block xl:border-0 xl:pt-0 xl:text-right">
                  <span className={mobileLabelClass}>Commandes</span>
                  <span className={mutedValueClass}>{product.quantity}</span>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-3 xl:block xl:text-right">
                  <span className={mobileLabelClass}>Ventes estimées</span>
                  <span className={strongValueClass}>{formatEuro(product.revenue)}</span>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-3 xl:justify-center">
                  <span className={mobileLabelClass}>Lecture</span>
                  <span className={`inline-flex max-w-full justify-center truncate rounded-full px-2.5 py-1 text-xs font-black leading-none ring-1 sm:min-w-[6.5rem] ${badgeClasses[reading]}`}>{reading}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 rounded-3xl bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-900">Les meilleurs produits concentrent l’essentiel de l’activité QR.</p>
    </article>
  );
}
