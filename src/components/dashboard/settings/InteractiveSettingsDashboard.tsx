"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DashboardHeader } from "@/components/dashboard";
import {
  defaultRestaurantSettings,
  getLocalRestaurantSettings,
  resetLocalRestaurantSettings,
  saveLocalRestaurantSettings,
  type RestaurantSettings,
} from "@/lib/localRestaurantSettings";

type ToastMessage = string | null;
type FieldName = keyof RestaurantSettings;
type Zone = RestaurantSettings["zones"][number];
type OpeningHour = RestaurantSettings["hours"][number];

const serviceStatuses: RestaurantSettings["serviceStatus"][] = ["Ouvert", "En pause", "Fermé"];
const serviceModes: RestaurantSettings["serviceMode"][] = ["Service midi", "Service soir", "Toute la journée"];
const qrStyles: RestaurantSettings["qrStyle"][] = ["Classique", "Premium", "Minimal"];
const primaryColors: RestaurantSettings["primaryColor"][] = ["Émeraude", "Noir premium", "Sable", "Bleu nuit"];

const colorPreview: Record<RestaurantSettings["primaryColor"], string> = {
  Émeraude: "from-emerald-700 to-emerald-500 text-white",
  "Noir premium": "from-slate-950 to-slate-700 text-white",
  Sable: "from-amber-200 to-stone-100 text-slate-950",
  "Bleu nuit": "from-slate-900 to-blue-900 text-white",
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSlug(value: string) {
  return createSlug(value);
}

function SettingsToast({ message }: { message: ToastMessage }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm font-bold text-emerald-900 shadow-2xl shadow-emerald-950/15" role="status">
      {message}
    </div>
  );
}

