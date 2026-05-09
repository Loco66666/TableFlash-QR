import type { ChangeEvent } from "react";

import type { ProductItem, PromotionType } from "./menuData";

export type ProductEditForm = Pick<
  ProductItem,
  | "name"
  | "description"
  | "price"
  | "allergens"
  | "availability"
  | "promo"
  | "promotionType"
  | "promotionValue"
  | "promotionEndDate"
>;

type ProductEditPanelProps = {
  form: ProductEditForm;
  product: ProductItem | undefined;
  successMessage?: string;
  onCancel: () => void;
  onChange: (form: ProductEditForm) => void;
  onSave: () => void;
};

export function ProductEditPanel({ form, product, successMessage, onCancel, onChange, onSave }: ProductEditPanelProps) {
  const promotionActive = form.promo === "Promo";

  function updateField(field: keyof ProductEditForm, value: string) {
    onChange({ ...form, [field]: value });
  }

  function updateToggle(field: "availability" | "promo", checked: boolean) {
    onChange({
      ...form,
      [field]: field === "availability" ? (checked ? "Disponible" : "Rupture") : checked ? "Promo" : "—",
    });
  }

  function updateAllergens(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...form,
      allergens: event.target.value
        .split(",")
        .map((allergen) => allergen.trim())
        .filter(Boolean),
    });
  }

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Produit sélectionné</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Édition du produit</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Maquette</span>
      </div>

      {successMessage ? <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">{successMessage}</p> : null}

      <div className="mt-6 space-y-5">
        <Field label="Nom du produit" value={form.name} onChange={(value) => updateField("name", value)} />
        <Field label="Description" value={form.description} multiline onChange={(value) => updateField("description", value)} />
        <Field label="Prix" value={form.price} onChange={(value) => updateField("price", value)} />

        <label className="block">
          <span className="text-sm font-black text-slate-700">Allergènes</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            onChange={updateAllergens}
            value={form.allergens.join(", ")}
          />
          <span className="mt-2 block text-xs font-semibold text-slate-500">Séparez les allergènes par des virgules.</span>
        </label>

        <ToggleRow label="Disponible" checked={form.availability === "Disponible"} onChange={(checked) => updateToggle("availability", checked)} />

        <div>
          <p className="text-sm font-black text-slate-700">Photo preview</p>
          <div className={`mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br ${product?.imageTone ?? "from-amber-200 via-orange-100 to-emerald-100"} p-4`}>
            <div className="flex h-32 items-center justify-center rounded-2xl bg-white/35 ring-1 ring-white/60">
              <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-emerald-800">{form.name}</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15" type="button">Changer</button>
            <button className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700" type="button">Supprimer</button>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4">
          <ToggleRow label="Promotion" checked={promotionActive} onChange={(checked) => updateToggle("promo", checked)} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-slate-700">Type de promotion</span>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                onChange={(event) => updateField("promotionType", event.target.value as PromotionType)}
                value={form.promotionType}
              >
                <option>Pourcentage</option>
                <option>Montant offert</option>
                <option>Menu spécial</option>
              </select>
            </label>
            <Field label="Valeur" value={form.promotionValue} compact onChange={(value) => updateField("promotionValue", value)} />
          </div>
          <div className="mt-3">
            <Field label="Fin de la promotion" value={form.promotionEndDate} compact type="date" onChange={(value) => updateField("promotionEndDate", value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50" onClick={onCancel} type="button">Annuler</button>
          <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800" onClick={onSave} type="button">Enregistrer</button>
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
  type?: "text" | "date";
  onChange: (value: string) => void;
};

function Field({ label, value, multiline = false, compact = false, type = "text", onChange }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      {multiline ? (
        <textarea className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className={`mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 ${compact ? "py-2.5" : "py-3"} text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100`} onChange={(event) => onChange(event.target.value)} type={type} value={value} />
      )}
    </label>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button className="flex w-full items-center justify-between gap-4 rounded-2xl text-left" onClick={() => onChange(!checked)} type="button" aria-pressed={checked}>
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "justify-end bg-emerald-700" : "justify-start bg-slate-200"}`}>
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  );
}
