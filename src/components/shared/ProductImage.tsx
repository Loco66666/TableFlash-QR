"use client";

import { useMemo, useState } from "react";

export type ProductVisualPresetId =
  | "auto"
  | "main"
  | "starter"
  | "side"
  | "dessert"
  | "drink"
  | "hotDrink"
  | "menu"
  | "signature"
  | "premium";

export type ProductVisualPreset = {
  id: ProductVisualPresetId;
  label: string;
  emoji: string;
  tone: string;
  helper: string;
};

export const productVisualPresets: ProductVisualPreset[] = [
  { id: "auto", label: "Automatique", emoji: "✦", tone: "from-emerald-100 via-stone-100 to-amber-100", helper: "Utilise la catégorie du produit." },
  { id: "main", label: "Plat principal", emoji: "◐", tone: "from-amber-200 via-orange-100 to-emerald-100", helper: "Pour assiettes, plats chauds, spécialités." },
  { id: "starter", label: "Entrée", emoji: "◒", tone: "from-lime-200 via-emerald-100 to-stone-100", helper: "Pour entrées, tapas, petites assiettes." },
  { id: "side", label: "Accompagnement", emoji: "◓", tone: "from-yellow-200 via-amber-100 to-orange-100", helper: "Pour frites, légumes, garnitures." },
  { id: "dessert", label: "Dessert", emoji: "◇", tone: "from-stone-300 via-amber-100 to-yellow-50", helper: "Pour desserts et douceurs." },
  { id: "drink", label: "Boisson", emoji: "◌", tone: "from-cyan-100 via-lime-100 to-emerald-100", helper: "Pour boissons fraîches, eaux, jus." },
  { id: "hotDrink", label: "Boisson chaude", emoji: "◍", tone: "from-stone-300 via-zinc-100 to-slate-100", helper: "Pour cafés, thés, chocolats." },
  { id: "menu", label: "Menu / formule", emoji: "▣", tone: "from-emerald-200 via-amber-100 to-stone-100", helper: "Pour menus complets ou offres groupées." },
  { id: "signature", label: "Signature", emoji: "✧", tone: "from-emerald-200 via-teal-100 to-amber-100", helper: "Pour les produits mis en avant." },
  { id: "premium", label: "Générique premium", emoji: "✦", tone: "from-emerald-100 via-stone-100 to-amber-100", helper: "Visuel neutre élégant." },
];

const presetsById = productVisualPresets.reduce<Record<ProductVisualPresetId, ProductVisualPreset>>((presets, preset) => {
  presets[preset.id] = preset;
  return presets;
}, {} as Record<ProductVisualPresetId, ProductVisualPreset>);

export type ProductImageVariant = "dashboard" | "public-card" | "modal" | "compact" | "edit-preview";

type ProductImageProps = {
  productName: string;
  categoryName?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  visualPreset?: ProductVisualPresetId | null;
  imageTone?: string | null;
  variant?: ProductImageVariant;
  className?: string;
  decorative?: boolean;
};

const variantClassNames: Record<ProductImageVariant, string> = {
  dashboard: "h-14 w-14 rounded-2xl",
  "public-card": "aspect-square h-[5.5rem] w-[5.5rem] rounded-2xl",
  modal: "h-[220px] max-h-[34vh] w-full rounded-[1.75rem]",
  compact: "h-16 w-16 rounded-2xl",
  "edit-preview": "h-[180px] max-h-[220px] w-full rounded-2xl sm:h-[200px]",
};

const textMarkerClassNames: Record<ProductImageVariant, string> = {
  dashboard: "text-sm",
  "public-card": "text-lg",
  modal: "text-2xl",
  compact: "text-base",
  "edit-preview": "text-2xl",
};

export function inferProductVisualPreset(input: { categoryName?: string | null; productName?: string | null }): Exclude<ProductVisualPresetId, "auto"> {
  const normalized = `${input.categoryName ?? ""} ${input.productName ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR");

  if (/boissons?|sodas?|jus|eaux?|limonade|sirop|mocktail|cocktail|biere|vin/.test(normalized)) return "drink";
  if (/cafes?|cafe|the|chai|infusion|chocolat chaud|espresso|capuccino|cappuccino/.test(normalized)) return "hotDrink";
  if (/desserts?|douceurs?|patisserie|gateau|tiramisu|creme|glace|sorbet/.test(normalized)) return "dessert";
  if (/menus?|formules?|offres? groupees?|combo|plateau/.test(normalized)) return "menu";
  if (/entrees?|tapas|petites? assiettes?|aperitif|antipasti/.test(normalized)) return "starter";
  if (/accompagnements?|garnitures?|frites?|legumes|riz|pommes? de terre/.test(normalized)) return "side";
  if (/plats?|principal|specialites?|pizzas?|sushis?|tacos|brasserie|grillades?/.test(normalized)) return "main";

  return "premium";
}

export function resolveProductVisualPreset(input: {
  visualPreset?: ProductVisualPresetId | null;
  categoryName?: string | null;
  productName?: string | null;
}) {
  const presetId = input.visualPreset && input.visualPreset !== "auto" ? input.visualPreset : inferProductVisualPreset({ categoryName: input.categoryName, productName: input.productName });

  return presetsById[presetId] ?? presetsById.premium;
}

export function ProductImage({ productName, categoryName, imageUrl, imageAlt, visualPreset, imageTone, variant = "public-card", className = "", decorative = false }: ProductImageProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const preset = useMemo(() => resolveProductVisualPreset({ visualPreset, categoryName, productName }), [categoryName, productName, visualPreset]);
  const normalizedImageUrl = imageUrl?.trim() || null;
  const shouldShowImage = Boolean(normalizedImageUrl) && failedImageUrl !== normalizedImageUrl;
  const imageFitClassName = variant === "edit-preview" || variant === "modal" ? "object-contain p-2" : "object-cover";
  const alt = imageAlt?.trim() || `Visuel de ${productName}`;

  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-gradient-to-br ${imageTone || preset.tone} ${variantClassNames[variant]} ${className}`}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
    >
      {shouldShowImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={decorative ? "" : alt} className={`absolute inset-0 h-full w-full ${imageFitClassName} object-center`} onError={() => setFailedImageUrl(normalizedImageUrl)} src={normalizedImageUrl ?? undefined} />
      ) : (
        <>
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.78),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(6,95,70,0.18),transparent_32%)]" />
          <span className="absolute inset-x-3 top-3 h-px bg-white/60" />
          <span className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-emerald-900/85 shadow-lg shadow-emerald-950/20" />
          <span className="absolute left-3 top-3 h-8 w-8 rounded-2xl border border-white/60 bg-white/55 shadow-sm" />
          <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-emerald-950/75 ${textMarkerClassNames[variant]}`}>{preset.emoji}</span>
        </>
      )}
    </span>
  );
}
