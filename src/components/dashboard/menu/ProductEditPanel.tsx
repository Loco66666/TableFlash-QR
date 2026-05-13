"use client";

import { useRef } from "react";

import { ProductImage, productVisualPresets, resolveProductVisualPreset, type ProductVisualPresetId } from "@/components/shared/ProductImage";
import { formatPromotionValue } from "@/lib/formatters";

import type { ProductDraft, ProductItem } from "./menuData";

type ProductEditPanelProps = {
  product: ProductItem | null;
  draft: ProductDraft | null;
  categories: Array<{ id: string; name: string }>;
  onDraftChange: (draft: ProductDraft) => void;
  onCancel: () => void;
  onNormalizePrice: () => void;
  onSave: () => void;
};

export function ProductEditPanel({ product, draft, categories, onDraftChange, onCancel, onNormalizePrice, onSave }: ProductEditPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product || !draft) {
    return (
      <aside className="isolate rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Produit sélectionné</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Édition du produit</h2>
        <p className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-500">Sélectionnez un produit pour modifier ses informations dans la maquette.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <button className="cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-300 opacity-60" disabled type="button">Annuler</button>
          <button className="cursor-not-allowed rounded-2xl bg-slate-200 px-4 py-3 text-sm font-black text-white opacity-60" disabled type="button">Enregistrer</button>
        </div>
      </aside>
    );
  }

  const updateDraft = (patch: Partial<ProductDraft>) => onDraftChange({ ...draft, ...patch });

  const handlePhotoChange = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateDraft({ imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const selectedPreset = resolveProductVisualPreset({
    categoryName: categories.find((category) => category.id === draft.categoryId)?.name ?? draft.categoryId,
    productName: draft.name || product.name,
    visualPreset: draft.visualPreset,
  });

  const handlePromoTypeChange = (promoType: ProductDraft["promoType"]) => {
    updateDraft({
      promoType,
      promoValue: draft.promoValue ? formatPromotionValue(draft.promoValue, promoType) : draft.promoValue,
    });
  };

  return (
    <aside className="isolate rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Produit sélectionné</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Édition du produit</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Local</span>
      </div>

      <div className="mt-6 space-y-5">
        <Field label="Nom du produit" value={draft.name} onChange={(value) => updateDraft({ name: value })} />
        <label className="block">
          <span className="text-sm font-black text-slate-700">Catégorie</span>
          <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none" onChange={(event) => updateDraft({ categoryId: event.target.value })} value={draft.categoryId}>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <Field label="Description" value={draft.description} onChange={(value) => updateDraft({ description: value })} multiline />
        <Field label="Prix" value={draft.price} onBlur={onNormalizePrice} onChange={(value) => updateDraft({ price: value })} />
        <Field label="Allergènes" value={draft.allergens.join(", ")} onChange={(value) => updateDraft({ allergens: value.split(",").map((allergen) => allergen.trim()).filter(Boolean) })} helper="Séparez les allergènes par des virgules." />

        <ToggleRow label="Disponible" checked={draft.available} onChange={() => updateDraft({ available: !draft.available })} />

        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-700">Visuel produit</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">Les vraies photos pourront être reliées plus tard au stockage Supabase. Pour l’instant, TableFlash utilise un visuel premium local.</p>
            </div>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700">{selectedPreset.label}</span>
          </div>

          <div className="mt-4">
            <ProductImage
              categoryName={categories.find((category) => category.id === draft.categoryId)?.name ?? draft.categoryId}
              imageAlt={draft.imageAlt}
              imageTone={product.imageTone}
              imageUrl={draft.imageUrl}
              productName={draft.name || product.name}
              variant="modal"
              visualPreset={draft.visualPreset}
            />
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-black text-slate-700">Type de visuel</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" onChange={(event) => updateDraft({ visualPreset: event.target.value as ProductVisualPresetId })} value={draft.visualPreset ?? "auto"}>
              {productVisualPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>{preset.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-semibold text-slate-500">{selectedPreset.helper}</span>
          </label>

          <Field label="Texte alternatif" value={draft.imageAlt ?? ""} onChange={(value) => updateDraft({ imageAlt: value })} helper="Décrit le visuel pour l’accessibilité." />

          <input
            accept="image/*"
            className="hidden"
            onChange={(event) => handlePhotoChange(event.target.files?.[0])}
            ref={fileInputRef}
            type="file"
          />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15" onClick={() => fileInputRef.current?.click()} type="button">Changer l’aperçu</button>
            <button className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!draft.imageUrl} onClick={() => updateDraft({ imageUrl: null })} type="button">Supprimer</button>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4">
          <ToggleRow label="Promotion" checked={draft.promo} onChange={() => updateDraft({ promo: !draft.promo })} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-slate-700">Type de promotion</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none" onChange={(event) => handlePromoTypeChange(event.target.value as ProductDraft["promoType"])} value={draft.promoType}>
                <option>Pourcentage</option>
                <option>Montant fixe</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Valeur</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                onBlur={() => updateDraft({ promoValue: formatPromotionValue(draft.promoValue, draft.promoType) })}
                onChange={(event) => updateDraft({ promoValue: event.target.value })}
                value={draft.promoValue}
              />
            </label>
          </div>
          <div className="mt-3">
            <Field label="Fin de la promotion" value={draft.promoEndDate} onChange={(value) => updateDraft({ promoEndDate: value })} compact type="date" />
          </div>
        </div>

        <div className="sticky bottom-0 z-30 -mx-5 grid grid-cols-2 gap-3 border-t border-slate-100 bg-white/95 px-5 pb-1 pt-4 backdrop-blur lg:-mx-6 lg:px-6">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={!product} onClick={onCancel} type="button">Annuler</button>
          <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={!product} onClick={onSave} type="button">Enregistrer</button>
        </div>
      </div>
    </aside>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  multiline?: boolean;
  compact?: boolean;
  helper?: string;
  type?: string;
};

function Field({ label, value, onChange, onBlur, multiline = false, compact = false, helper, type = "text" }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      {multiline ? (
        <textarea className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className={`mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 ${compact ? "py-2.5" : "py-3"} text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100`} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} type={type} value={value} />
      )}
      {helper ? <span className="mt-1 block text-xs font-semibold text-slate-400">{helper}</span> : null}
    </label>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <button aria-pressed={checked} className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "justify-end bg-emerald-700" : "justify-start bg-slate-200"}`} onClick={onChange} type="button">
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}
