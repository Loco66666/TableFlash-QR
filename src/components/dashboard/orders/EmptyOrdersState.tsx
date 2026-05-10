export function EmptyOrdersState() {
  return (
    <section className="rounded-[2rem] border border-dashed border-emerald-200 bg-white p-8 text-center shadow-sm shadow-slate-200/70">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-3xl text-emerald-700" aria-hidden="true">
        ✦
      </div>
      <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">Aucune commande pour ce filtre</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-500">
        Les nouvelles commandes apparaîtront ici dès qu’un client validera son panier.
      </p>
    </section>
  );
}