function SettingsCard({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 md:p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function SelectPill<T extends string>({ value, options, onChange, label }: { value: T; options: T[]; onChange: (value: T) => void; label: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-800">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-4 py-2 text-sm font-black transition ${value === option ? "border-emerald-700 bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ label, helper, checked, onChange }: { label: string; helper?: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/70"
      aria-pressed={checked}
    >
      <span>
        <span className="block text-sm font-black text-slate-900">{label}</span>
        {helper ? <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{helper}</span> : null}
      </span>
      <span className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${checked ? "bg-emerald-700" : "bg-slate-300"}`}>
        <span className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

function SettingsSummaryCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 truncate text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-500">{helper}</p>
    </article>
  );
}

function SettingsPreviewPanel({ settings, previewRef }: { settings: RestaurantSettings; previewRef: React.RefObject<HTMLElement | null> }) {
  const enabledZones = settings.zones.filter((zone) => zone.enabled);

  return (
    <aside ref={previewRef} tabIndex={-1} className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/10 outline-none lg:sticky lg:top-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Aperçu public</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Aperçu client</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Voici ce que le client comprendra.</p>

      <div className={`mt-5 rounded-[1.75rem] bg-gradient-to-br p-5 ${colorPreview[settings.primaryColor]}`}>
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-75">TableFlash</p>
        <h3 className="mt-3 text-2xl font-black">{settings.restaurantName}</h3>
        <p className="mt-2 break-all text-sm font-bold opacity-85">/r/{settings.publicSlug}/table/table-1</p>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Service</p>
          <p className="mt-2 text-lg font-black text-slate-950">{settings.serviceStatus}</p>
          <p className="text-sm font-semibold text-slate-500">{settings.serviceMode}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold leading-6 text-slate-900">{settings.publicWelcomeMessage}</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{settings.paymentMessage}</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{settings.qrInstruction}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-black text-slate-900">Zones actives</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {enabledZones.map((zone) => (
              <span key={zone.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{zone.name}</span>
            ))}
            {enabledZones.length === 0 ? <span className="text-sm font-semibold text-slate-500">Aucune zone active</span> : null}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
          {settings.allowReviewsAfterMeal ? "Avis après repas activés" : "Avis après repas désactivés"}
          {settings.suggestGoogleForPositiveReviews ? <span className="mt-1 block text-emerald-700">Lien Google Avis prêt</span> : null}
        </div>
      </div>
    </aside>
  );
}

export function InteractiveSettingsDashboard() {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultRestaurantSettings);
  const [toast, setToast] = useState<ToastMessage>(null);
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSettings(getLocalRestaurantSettings());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const enabledZones = settings.zones.filter((zone) => zone.enabled);
  const summaryItems = useMemo(() => [
    { label: "Service", value: settings.serviceStatus, helper: settings.serviceMode },
    { label: "Restaurant", value: settings.restaurantName, helper: settings.publicSlug },
    { label: "Zones actives", value: String(enabledZones.length), helper: enabledZones.map((zone) => zone.name).join(", ") || "Aucune zone active" },
    { label: "QR", value: settings.qrStyle, helper: "Instruction configurée" },
    { label: "Avis", value: settings.allowReviewsAfterMeal ? "Activés" : "Désactivés", helper: "Après repas terminé" },
    { label: "Commandes", value: settings.showPreparationTracking ? "Suivi activé" : "Suivi désactivé", helper: "Préparation client" },
  ], [enabledZones, settings]);

  const updateSetting = <K extends FieldName>(field: K, value: RestaurantSettings[K]) => {
    setSettings((currentSettings) => ({ ...currentSettings, [field]: value }));
  };

  const updateZone = (zoneId: string, patch: Partial<Zone>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: currentSettings.zones.map((zone) => (zone.id === zoneId ? { ...zone, ...patch } : zone)),
    }));
  };

  const updateHour = (day: string, patch: Partial<OpeningHour>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      hours: currentSettings.hours.map((hour) => (hour.day === day ? { ...hour, ...patch } : hour)),
    }));
  };

  const showToast = (message: string) => setToast(message);

  const saveSettings = () => {
    saveLocalRestaurantSettings(settings);
    showToast("Paramètres enregistrés localement.");
  };

  const previewSettings = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    previewRef.current?.focus({ preventScroll: true });
  };

  const resetSettings = () => {
    if (!window.confirm("Voulez-vous vraiment réinitialiser les paramètres de cette maquette ?")) return;
    const resetSettingsValue = resetLocalRestaurantSettings();
    setSettings(resetSettingsValue);
    showToast("Paramètres réinitialisés.");
  };

  const generateSlug = () => {
    updateSetting("publicSlug", createSlug(settings.restaurantName) || defaultRestaurantSettings.publicSlug);
    showToast("Slug généré.");
  };

  const addZone = () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: [...currentSettings.zones, { id: `zone-${Date.now()}`, name: "Nouvelle zone", enabled: true }],
    }));
    showToast("Zone ajoutée.");
  };

  const removeZone = (zoneId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette zone de la maquette ?")) return;
    setSettings((currentSettings) => ({ ...currentSettings, zones: currentSettings.zones.filter((zone) => zone.id !== zoneId) }));
    showToast("Zone supprimée.");
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Paramètres"
        subtitle="Configurez votre établissement, vos QR, vos commandes et l’expérience client."
      >
        <button type="button" onClick={saveSettings} className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800">Enregistrer</button>
        <button type="button" onClick={previewSettings} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">Prévisualiser</button>
        <button type="button" onClick={resetSettings} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100">Réinitialiser</button>
      </DashboardHeader>

      <main className="flex-1 overflow-x-hidden bg-slate-50/70 p-5 lg:p-8">
        <div className="grid min-w-0 max-w-[1500px] gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 space-y-6">
            <section>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">A. Résumé configuration</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {summaryItems.map((item) => <SettingsSummaryCard key={item.label} {...item} />)}
              </div>
            </section>

            <SettingsCard eyebrow="B. Identité établissement" title="Informations principales" description="Centralisez les informations qui serviront ensuite aux liens publics, aux QR et aux documents du restaurant.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Nom du restaurant" value={settings.restaurantName} onChange={(value) => updateSetting("restaurantName", value)} />
                <TextField label="Raison sociale" value={settings.legalName ?? ""} onChange={(value) => updateSetting("legalName", value)} />
                <div>
                  <TextField label="Slug public" value={settings.publicSlug} onChange={(value) => updateSetting("publicSlug", normalizeSlug(value))} />
                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">Ce slug servira plus tard pour les liens publics et les QR.</p>
                </div>
                <TextField label="Site web" value={settings.website ?? ""} onChange={(value) => updateSetting("website", value)} placeholder="https://" />
              </div>
              <button type="button" onClick={generateSlug} className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">Générer le slug</button>
            </SettingsCard>

            <SettingsCard eyebrow="C. Contact & adresse" title="Coordonnées client" description="Ces informations permettent de présenter clairement l’établissement sur les supports publics.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Adresse" value={settings.address} onChange={(value) => updateSetting("address", value)} />
                <TextField label="Ville" value={settings.city} onChange={(value) => updateSetting("city", value)} />
                <TextField label="Code postal" value={settings.postalCode} onChange={(value) => updateSetting("postalCode", value)} />
                <TextField label="Téléphone" value={settings.phone} onChange={(value) => updateSetting("phone", value)} />
                <TextField label="Email" value={settings.email} onChange={(value) => updateSetting("email", value)} type="email" />
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="D. Horaires & service" title="Disponibilité de commande" description="Ces horaires seront utilisés plus tard pour ouvrir ou fermer automatiquement la commande à table.">
              <div className="grid gap-5 lg:grid-cols-2">
                <SelectPill label="Statut du service" value={settings.serviceStatus} options={serviceStatuses} onChange={(value) => updateSetting("serviceStatus", value)} />
                <SelectPill label="Mode de service" value={settings.serviceMode} options={serviceModes} onChange={(value) => updateSetting("serviceMode", value)} />
              </div>
              <div className="mt-6 space-y-3">
                {settings.hours.map((hour) => (
                  <div key={hour.day} className={`grid gap-3 rounded-2xl border p-3 transition md:grid-cols-[120px_120px_1fr_1fr] md:items-center ${hour.open ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-100/80 opacity-70"}`}>
                    <ToggleRow label={hour.day} checked={hour.open} onChange={(checked) => updateHour(hour.day, { open: checked })} />
                    <p className="text-sm font-black text-slate-700">{hour.open ? "Ouvert" : "Fermé"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <TextField label="Début midi" value={hour.lunchStart} onChange={(value) => updateHour(hour.day, { lunchStart: value })} type="time" />
                      <TextField label="Fin midi" value={hour.lunchEnd} onChange={(value) => updateHour(hour.day, { lunchEnd: value })} type="time" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <TextField label="Début soir" value={hour.dinnerStart} onChange={(value) => updateHour(hour.day, { dinnerStart: value })} type="time" />
                      <TextField label="Fin soir" value={hour.dinnerEnd} onChange={(value) => updateHour(hour.day, { dinnerEnd: value })} type="time" />
                    </div>
                  </div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="E. Règlement" title="Message de paiement physique" description="TableFlash ne déclenche aucun paiement en ligne dans ce MVP. Le règlement reste physique.">
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <TextAreaField label="Message de règlement" value={settings.paymentMessage} onChange={(value) => updateSetting("paymentMessage", value)} />
                <ToggleRow label="Exiger le règlement avant préparation" helper="Le client comprend que le paiement se fait avant lancement en cuisine." checked={settings.requirePaymentBeforePreparation} onChange={(checked) => updateSetting("requirePaymentBeforePreparation", checked)} />
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="F. Zones / emplacements" title="Organisation du restaurant" description="Préparez vos zones pour les futures tables et fiches QR.">
              <div className="space-y-3">
                {settings.zones.map((zone) => (
                  <div key={zone.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_190px_120px] md:items-end">
                    <TextField label="Nom de zone" value={zone.name} onChange={(value) => updateZone(zone.id, { name: value })} />
                    <ToggleRow label="Zone active" checked={zone.enabled} onChange={(checked) => updateZone(zone.id, { enabled: checked })} />
                    <button type="button" disabled={settings.zones.length <= 1} onClick={() => removeZone(zone.id)} className="rounded-full border border-rose-200 bg-white px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">Supprimer</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addZone} className="mt-4 rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800">Ajouter une zone</button>
            </SettingsCard>

            <SettingsCard eyebrow="G. QR par table" title="Préférences QR" description="Configurez la fiche que vos clients verront à table, sans modifier encore les QR existants.">
              <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                <div className="space-y-5">
                  <SelectPill label="Style QR" value={settings.qrStyle} options={qrStyles} onChange={(value) => updateSetting("qrStyle", value)} />
                  <TextAreaField label="Instruction QR" value={settings.qrInstruction} onChange={(value) => updateSetting("qrInstruction", value)} />
                  <ToggleRow label="Afficher le nom de l’emplacement sur la fiche QR" checked={settings.qrShowLocationName} onChange={(checked) => updateSetting("qrShowLocationName", checked)} />
                  <ToggleRow label="Afficher le lien public sous le QR" checked={settings.qrShowPublicLink} onChange={(checked) => updateSetting("qrShowPublicLink", checked)} />
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Votre QR</p>
                  <div className="mx-auto mt-4 grid h-32 w-32 place-items-center rounded-3xl bg-[linear-gradient(135deg,#0f172a_25%,transparent_25%),linear-gradient(225deg,#0f172a_25%,transparent_25%),linear-gradient(45deg,#0f172a_25%,transparent_25%),linear-gradient(315deg,#0f172a_25%,#f8fafc_25%)] bg-[length:28px_28px] bg-[position:14px_0,14px_0,0_0,0_0]">
                    <span className="rounded-xl bg-white px-2 py-1 text-xs font-black text-emerald-700">TF</span>
                  </div>
                  <p className="mt-4 text-lg font-black text-slate-950">Table 1</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">{settings.qrInstruction}</p>
                  <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{settings.qrStyle}</span>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="H. Commandes" title="Préférences de traitement" description="Gardez la maîtrise opérationnelle du service et de la communication client.">
              <div className="grid gap-3 md:grid-cols-2">
                <ToggleRow label="Accepter automatiquement les commandes" helper="Désactivé par défaut pour garder une validation manuelle." checked={settings.orderAutoAccept} onChange={(checked) => updateSetting("orderAutoAccept", checked)} />
                <ToggleRow label="Autoriser les notes clients" helper="Permet d’ajouter allergies, cuisson ou demande spéciale." checked={settings.allowCustomerNotes} onChange={(checked) => updateSetting("allowCustomerNotes", checked)} />
                <ToggleRow label="Afficher le suivi de préparation au client" helper="Le client voit l’avancement après validation." checked={settings.showPreparationTracking} onChange={(checked) => updateSetting("showPreparationTracking", checked)} />
                <ToggleRow label="Exiger le règlement avant préparation" helper="Même option que dans la section règlement." checked={settings.requirePaymentBeforePreparation} onChange={(checked) => updateSetting("requirePaymentBeforePreparation", checked)} />
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="I. Avis clients" title="Avis après repas" description="Préparez le parcours d’avis sans appel à Google ni automatisation externe.">
              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <ToggleRow label="Autoriser les avis après repas" checked={settings.allowReviewsAfterMeal} onChange={(checked) => updateSetting("allowReviewsAfterMeal", checked)} />
                  <ToggleRow label="Suggérer Google pour les avis positifs" checked={settings.suggestGoogleForPositiveReviews} onChange={(checked) => updateSetting("suggestGoogleForPositiveReviews", checked)} />
                  <TextField label="Lien Google Avis" value={settings.googleReviewUrl} onChange={(value) => updateSetting("googleReviewUrl", value)} />
                </div>
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                  <button type="button" onClick={() => showToast("Lien Google Avis copié dans la maquette.")} className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">Copier le lien Google Avis</button>
                  <button type="button" onClick={() => showToast("Ouverture Google Avis simulée dans la maquette.")} className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">Tester le lien</button>
                  <p className="text-xs font-semibold leading-5 text-slate-500">Le bouton teste uniquement le parcours dans cette interface.</p>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="J. Apparence" title="Signature visuelle" description="Choisissez une intention graphique pour l’aperçu local de l’expérience client.">
              <SelectPill label="Couleur principale" value={settings.primaryColor} options={primaryColors} onChange={(value) => updateSetting("primaryColor", value)} />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {primaryColors.map((color) => (
                  <button key={color} type="button" onClick={() => updateSetting("primaryColor", color)} className={`rounded-2xl bg-gradient-to-br p-4 text-left font-black shadow-sm ${colorPreview[color]} ${settings.primaryColor === color ? "ring-4 ring-emerald-200" : ""}`}>{color}</button>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="K. Message public client" title="Textes visibles par le client" description="Ajustez les messages courts qui rassurent le client avant de commander.">
              <div className="grid gap-4 lg:grid-cols-3">
                <TextAreaField label="Message d’accueil public" value={settings.publicWelcomeMessage} onChange={(value) => updateSetting("publicWelcomeMessage", value)} />
                <TextAreaField label="Message de règlement" value={settings.paymentMessage} onChange={(value) => updateSetting("paymentMessage", value)} />
                <TextAreaField label="Instruction QR" value={settings.qrInstruction} onChange={(value) => updateSetting("qrInstruction", value)} />
              </div>
            </SettingsCard>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="xl:hidden">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-emerald-700">L. Aperçu public</p>
            </div>
            <SettingsPreviewPanel settings={settings} previewRef={previewRef} />
          </div>
        </div>
      </main>

      <SettingsToast message={toast} />
    </>
  );
}
