"use client";

import { useRef } from "react";

import { ProductImage, productVisualPresets, resolveProductVisualPreset, type ProductVisualPresetId } from "@/components/shared/ProductImage";
import { formatEuro, formatPromotionValue } from "@/lib/formatters";

import type { ProductDraft, ProductItem } from "./menuData";

type ProductEditPanelProps = {
  product: ProductItem | null;
  draft: ProductDraft | null;
  categories: Array<{ id: string; name: string }>;
  onDraftChange: (draft: ProductDraft) => void;
  onCancel: () => void;
  onNormalizePrice: () => void;
  onSave: () => void;
  hydrationReady?: boolean;
};

export function ProductEditPanel({ product, draft, categories, onDraftChange, onCancel, onNormalizePrice, onSave, hydrationReady = true }: ProductEditPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product || !draft) {
    return (
      <aside className="isolate rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Produit sélectionné</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Édition du produit</h2>
        <p className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-500">Sélectionnez un produit pour modifier sa fiche menu.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <button className="cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-300 opacity-60" disabled type="button">Annuler</button>
          <button className="cursor-not-allowed rounded-2xl bg-slate-200 px-4 py-3 text-sm font-black text-white opacity-60" disabled type="button">Enregistrer</button>
        </div>
      </aside>
    );
  }

  const updateDraft = (patch: Partial<ProductDraft>) => onDraftChange({ ...draft, ...patch });
  const selectedCategoryName = categories.find((category) => category.id === draft.categoryId)?.name ?? draft.categoryId;

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

  const shouldShowImageControls = hydrationReady && Boolean(draft.imageUrl);

  const selectedPreset = resolveProductVisualPreset({
    categoryName: selectedCategoryName,
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
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Menu</span>
      </div>

      <div className="mt-6 space-y-4">
        <EditorSection title="Informations essentielles" description="Les informations lues en premier par vos clients.">
          <Field label="Nom du produit" value={draft.name} onChange={(value) => updateDraft({ name: value })} />
          <label className="block">
            <span className="text-sm font-black text-slate-700">Catégorie</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onChange={(event) => updateDraft({ categoryId: event.target.value })} value={draft.categoryId}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <Field label="Description" value={draft.description} onChange={(value) => updateDraft({ description: value })} multiline />
          <Field label="Prix" value={draft.price} onBlur={onNormalizePrice} onChange={(value) => updateDraft({ price: value })} />
        </EditorSection>

        <EditorSection title="Disponibilité">
          <ToggleRow label="Produit disponible" checked={draft.available} helper={draft.available ? "Ce produit peut être commandé." : "Ce produit reste affiché avec une mention de rupture."} onChange={() => updateDraft({ available: !draft.available })} />
        </EditorSection>

        <EditorSection title="Photo produit" description="Ajoutez une photo ou laissez TableFlash afficher un visuel automatique.">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-slate-700">Aperçu</p>
            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{selectedPreset.label}</span>
          </div>

          <div className="mt-3 rounded-[1.75rem] border border-emerald-100 bg-emerald-50/50 p-2 shadow-inner shadow-emerald-900/5">
            <ProductImage
              categoryName={selectedCategoryName}
              imageAlt={draft.imageAlt}
              imageTone={product.imageTone}
              imageUrl={draft.imageUrl}
              productName={draft.name || product.name}
              variant="edit-preview"
              visualPreset={draft.visualPreset}
              hydrationReady={hydrationReady}
            />
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-black text-slate-700">Famille visuelle</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" onChange={(event) => updateDraft({ visualPreset: event.target.value as ProductVisualPresetId })} value={draft.visualPreset ?? "auto"}>
              {productVisualPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>{preset.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-semibold text-slate-500">{selectedPreset.helper}</span>
          </label>

          <Field label="Texte alternatif" value={draft.imageAlt ?? ""} onChange={(value) => updateDraft({ imageAlt: value })} helper="Décrit la photo pour l’accessibilité." />

          <input
            accept="image/*"
            className="hidden"
            onChange={(event) => handlePhotoChange(event.target.files?.[0])}
            ref={fileInputRef}
            type="file"
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800" onClick={() => fileInputRef.current?.click()} type="button">Changer la photo</button>
            {shouldShowImageControls ? (
              <button className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100" onClick={() => updateDraft({ imageUrl: null, visualPreset: "auto" })} type="button">Supprimer l’image</button>
            ) : (
              <button className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-50" onClick={() => updateDraft({ visualPreset: "auto" })} type="button">Visuel automatique</button>
            )}
          </div>
        </EditorSection>

        <EditorSection title="Options client">
          <Field label="Allergènes" value={draft.allergens.join(", ")} onChange={(value) => updateDraft({ allergens: value.split(",").map((allergen) => allergen.trim()).filter(Boolean) })} helper="Séparez les allergènes par des virgules." />
          <ToggleRow label="Produit visible" checked={draft.visible} helper={draft.visible ? "Le produit apparaît sur le menu client." : "Le produit est masqué du menu client."} onChange={() => updateDraft({ visible: !draft.visible })} />
        </EditorSection>

        <EditorSection title="Options commerciales">
          <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4">
            <ToggleRow label="Promotion active" checked={draft.promo} helper={draft.promo ? "Configurez l’offre affichée aux clients." : "Activez seulement si une offre doit être affichée."} onChange={() => updateDraft({ promo: !draft.promo })} />
            {draft.promo ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-black text-slate-700">Type de promotion</span>
                  <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" onChange={(event) => handlePromoTypeChange(event.target.value as ProductDraft["promoType"])} value={draft.promoType}>
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
                <div className="sm:col-span-2 xl:col-span-1 2xl:col-span-2">
                  <Field label="Date de fin" value={draft.promoEndDate} onChange={(value) => updateDraft({ promoEndDate: value })} compact type="date" />
                </div>
              </div>
            ) : null}
          </div>
        </EditorSection>

        <EditorSection title="Aperçu client" description="Vue compacte de la fiche produit sur le menu public.">
          <ClientProductPreview draft={draft} product={product} categoryName={selectedCategoryName} hydrationReady={hydrationReady} />
        </EditorSection>

        <div className="sticky bottom-0 z-30 -mx-5 grid grid-cols-2 gap-3 border-t border-slate-100 bg-white/95 px-5 pb-1 pt-4 backdrop-blur lg:-mx-6 lg:px-6">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={!product} onClick={onCancel} type="button">Annuler</button>
          <button className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={!product} onClick={onSave} type="button">Enregistrer</button>
        </div>
      </div>
    </aside>
  );
}

function EditorSection({ children, description, title }: { children: React.ReactNode; description?: string; title: string }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
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
        <textarea className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className={`mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 ${compact ? "py-2.5" : "py-3"} text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100`} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} type={type} value={value} />
      )}
      {helper ? <span className="mt-1 block text-xs font-semibold text-slate-400">{helper}</span> : null}
    </label>
  );
}

