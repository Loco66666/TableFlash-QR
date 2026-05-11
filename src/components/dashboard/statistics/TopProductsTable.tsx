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
  "Top vente": "bg-emerald-50 text-emerald-700",
  "En hausse": "bg-sky-50 text-sky-700",
  Stable: "bg-slate-100 text-slate-600",
};

export function TopProductsTable({ products }: { products: ProductRow[] }) {
  return (
    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="text-2xl font-black text-slate-950">Produits les plus commandés</h2>
      <div className="mt-5 space-y-3">
        {products.map((product) => (
          <div key={product.name} className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
            <p className="font-black text-slate-950">{product.name}</p>
            <p className="text-sm font-bold text-slate-600">{product.quantity} commandes</p>
            <p className="text-sm font-black text-emerald-700">{formatEuro(product.revenue)}</p>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${badgeClasses[product.badge]}`}>{product.badge}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
