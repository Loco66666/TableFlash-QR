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
type SaveState = "dirty" | "saved";

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
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full min-w-0 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function SegmentedControl<T extends string>({ value, options, onChange, label }: { value: T; options: T[]; onChange: (value: T) => void; label: string }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-bold text-slate-800">{label}</p>
      <div className="mt-2 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl px-3 py-2.5 text-sm font-black transition ${value === option ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" : "text-slate-600 hover:bg-white hover:text-emerald-700"}`}
          >
            {option.replace("Service ", "")}
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
      className="flex w-full min-w-0 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/70"
      aria-pressed={checked}
    >
      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-900">{label}</span>
        {helper ? <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{helper}</span> : null}
      </span>
      <span className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${checked ? "bg-emerald-700" : "bg-slate-300"}`}>
        <span className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

function OperationalCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="min-w-0 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 break-words text-2xl font-black leading-tight text-slate-950">{value}</p>
      <p className="mt-2 break-words text-sm font-semibold leading-5 text-slate-500">{helper}</p>
    </article>
  );
}

function InlineStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function SettingsPreviewPanel({ settings, previewRef, saveState }: { settings: RestaurantSettings; previewRef: React.RefObject<HTMLElement | null>; saveState: SaveState }) {
  const enabledZones = settings.zones.filter((zone) => zone.enabled);

  return (
    <aside ref={previewRef} tabIndex={-1} className="space-y-4 outline-none lg:sticky lg:top-6">
      <section className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Aperçu client</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Page scannée par QR</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Un aperçu mobile crédible de ce que le client verra à table.</p>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-inner shadow-slate-950/20">
          <div className="rounded-[1.5rem] bg-white p-4">
            <div className={`rounded-[1.25rem] bg-gradient-to-br p-4 ${colorPreview[settings.primaryColor]}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black tracking-[0.14em]">TableFlash</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">Table 1</span>
              </div>
              <h3 className="mt-4 break-words text-2xl font-black">{settings.restaurantName}</h3>
              <p className="mt-2 break-all text-xs font-bold opacity-85">/r/{settings.publicSlug}/table/table-1</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{settings.serviceStatus}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{settings.serviceMode}</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Bienvenue</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-900">{settings.publicWelcomeMessage}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Règlement</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{settings.paymentMessage}</p>
              </div>
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">QR</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-900">{settings.qrInstruction}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Ce que le client verra</p>
        <div className="mt-4 grid gap-3">
          <InlineStatus label="Zones actives" value={enabledZones.map((zone) => zone.name).join(", ") || "Aucune zone active"} />
          <InlineStatus label="Avis" value={settings.allowReviewsAfterMeal ? "Avis demandés après repas" : "Avis désactivés"} />
          <InlineStatus label="État local" value={saveState === "saved" ? "Paramètres enregistrés" : "Modifications locales"} />
        </div>
      </section>
    </aside>
  );
}

export function InteractiveSettingsDashboard() {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultRestaurantSettings);
  const [toast, setToast] = useState<ToastMessage>(null);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSettings(getLocalRestaurantSettings());
      setSaveState("saved");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const enabledZones = settings.zones.filter((zone) => zone.enabled);
  const operationalCards = useMemo(() => [
    { label: "Établissement", value: settings.restaurantName, helper: `/${settings.publicSlug}` },
    { label: "Service", value: settings.serviceStatus, helper: settings.serviceMode },
    { label: "Commande à table", value: settings.serviceStatus === "Ouvert" ? "Active" : "Suspendue", helper: settings.requirePaymentBeforePreparation ? "Règlement avant préparation" : "Validation restaurant avant préparation" },
    { label: "QR & zones", value: `${enabledZones.length} zone${enabledZones.length > 1 ? "s" : ""} active${enabledZones.length > 1 ? "s" : ""}`, helper: "Zones prêtes pour les QR" },
    { label: "Avis clients", value: settings.allowReviewsAfterMeal ? "Activés" : "Désactivés", helper: "Après repas terminé" },
    { label: "Expérience client", value: settings.primaryColor, helper: settings.publicWelcomeMessage ? "Message public configuré" : settings.qrStyle },
  ], [enabledZones.length, settings.allowReviewsAfterMeal, settings.primaryColor, settings.publicSlug, settings.publicWelcomeMessage, settings.requirePaymentBeforePreparation, settings.restaurantName, settings.serviceMode, settings.serviceStatus, settings.qrStyle]);

  const updateSetting = <K extends FieldName>(field: K, value: RestaurantSettings[K]) => {
    setSettings((currentSettings) => ({ ...currentSettings, [field]: value }));
    setSaveState("dirty");
  };

  const updateZone = (zoneId: string, patch: Partial<Zone>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: currentSettings.zones.map((zone) => (zone.id === zoneId ? { ...zone, ...patch } : zone)),
    }));
    setSaveState("dirty");
  };

  const updateHour = (day: string, patch: Partial<OpeningHour>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      hours: currentSettings.hours.map((hour) => (hour.day === day ? { ...hour, ...patch } : hour)),
    }));
    setSaveState("dirty");
  };

  const showToast = (message: string) => setToast(message);

  const saveSettings = () => {
    saveLocalRestaurantSettings(settings);
    setSaveState("saved");
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
    setSaveState("saved");
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
    setSaveState("dirty");
    showToast("Zone ajoutée.");
  };

  const removeZone = (zoneId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette zone de la maquette ?")) return;
    setSettings((currentSettings) => ({ ...currentSettings, zones: currentSettings.zones.filter((zone) => zone.id !== zoneId) }));
    setSaveState("dirty");
    showToast("Zone supprimée.");
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Paramètres"
        subtitle="Pilotez l’identité du restaurant, le service, les QR et l’expérience client depuis un seul espace."
      >
        <button type="button" onClick={saveSettings} className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800">Enregistrer</button>
        <button type="button" onClick={previewSettings} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">Prévisualiser</button>
        <button type="button" onClick={resetSettings} className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50">Réinitialiser</button>
      </DashboardHeader>

      <main className="flex-1 overflow-x-hidden bg-slate-50/70 p-5 lg:p-8">
        <div className="mx-auto grid min-w-0 max-w-[1500px] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <section className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-5 shadow-sm shadow-emerald-950/5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Centre de contrôle de votre restaurant</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {operationalCards.map((item) => <OperationalCard key={item.label} {...item} />)}
              </div>
            </section>

            <SettingsCard eyebrow="Identité commerciale" title="Profil établissement" description="Présentez votre restaurant avec des informations fiables, cohérentes et prêtes pour les liens QR.">
              <div className="grid gap-4 lg:grid-cols-2">
                <TextField label="Nom affiché" value={settings.restaurantName} onChange={(value) => updateSetting("restaurantName", value)} />
                <TextField label="Raison sociale" value={settings.legalName ?? ""} onChange={(value) => updateSetting("legalName", value)} />
                <div className="min-w-0">
                  <TextField label="Slug public" value={settings.publicSlug} onChange={(value) => updateSetting("publicSlug", normalizeSlug(value))} />
                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">Le slug sera utilisé dans les liens QR et les pages publiques.</p>
                </div>
                <TextField label="Site web" value={settings.website ?? ""} onChange={(value) => updateSetting("website", value)} placeholder="https://" />
              </div>
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-all text-sm font-bold text-emerald-900">Lien public : /r/{settings.publicSlug}/table/table-1</p>
                <button type="button" onClick={generateSlug} className="shrink-0 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">Générer depuis le nom</button>
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="Informations publiques" title="Coordonnées publiques" description="Ces informations rassurent le client et préparent les supports publics du restaurant.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Adresse" value={settings.address} onChange={(value) => updateSetting("address", value)} />
                <TextField label="Ville" value={settings.city} onChange={(value) => updateSetting("city", value)} />
                <TextField label="Code postal" value={settings.postalCode} onChange={(value) => updateSetting("postalCode", value)} />
                <TextField label="Téléphone" value={settings.phone} onChange={(value) => updateSetting("phone", value)} />
                <TextField label="Email" value={settings.email} onChange={(value) => updateSetting("email", value)} type="email" />
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="Pilotage du service" title="Service & horaires" description="Ces horaires serviront plus tard à ouvrir ou suspendre automatiquement les commandes QR.">
              <div className="grid gap-5 lg:grid-cols-2">
                <SegmentedControl label="Statut du service" value={settings.serviceStatus} options={serviceStatuses} onChange={(value) => updateSetting("serviceStatus", value)} />
                <SegmentedControl label="Mode de service" value={settings.serviceMode} options={serviceModes} onChange={(value) => updateSetting("serviceMode", value)} />
              </div>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                {settings.hours.map((hour) => (
                  <div key={hour.day} className={`grid gap-4 border-b border-slate-100 p-4 last:border-b-0 lg:grid-cols-[130px_120px_minmax(0,1fr)_minmax(0,1fr)] lg:items-center ${hour.open ? "bg-white" : "bg-slate-50 text-slate-400"}`}>
                    <div>
                      <p className="text-sm font-black text-slate-950">{hour.day}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{hour.open ? "Service actif" : "Jour fermé"}</p>
                    </div>
                    <ToggleRow label={hour.open ? "Ouvert" : "Fermé"} checked={hour.open} onChange={(checked) => updateHour(hour.day, { open: checked })} />
                    <div className="grid min-w-0 grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3">
                      <TextField label="Midi début" value={hour.lunchStart} onChange={(value) => updateHour(hour.day, { lunchStart: value })} type="time" />
                      <TextField label="Midi fin" value={hour.lunchEnd} onChange={(value) => updateHour(hour.day, { lunchEnd: value })} type="time" />
                    </div>
                    <div className="grid min-w-0 grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3">
                      <TextField label="Soir début" value={hour.dinnerStart} onChange={(value) => updateHour(hour.day, { dinnerStart: value })} type="time" />
                      <TextField label="Soir fin" value={hour.dinnerEnd} onChange={(value) => updateHour(hour.day, { dinnerEnd: value })} type="time" />
                    </div>
                  </div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="Paiement physique" title="Règlement" description="Dans ce MVP, TableFlash ne déclenche aucun paiement en ligne. Le client règle directement au restaurant.">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <TextAreaField label="Message affiché au client" value={settings.paymentMessage} onChange={(value) => updateSetting("paymentMessage", value)} />
                <ToggleRow label="Exiger le règlement avant préparation" helper="Le client comprend que le règlement intervient avant le lancement en cuisine." checked={settings.requirePaymentBeforePreparation} onChange={(checked) => updateSetting("requirePaymentBeforePreparation", checked)} />
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="QR & emplacements" title="Zones de service" description="Organisez vos emplacements pour les QR : salle, terrasse, comptoir ou toute autre zone du restaurant.">
              <div className="space-y-3">
                {settings.zones.map((zone) => (
                  <div key={zone.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[minmax(0,1fr)_170px_120px] md:items-end">
                    <TextField label="Nom de zone" value={zone.name} onChange={(value) => updateZone(zone.id, { name: value })} />
                    <ToggleRow label="Active" checked={zone.enabled} onChange={(checked) => updateZone(zone.id, { enabled: checked })} />
                    <button type="button" disabled={settings.zones.length <= 1} onClick={() => removeZone(zone.id)} className="rounded-full border border-rose-200 bg-white px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">Supprimer</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addZone} className="mt-4 rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800">Ajouter une zone</button>
            </SettingsCard>

            <SettingsCard eyebrow="Activation à table" title="QR par table" description="Configurez l’apparence et les informations visibles quand un client scanne le QR de sa table.">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                  <SegmentedControl label="Style QR" value={settings.qrStyle} options={qrStyles} onChange={(value) => updateSetting("qrStyle", value)} />
                  <TextAreaField label="Instruction QR" value={settings.qrInstruction} onChange={(value) => updateSetting("qrInstruction", value)} rows={2} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <ToggleRow label="Afficher le nom de l’emplacement" checked={settings.qrShowLocationName} onChange={(checked) => updateSetting("qrShowLocationName", checked)} />
                    <ToggleRow label="Afficher le lien public" checked={settings.qrShowPublicLink} onChange={(checked) => updateSetting("qrShowPublicLink", checked)} />
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-4">
                  <div className="rounded-[1.25rem] bg-white p-4 text-center shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Votre QR</p>
                    <div className="mx-auto mt-4 grid h-28 w-28 grid-cols-4 gap-1 rounded-xl bg-slate-950 p-2">
                      {Array.from({ length: 16 }).map((_, index) => <span key={index} className={index % 3 === 0 ? "rounded-sm bg-white" : "rounded-sm bg-emerald-300"} />)}
                    </div>
                    <p className="mt-4 text-lg font-black text-slate-950">Table 1</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">{settings.qrInstruction}</p>
                    <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{settings.qrStyle}</span>
                  </div>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="Flux opérationnel" title="Commandes" description="Gardez la maîtrise du service, de la cuisine et de ce que le client suit après validation.">
              <div className="grid gap-3 md:grid-cols-2">
                <ToggleRow label="Accepter automatiquement les commandes" helper="Désactivé par défaut pour conserver une validation manuelle." checked={settings.orderAutoAccept} onChange={(checked) => updateSetting("orderAutoAccept", checked)} />
                <ToggleRow label="Autoriser les notes clients" helper="Aide la cuisine avec allergies, cuisson ou demandes spéciales." checked={settings.allowCustomerNotes} onChange={(checked) => updateSetting("allowCustomerNotes", checked)} />
                <ToggleRow label="Afficher le suivi au client" helper="Améliore l’expérience après validation de la commande." checked={settings.showPreparationTracking} onChange={(checked) => updateSetting("showPreparationTracking", checked)} />
                <ToggleRow label="Exiger le règlement avant préparation" helper="Aligne TableFlash avec le workflow du restaurant." checked={settings.requirePaymentBeforePreparation} onChange={(checked) => updateSetting("requirePaymentBeforePreparation", checked)} />
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="Réputation" title="Avis clients" description="Les avis sont demandés uniquement après le repas, de manière non intrusive.">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <ToggleRow label="Autoriser les avis après repas" checked={settings.allowReviewsAfterMeal} onChange={(checked) => updateSetting("allowReviewsAfterMeal", checked)} />
                  <ToggleRow label="Suggérer Google pour les avis positifs" checked={settings.suggestGoogleForPositiveReviews} onChange={(checked) => updateSetting("suggestGoogleForPositiveReviews", checked)} />
                  <TextField label="Lien Google Avis" value={settings.googleReviewUrl} onChange={(value) => updateSetting("googleReviewUrl", value)} />
                </div>
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                  <button type="button" onClick={() => showToast("Lien Google Avis copié dans la maquette.")} className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">Copier le lien</button>
                  <button type="button" onClick={() => showToast("Ouverture Google Avis simulée dans la maquette.")} className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">Tester le lien</button>
                  <p className="text-xs font-semibold leading-5 text-slate-500">Aucune publication automatique Google n’est déclenchée dans cette maquette.</p>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard eyebrow="Expérience publique" title="Apparence & message public" description="Ces messages sont ceux que les clients voient après avoir scanné un QR.">
              <SegmentedControl label="Apparence" value={settings.primaryColor} options={primaryColors} onChange={(value) => updateSetting("primaryColor", value)} />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {primaryColors.map((color) => (
                  <button key={color} type="button" onClick={() => updateSetting("primaryColor", color)} className={`rounded-2xl bg-gradient-to-br p-4 text-left font-black shadow-sm ${colorPreview[color]} ${settings.primaryColor === color ? "ring-4 ring-emerald-200" : ""}`}>{color}</button>
                ))}
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <TextAreaField label="Message d’accueil public" value={settings.publicWelcomeMessage} onChange={(value) => updateSetting("publicWelcomeMessage", value)} />
                <TextAreaField label="Instruction QR" value={settings.qrInstruction} onChange={(value) => updateSetting("qrInstruction", value)} />
                <TextAreaField label="Message règlement" value={settings.paymentMessage} onChange={(value) => updateSetting("paymentMessage", value)} />
              </div>
            </SettingsCard>
          </div>

          <div className="min-w-0">
            <SettingsPreviewPanel settings={settings} previewRef={previewRef} saveState={saveState} />
          </div>
        </div>
      </main>

      <SettingsToast message={toast} />
    </>
  );
}
