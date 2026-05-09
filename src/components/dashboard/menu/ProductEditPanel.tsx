export function ProductEditPanel() {
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Produit sélectionné</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Édition du produit</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Statique</span>
      </div>

      <div className="mt-6 space-y-5">
        <Field label="Nom du produit" value="Burger Classique" />
        <Field label="Description" value="Steak haché, cheddar, salade, tomate, oignons rouges, sauce maison." multiline />
        <Field label="Prix" value="18,00 €" />

        <div>
          <p className="text-sm font-black text-slate-700">Allergènes</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Gluten', 'Lait', 'Sésame'].map((allergen) => (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600" key={allergen}>{allergen}</span>
            ))}
          </div>
        </div>

        <ToggleRow label="Disponible" checked />

        <div>
          <p className="text-sm font-black text-slate-700">Photo preview</p>
          <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-200 via-orange-100 to-emerald-100 p-4">
            <div className="flex h-32 items-center justify-center rounded-2xl bg-white/35 ring-1 ring-white/60">
              <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-emerald-800">Burger Classique</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15" type="button">Changer</button>
            <button className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700" type="button">Supprimer</button>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4">
          <ToggleRow label="Promotion" checked />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <Field label="Type de promotion" value="Pourcentage" compact />
            <Field label="Valeur" value="-10 %" compact />
          </div>
          <div className="mt-3">
            <Field label="Fin de la promotion" value="31/05/2025" compact />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm" type="button">Annuler</button>
          <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15" type="button">Enregistrer</button>
        </div>
      </div>
    </aside>
  );
}

type FieldProps = {
  label: string;
  value: string;
  multiline?: boolean;
  compact?: boolean;
};

function Field({ label, value, multiline = false, compact = false }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      {multiline ? (
        <textarea className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none" readOnly value={value} />
      ) : (
        <input className={`mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 ${compact ? "py-2.5" : "py-3"} text-sm font-semibold text-slate-700 outline-none`} readOnly value={value} />
      )}
    </label>
  );
}

function ToggleRow({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span className={`flex h-7 w-12 items-center rounded-full p-1 ${checked ? "justify-end bg-emerald-700" : "justify-start bg-slate-200"}`}>
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </span>
    </div>
  );
}
