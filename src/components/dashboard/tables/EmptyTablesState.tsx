type EmptyTablesStateProps = {
  onAddTable: () => void;
};

export function EmptyTablesState({ onAddTable }: EmptyTablesStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl" aria-hidden="true">□</div>
      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Aucune table trouvée</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">Modifiez vos filtres ou ajoutez une nouvelle table pour générer son QR code.</p>
      <button className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700" onClick={onAddTable} type="button">
        Ajouter une table
      </button>
    </section>
  );
}
