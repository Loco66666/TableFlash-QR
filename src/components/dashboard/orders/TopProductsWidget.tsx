import { topProducts } from "./ordersData";

export function TopProductsWidget() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <h2 className="text-xl font-black tracking-tight text-slate-950">Top produits du jour</h2>
      <div className="mt-5 space-y-4">
        {topProducts.map((product) => (
          <div key={product.name}>
            <div className="flex items-center justify-between gap-3 text-sm font-bold">
              <span className="text-slate-800">{product.name}</span>
              <span className="text-slate-500">{product.count}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full bg-emerald-500 ${product.percentage}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
