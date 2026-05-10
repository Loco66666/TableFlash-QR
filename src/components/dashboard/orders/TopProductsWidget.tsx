type TopProduct = {
  count: number;
  name: string;
};

type TopProductsWidgetProps = {
  products: TopProduct[];
};

const widthClasses = ["w-full", "w-2/3", "w-1/2", "w-2/5"];

export function TopProductsWidget({ products }: TopProductsWidgetProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <h2 className="text-xl font-black tracking-tight text-slate-950">Top produits du jour</h2>
      <div className="mt-5 space-y-4">
        {products.length > 0 ? products.map((product, index) => (
          <div key={product.name}>
            <div className="flex items-center justify-between gap-3 text-sm font-bold">
              <span className="text-slate-800">{product.name}</span>
              <span className="text-slate-500">{product.count} commande{product.count > 1 ? "s" : ""}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full bg-emerald-500 ${widthClasses[index] ?? "w-1/3"}`} />
            </div>
          </div>
        )) : (
          <p className="text-sm font-semibold text-slate-500">Aucun produit à afficher pour le moment.</p>
        )}
      </div>
    </section>
  );
}
