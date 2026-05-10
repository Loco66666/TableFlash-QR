import { useState } from "react";

import type { RestaurantTable } from "./tablesData";

type TableFormValues = {
  isActive: boolean;
  name: string;
  zone: string;
};

type TableFormModalProps = {
  mode: "add" | "edit";
  onClose: () => void;
  onSave: (values: TableFormValues) => void;
  table?: RestaurantTable | null;
};

export function TableFormModal({ mode, onClose, onSave, table }: TableFormModalProps) {
  const [name, setName] = useState(table?.name ?? "");
  const [zone, setZone] = useState(table?.zone ?? "Salle");
  const [isActive, setIsActive] = useState(table?.isActive ?? true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ name, zone, isActive });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="table-form-title">
      <form className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/25" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">{mode === "add" ? "Nouveau QR" : "Modifier le QR"}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950" id="table-form-title">{mode === "add" ? "Ajouter une table" : "Modifier une table"}</h2>
          </div>
          <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button">
            <span className="sr-only">Fermer</span>
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-black text-slate-700">Nom de la table</span>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onChange={(event) => setName(event.target.value)} placeholder="Ex. Table 12" value={name} />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">Zone</span>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onChange={(event) => setZone(event.target.value)} placeholder="Ex. Salle, Terrasse, Comptoir" value={zone} />
          </label>

          <fieldset className="rounded-2xl border border-slate-200 p-4">
            <legend className="px-2 text-sm font-black text-slate-700">Statut</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 ${isActive ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                <input checked={isActive} className="h-4 w-4 accent-emerald-600" name="status" onChange={() => setIsActive(true)} type="radio" />
                <span className="text-sm font-black text-slate-800">Actif</span>
              </label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 ${!isActive ? "border-slate-300 bg-slate-100" : "border-slate-200 bg-white"}`}>
                <input checked={!isActive} className="h-4 w-4 accent-slate-700" name="status" onChange={() => setIsActive(false)} type="radio" />
                <span className="text-sm font-black text-slate-800">Inactif</span>
              </label>
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50" onClick={onClose} type="button">Annuler</button>
          <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700" type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