function ToggleRow({ label, checked, helper, onChange }: { label: string; checked: boolean; helper?: string; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-700">{label}</span>
        {helper ? <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{helper}</span> : null}
      </span>
      <button aria-pressed={checked} className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${checked ? "justify-end bg-emerald-700" : "justify-start bg-slate-200"}`} onClick={onChange} type="button">
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}

function ClientProductPreview({ draft, product, categoryName, hydrationReady }: { draft: ProductDraft; product: ProductItem; categoryName: string; hydrationReady: boolean }) {
  return (
    <article className={`flex gap-3 rounded-3xl bg-white p-3 shadow-sm shadow-slate-200/70 ${draft.available ? "" : "opacity-60"}`}>
      <ProductImage
        categoryName={categoryName}
        decorative
        imageAlt={draft.imageAlt}
        imageTone={product.imageTone}
        imageUrl={draft.imageUrl}
        productName={draft.name || product.name}
        variant="compact"
        visualPreset={draft.visualPreset}
        hydrationReady={hydrationReady}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0 font-black text-slate-950">{draft.name || product.name}</span>
          {draft.promo ? <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">{draft.promoValue || "Promo"}</span> : null}
        </span>
        <span className="mt-1 block line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{draft.description || product.description}</span>
        <span className="mt-2 block whitespace-nowrap text-sm font-black text-emerald-700">{formatEuro(draft.price)}</span>
        {!draft.available ? <span className="mt-1 block text-xs font-black text-rose-600">En rupture</span> : null}
        {!draft.visible ? <span className="mt-1 block text-xs font-black text-slate-500">Masqué du menu client</span> : null}
      </span>
    </article>
  );
}
