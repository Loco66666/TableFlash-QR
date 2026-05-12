export function StatisticsEmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-2xl">📊</div>
      <h2 className="mt-5 text-2xl font-black text-slate-950">Aucune donnée pour cette période</h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-500">Les statistiques apparaîtront dès que des commandes QR et des avis clients seront disponibles.</p>
      <button type="button" onClick={onRefresh} className="mt-6 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800">
        Actualiser
      </button>
    </section>
  );
}
