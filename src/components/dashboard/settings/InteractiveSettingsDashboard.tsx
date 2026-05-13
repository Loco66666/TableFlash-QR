"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

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
type SectionId =
  | "establishment"
  | "service"
  | "orders"
  | "qr"
  | "reviews"
  | "appearance";

const serviceStatuses: RestaurantSettings["serviceStatus"][] = [
  "Ouvert",
  "En pause",
  "Fermé",
];
const serviceModes: RestaurantSettings["serviceMode"][] = [
  "Service midi",
  "Service soir",
  "Toute la journée",
];
const primaryColors: RestaurantSettings["primaryColor"][] = [
  "Émeraude",
  "Noir premium",
  "Sable",
  "Bleu nuit",
];
const contrastOptions: RestaurantSettings["interfaceContrast"][] = [
  "Doux",
  "Équilibré",
  "Marqué",
];
const ambienceOptions: RestaurantSettings["ambienceStyle"][] = [
  "Brasserie élégante",
  "Comptoir moderne",
  "Maison chaleureuse",
];

const settingsSections: Array<{
  id: SectionId;
  label: string;
  helper: string;
}> = [
  {
    id: "establishment",
    label: "Établissement",
    helper: "Identité & coordonnées",
  },
  { id: "service", label: "Service", helper: "Statut & horaires" },
  { id: "orders", label: "Commandes", helper: "Règlement & validation" },
  { id: "qr", label: "QR", helper: "Fiches & zones" },
  { id: "reviews", label: "Avis", helper: "Collecte & Google" },
  { id: "appearance", label: "Apparence", helper: "Identité visuelle" },
];

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
    <div
      className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm font-bold text-emerald-900 shadow-2xl shadow-emerald-950/15"
      role="status"
    >
      {message}
    </div>
  );
}

function SettingsCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 md:p-6">
      <div className="mb-6 min-w-0">
        <p className="break-words text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
          {eyebrow}
        </p>
        <h2 className="mt-2 break-words text-2xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SettingsBlock({
  title,
  description,
  children,
  tone = "white",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "white" | "soft" | "emerald";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-100 bg-emerald-50/70"
      : tone === "soft"
        ? "border-slate-200 bg-slate-50/70"
        : "border-slate-200 bg-white";

  return (
    <section className={`min-w-0 rounded-[1.75rem] border p-5 ${toneClass}`}>
      <div className="min-w-0">
        <h3 className="break-words text-lg font-black tracking-tight text-slate-950">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-5 min-w-0 space-y-3">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="break-words text-sm font-bold text-slate-800">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-[96px] flex-1">
      <span className="whitespace-nowrap text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <input
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full min-w-[96px] rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block min-w-0">
      <span className="break-words text-sm font-bold text-slate-800">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full min-w-0 max-w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="min-w-0 max-w-full">
      <p className="break-words text-sm font-bold text-slate-800">{label}</p>
      <div className="mt-2 flex max-w-full flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-11 flex-1 basis-[140px] rounded-xl px-4 py-2.5 text-sm font-black transition ${value === option ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" : "text-slate-600 hover:bg-white hover:text-emerald-700"}`}
          >
            <span className="whitespace-nowrap">
              {option.replace("Service ", "")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  helper,
  checked,
  onChange,
}: {
  label: string;
  helper?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex min-h-14 w-full min-w-0 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/70"
      aria-pressed={checked}
    >
      <span className="min-w-0">
        <span className="block break-words text-sm font-black text-slate-900">
          {label}
        </span>
        {helper ? (
          <span className="mt-1 block break-words text-xs font-semibold leading-5 text-slate-500">
            {helper}
          </span>
        ) : null}
      </span>
      <span
        className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${checked ? "bg-emerald-700" : "bg-slate-300"}`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </span>
    </button>
  );
}

function OverviewMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-800"
      : tone === "warning"
        ? "bg-amber-50 text-amber-800"
        : "bg-slate-50 text-slate-800";

  return (
    <article
      className={`flex min-w-0 max-w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 ${toneClass}`}
    >
      <p className="whitespace-nowrap text-xs font-black uppercase tracking-[0.14em] opacity-70">
        {label}
      </p>
      <p className="min-w-0 break-words text-right text-sm font-black leading-snug sm:text-base">
        {value}
      </p>
    </article>
  );
}

function SettingsNavigation({
  activeSection,
  onChange,
}: {
  activeSection: SectionId;
  onChange: (section: SectionId) => void;
}) {
  return (
    <nav
      className="min-w-0 max-w-full rounded-full border border-slate-200 bg-white p-2 shadow-sm shadow-slate-200/70"
      aria-label="Sections des paramètres"
    >
      <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {settingsSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-sm font-black transition ${isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"}`}
              aria-current={isActive ? "page" : undefined}
              title={section.helper}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function InlineStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="break-words text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black leading-5 text-slate-900">
        {value}
      </p>
    </div>
  );
}

function SettingsPreviewPanel({
  settings,
  previewRef,
  saveState,
}: {
  settings: RestaurantSettings;
  previewRef: RefObject<HTMLElement | null>;
  saveState: SaveState;
}) {
  const enabledZones = settings.zones.filter((zone) => zone.enabled);

  return (
    <aside
      ref={previewRef}
      tabIndex={-1}
      className="min-w-0 space-y-4 outline-none 2xl:sticky 2xl:top-6"
    >
      <section className="min-w-0 rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/10">
        <p className="break-words text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
          Aperçu client
        </p>
        <h2 className="mt-2 break-words text-2xl font-black text-slate-950">
          Expérience scannée par QR
        </h2>
        <p className="mt-2 break-words text-sm leading-6 text-slate-500">
          Un aperçu mobile unique pour vérifier l’identité, le service et les
          messages publics.
        </p>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-inner shadow-slate-950/20">
          <div className="min-w-0 rounded-[1.5rem] bg-white p-4">
            <div
              className={`min-w-0 rounded-[1.25rem] bg-gradient-to-br p-4 ${colorPreview[settings.primaryColor]}`}
            >
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black tracking-[0.14em]">
                  TableFlash
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                  Table 1
                </span>
              </div>
              <p className="mt-4 break-words text-sm font-black uppercase tracking-[0.14em] opacity-80">
                {settings.publicWelcomeTitle}
              </p>
              <h3 className="mt-2 break-words text-2xl font-black leading-tight">
                {settings.restaurantName}
              </h3>
              <p className="mt-2 break-all text-xs font-bold opacity-85">
                /r/{settings.publicSlug}/table/table-1
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {settings.serviceStatus}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                {settings.serviceMode}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                {enabledZones.length} zones
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Accueil
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-700">
                  {settings.publicWelcomeMessage}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Règlement
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-700">
                  {settings.paymentMessage}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                  Instruction QR
                </p>
                <p className="mt-2 break-words text-sm font-bold leading-6 text-slate-900">
                  {settings.qrInstruction}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
        <p className="break-words text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
          Configuration active
        </p>
        <div className="mt-4 grid gap-3">
          <InlineStatus
            label="URL publique"
            value={`/r/${settings.publicSlug}`}
          />
          <InlineStatus
            label="Zones activées"
            value={
              enabledZones.map((zone) => zone.name).join(", ") ||
              "Aucune zone active"
            }
          />
          <InlineStatus
            label="Avis après repas"
            value={settings.allowReviewsAfterMeal ? "Activés" : "Désactivés"}
          />
          <InlineStatus
            label="Suivi client"
            value={settings.showPreparationTracking ? "Activé" : "Désactivé"}
          />
          <InlineStatus
            label="État local"
            value={
              saveState === "saved"
                ? "Paramètres enregistrés"
                : "Modifications locales"
            }
          />
        </div>
      </section>
    </aside>
  );
}

function TimeRangeEditor({
  title,
  hour,
  onChange,
}: {
  title: string;
  hour: OpeningHour;
  onChange: (patch: Partial<OpeningHour>) => void;
}) {
  const isLunch = title === "Midi";

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="whitespace-nowrap text-sm font-black text-slate-900">
        Créneau {title.toLowerCase()}
      </p>
      <div className="mt-3 flex min-w-0 flex-wrap items-end gap-3">
        <TimeField
          label="Début"
          value={isLunch ? hour.lunchStart : hour.dinnerStart}
          onChange={(value) =>
            onChange(isLunch ? { lunchStart: value } : { dinnerStart: value })
          }
        />
        <span
          className="pb-3 text-sm font-black text-slate-400"
          aria-hidden="true"
        >
          —
        </span>
        <TimeField
          label="Fin"
          value={isLunch ? hour.lunchEnd : hour.dinnerEnd}
          onChange={(value) =>
            onChange(isLunch ? { lunchEnd: value } : { dinnerEnd: value })
          }
        />
      </div>
    </div>
  );
}

function QrMockCode() {
  return (
    <div className="mx-auto grid h-28 w-28 grid-cols-4 gap-1 rounded-xl bg-slate-950 p-2">
      {Array.from({ length: 16 }).map((_, index) => (
        <span
          key={index}
          className={
            index % 3 === 0
              ? "rounded-sm bg-white"
              : "rounded-sm bg-emerald-300"
          }
        />
      ))}
    </div>
  );
}

function PrintedQrPreview({ settings }: { settings: RestaurantSettings }) {
  return (
    <div className="min-w-0 rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-4">
      <div className="min-w-0 rounded-[1.35rem] bg-white p-5 text-center shadow-sm">
        <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          Fiche imprimée
        </p>
        <p className="mt-3 break-words text-lg font-black text-slate-950">
          {settings.restaurantName}
        </p>
        <div className="mt-4">
          <QrMockCode />
        </div>
        {settings.qrShowLocationName ? (
          <p className="mt-5 break-words text-xl font-black text-slate-950">
            Table 1
          </p>
        ) : null}
        <p className="mt-2 break-words text-sm font-semibold leading-5 text-slate-500">
          {settings.qrInstruction}
        </p>
        {settings.qrShowPublicLink ? (
          <p className="mt-4 break-all rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">
            /r/{settings.publicSlug}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function InteractiveSettingsDashboard() {
  const [settings, setSettings] = useState<RestaurantSettings>(
    defaultRestaurantSettings,
  );
  const [activeSection, setActiveSection] =
    useState<SectionId>("establishment");
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
  const serviceTone: "success" | "warning" | "neutral" =
    settings.serviceStatus === "Ouvert"
      ? "success"
      : settings.serviceStatus === "En pause"
        ? "warning"
        : "neutral";
  const overviewMetrics = useMemo(
    () => [
      { label: "Service", value: settings.serviceStatus, tone: serviceTone },
      { label: "Mode", value: settings.serviceMode, tone: "neutral" as const },
      {
        label: "Zones",
        value: `${enabledZones.length} zones actives`,
        tone: "neutral" as const,
      },
      { label: "QR", value: "Standard premium", tone: "success" as const },
      {
        label: "Avis",
        value: settings.allowReviewsAfterMeal ? "Activés" : "Désactivés",
        tone: settings.allowReviewsAfterMeal
          ? ("success" as const)
          : ("neutral" as const),
      },
      {
        label: "Suivi client",
        value: settings.showPreparationTracking ? "Activé" : "Désactivé",
        tone: settings.showPreparationTracking
          ? ("success" as const)
          : ("neutral" as const),
      },
    ],
    [
      enabledZones.length,
      serviceTone,
      settings.allowReviewsAfterMeal,
      settings.serviceMode,
      settings.serviceStatus,
      settings.showPreparationTracking,
    ],
  );

  const updateSetting = <K extends FieldName>(
    field: K,
    value: RestaurantSettings[K],
  ) => {
    setSettings((currentSettings) => ({ ...currentSettings, [field]: value }));
    setSaveState("dirty");
  };

  const updateZone = (zoneId: string, patch: Partial<Zone>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: currentSettings.zones.map((zone) =>
        zone.id === zoneId ? { ...zone, ...patch } : zone,
      ),
    }));
    setSaveState("dirty");
  };

  const updateHour = (day: string, patch: Partial<OpeningHour>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      hours: currentSettings.hours.map((hour) =>
        hour.day === day ? { ...hour, ...patch } : hour,
      ),
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
    setActiveSection("establishment");
    window.setTimeout(() => {
      previewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      previewRef.current?.focus({ preventScroll: true });
    }, 0);
  };

  const resetSettings = () => {
    if (
      !window.confirm(
        "Voulez-vous vraiment réinitialiser les paramètres de cette maquette ?",
      )
    )
      return;
    const resetSettingsValue = resetLocalRestaurantSettings();
    setSettings(resetSettingsValue);
    setSaveState("saved");
    showToast("Paramètres réinitialisés.");
  };

  const generateSlug = () => {
    updateSetting(
      "publicSlug",
      createSlug(settings.restaurantName) ||
        defaultRestaurantSettings.publicSlug,
    );
    showToast("Slug généré.");
  };

  const addZone = () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: [
        ...currentSettings.zones,
        { id: `zone-${Date.now()}`, name: "Nouvelle zone", enabled: true },
      ],
    }));
    setSaveState("dirty");
    showToast("Zone ajoutée.");
  };

  const removeZone = (zoneId: string) => {
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer cette zone de la maquette ?",
      )
    )
      return;
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: currentSettings.zones.filter((zone) => zone.id !== zoneId),
    }));
    setSaveState("dirty");
    showToast("Zone supprimée.");
  };

  const copyGoogleReviewLink = async () => {
    try {
      await window.navigator.clipboard?.writeText(settings.googleReviewUrl);
      showToast("Lien Google Avis copié.");
    } catch {
      showToast("Lien Google Avis prêt à être copié.");
    }
  };

  const renderActiveSection = () => {
    if (activeSection === "establishment") {
      return (
        <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <SettingsCard
            eyebrow="Identité commerciale"
            title="Établissement"
            description="Renseignez les informations visibles sur les QR, les liens publics et l’accueil client."
          >
            <div className="grid min-w-0 gap-4 lg:grid-cols-2">
              <TextField
                label="Nom du restaurant"
                value={settings.restaurantName}
                onChange={(value) => updateSetting("restaurantName", value)}
              />
              <div className="min-w-0">
                <TextField
                  label="Slug public"
                  value={settings.publicSlug}
                  onChange={(value) =>
                    updateSetting("publicSlug", normalizeSlug(value))
                  }
                />
                <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-500">
                  Utilisé pour les liens publics et les QR de l’établissement.
                </p>
              </div>
              <TextField
                label="Site web"
                value={settings.website ?? ""}
                onChange={(value) => updateSetting("website", value)}
                placeholder="https://"
              />
              <TextField
                label="Adresse"
                value={settings.address}
                onChange={(value) => updateSetting("address", value)}
              />
              <TextField
                label="Ville"
                value={settings.city}
                onChange={(value) => updateSetting("city", value)}
              />
              <TextField
                label="Code postal"
                value={settings.postalCode}
                onChange={(value) => updateSetting("postalCode", value)}
              />
              <TextField
                label="Téléphone"
                value={settings.phone}
                onChange={(value) => updateSetting("phone", value)}
              />
              <TextField
                label="Email"
                value={settings.email}
                onChange={(value) => updateSetting("email", value)}
                type="email"
              />
            </div>
            <div className="mt-5 flex min-w-0 flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 break-all text-sm font-bold text-emerald-900">
                Lien public : /r/{settings.publicSlug}
              </p>
              <button
                type="button"
                onClick={generateSlug}
                className="min-h-11 shrink-0 whitespace-nowrap rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Générer le slug
              </button>
            </div>
          </SettingsCard>

          <SettingsPreviewPanel
            settings={settings}
            previewRef={previewRef}
            saveState={saveState}
          />
        </div>
      );
    }

    if (activeSection === "service") {
      return (
        <SettingsCard
          eyebrow="Pilotage opérationnel"
          title="Service"
          description="Affichez clairement l’état du restaurant et adaptez les créneaux selon votre organisation réelle."
        >
          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <SettingsBlock
              title="Statut du service"
              description="Contrôle immédiat de la prise de commandes côté client."
              tone="emerald"
            >
              <SegmentedControl
                label="Disponibilité actuelle"
                value={settings.serviceStatus}
                options={serviceStatuses}
                onChange={(value) => updateSetting("serviceStatus", value)}
              />
            </SettingsBlock>
            <SettingsBlock
              title="Mode de service"
              description="Mettez en avant le moment de service dominant."
              tone="soft"
            >
              <SegmentedControl
                label="Période active"
                value={settings.serviceMode}
                options={serviceModes}
                onChange={(value) => updateSetting("serviceMode", value)}
              />
            </SettingsBlock>
          </div>

          <div className="mt-6 min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 md:p-5">
            <div className="mb-4 min-w-0">
              <h3 className="break-words text-lg font-black tracking-tight text-slate-950">
                Planning hebdomadaire
              </h3>
              <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-500">
                Chaque journée conserve ses créneaux midi et soir pour préparer
                les QR et l’affichage client.
              </p>
            </div>
            <div className="space-y-3">
              {settings.hours.map((hour) => (
                <article
                  key={hour.day}
                  className={`grid min-w-0 gap-4 rounded-[1.5rem] border p-4 lg:grid-cols-[minmax(120px,0.7fr)_minmax(150px,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-center ${hour.open ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/80"}`}
                >
                  <div className="min-w-0">
                    <p
                      className={`whitespace-nowrap text-base font-black ${hour.open ? "text-slate-950" : "text-slate-500"}`}
                    >
                      {hour.day}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-xs font-bold text-slate-500">
                      {hour.open ? "Service actif" : "Jour fermé"}
                    </p>
                  </div>
                  <ToggleRow
                    label="Ouvert"
                    helper={hour.open ? "Commandes possibles" : "Hors service"}
                    checked={hour.open}
                    onChange={(checked) =>
                      updateHour(hour.day, { open: checked })
                    }
                  />
                  <div className={hour.open ? "min-w-0" : "min-w-0 opacity-55"}>
                    <TimeRangeEditor
                      title="Midi"
                      hour={hour}
                      onChange={(patch) => updateHour(hour.day, patch)}
                    />
                  </div>
                  <div className={hour.open ? "min-w-0" : "min-w-0 opacity-55"}>
                    <TimeRangeEditor
                      title="Soir"
                      hour={hour}
                      onChange={(patch) => updateHour(hour.day, patch)}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </SettingsCard>
      );
    }

    if (activeSection === "orders") {
      return (
        <SettingsCard
          eyebrow="Exécution en salle"
          title="Commandes"
          description="Cadrez le règlement, la validation et les messages visibles par vos clients avant la préparation."
        >
          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <SettingsBlock
              title="Paiement"
              description="Le MVP conserve un règlement physique, au comptoir ou auprès du serveur."
              tone="soft"
            >
              <TextAreaField
                label="Message affiché au client"
                value={settings.paymentMessage}
                onChange={(value) => updateSetting("paymentMessage", value)}
              />
              <ToggleRow
                label="Paiement requis avant préparation"
                helper="Rappelle à l’équipe et au client que le règlement intervient avant le lancement en cuisine."
                checked={settings.requirePaymentBeforePreparation}
                onChange={(checked) =>
                  updateSetting("requirePaymentBeforePreparation", checked)
                }
              />
            </SettingsBlock>

            <SettingsBlock
              title="Traitement des commandes"
              description="Gardez une validation humaine pour éviter les erreurs en période de rush."
            >
              <ToggleRow
                label="Validation manuelle des commandes"
                helper="Chaque commande arrive en attente avant d’être acceptée par l’équipe."
                checked={!settings.orderAutoAccept}
                onChange={(checked) =>
                  updateSetting("orderAutoAccept", !checked)
                }
              />
              <ToggleRow
                label="Acceptation automatique désactivée par défaut"
                helper="Ce réglage protège le restaurant lorsque la cuisine est saturée ou qu’un produit manque."
                checked={!settings.orderAutoAccept}
                onChange={(checked) =>
                  updateSetting("orderAutoAccept", !checked)
                }
              />
              <ToggleRow
                label="Autoriser les notes clients"
                helper="Allergies, cuisson ou demandes spéciales restent visibles pour l’équipe."
                checked={settings.allowCustomerNotes}
                onChange={(checked) =>
                  updateSetting("allowCustomerNotes", checked)
                }
              />
            </SettingsBlock>

            <div className="lg:col-span-2">
              <SettingsBlock
                title="Expérience client"
                description="Donnez au client une lecture rassurante de l’avancement sans créer de promesse excessive."
                tone="emerald"
              >
                <ToggleRow
                  label="Afficher le suivi de préparation au client"
                  helper="Le client sait si la commande est validée, en préparation ou prête à être servie."
                  checked={settings.showPreparationTracking}
                  onChange={(checked) =>
                    updateSetting("showPreparationTracking", checked)
                  }
                />
              </SettingsBlock>
            </div>
          </div>
        </SettingsCard>
      );
    }

    if (activeSection === "qr") {
      return (
        <SettingsCard
          eyebrow="QR & emplacements"
          title="QR"
          description="Un standard QR unique, premium et cohérent, pour toutes les tables et zones de service."
        >
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              <SettingsBlock
                title="Fiche QR"
                description="Le rendu imprimé reste volontairement homogène sur l’ensemble du produit."
                tone="soft"
              >
                <TextAreaField
                  label="Instruction QR"
                  value={settings.qrInstruction}
                  onChange={(value) => updateSetting("qrInstruction", value)}
                  rows={2}
                />
                <div className="grid min-w-0 gap-3 md:grid-cols-2">
                  <ToggleRow
                    label="Afficher le nom de l’emplacement"
                    helper="Exemple : Table 1, Terrasse 4, Comptoir."
                    checked={settings.qrShowLocationName}
                    onChange={(checked) =>
                      updateSetting("qrShowLocationName", checked)
                    }
                  />
                  <ToggleRow
                    label="Afficher le lien public"
                    helper="Utile si un client souhaite saisir l’adresse manuellement."
                    checked={settings.qrShowPublicLink}
                    onChange={(checked) =>
                      updateSetting("qrShowPublicLink", checked)
                    }
                  />
                </div>
              </SettingsBlock>

              <SettingsBlock
                title="Zones de service"
                description="Organisez les emplacements qui recevront des QR : salle, terrasse, comptoir ou espaces dédiés."
              >
                <div className="flex min-w-0 justify-end">
                  <button
                    type="button"
                    onClick={addZone}
                    className="min-h-11 shrink-0 whitespace-nowrap rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
                  >
                    Ajouter une zone
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="grid min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-3 lg:grid-cols-[minmax(0,1fr)_190px_140px] lg:items-end"
                    >
                      <TextField
                        label="Nom de zone"
                        value={zone.name}
                        onChange={(value) =>
                          updateZone(zone.id, { name: value })
                        }
                      />
                      <ToggleRow
                        label="Active"
                        checked={zone.enabled}
                        onChange={(checked) =>
                          updateZone(zone.id, { enabled: checked })
                        }
                      />
                      <button
                        type="button"
                        disabled={settings.zones.length <= 1}
                        onClick={() => removeZone(zone.id)}
                        className="min-h-12 whitespace-nowrap rounded-full border border-rose-200 bg-white px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </SettingsBlock>
            </div>

            <PrintedQrPreview settings={settings} />
          </div>
        </SettingsCard>
      );
    }

    if (activeSection === "reviews") {
      return (
        <SettingsCard
          eyebrow="Réputation"
          title="Avis"
          description="Structurez la collecte d’avis après le repas, avec une redirection Google maîtrisée et non automatique."
        >
          <div className="grid min-w-0 gap-5 lg:grid-cols-3">
            <SettingsBlock
              title="Collecte des avis"
              description="L’invitation intervient au bon moment, une fois l’expérience terminée."
              tone="emerald"
            >
              <ToggleRow
                label="Activer la demande d’avis après repas"
                helper="L’invitation à laisser un avis est proposée après le repas, une fois l’expérience terminée."
                checked={settings.allowReviewsAfterMeal}
                onChange={(checked) =>
                  updateSetting("allowReviewsAfterMeal", checked)
                }
              />
            </SettingsBlock>

            <SettingsBlock
              title="Google Avis"
              description="Aucune publication automatique n’est effectuée. Le client garde le contrôle de son retour."
            >
              <ToggleRow
                label="Suggérer Google Avis aux clients satisfaits"
                helper="Le client peut être redirigé vers votre lien Google Avis après son retour."
                checked={settings.suggestGoogleForPositiveReviews}
                onChange={(checked) =>
                  updateSetting("suggestGoogleForPositiveReviews", checked)
                }
              />
              <TextField
                label="Lien Google Avis"
                value={settings.googleReviewUrl}
                onChange={(value) => updateSetting("googleReviewUrl", value)}
              />
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <button
                  type="button"
                  onClick={copyGoogleReviewLink}
                  className="min-h-12 whitespace-nowrap rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Copier le lien
                </button>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Test du lien Google Avis simulé dans la maquette.",
                    )
                  }
                  className="min-h-12 whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Tester le lien
                </button>
              </div>
            </SettingsBlock>

            <SettingsBlock
              title="Diffusion client"
              description="Le module reste transparent : TableFlash accompagne le client sans forcer la publication."
              tone="soft"
            >
              <InlineStatus
                label="Invitation"
                value={
                  settings.allowReviewsAfterMeal ? "Après repas" : "Désactivée"
                }
              />
              <InlineStatus
                label="Redirection Google"
                value={
                  settings.suggestGoogleForPositiveReviews
                    ? "Proposée"
                    : "Masquée"
                }
              />
              <p className="break-words rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-600">
                Aucune publication automatique n’est effectuée. Le client peut
                être redirigé vers votre lien Google Avis après son retour.
              </p>
            </SettingsBlock>
          </div>
        </SettingsCard>
      );
    }

    return (
      <SettingsCard
        eyebrow="Image de marque"
        title="Apparence"
        description="Pilotez l’identité visuelle et la tonalité client avec des réglages simples, lisibles et cohérents."
      >
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <SettingsBlock
            title="Identité visuelle"
            description="Choisissez une base graphique adaptée à votre établissement."
            tone="soft"
          >
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              {primaryColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateSetting("primaryColor", color)}
                  className={`min-h-28 min-w-0 rounded-2xl bg-gradient-to-br p-4 text-left font-black shadow-sm transition ${colorPreview[color]} ${settings.primaryColor === color ? "ring-4 ring-emerald-200" : "hover:-translate-y-0.5"}`}
                >
                  <span className="block whitespace-nowrap text-lg">
                    {color}
                  </span>
                  <span className="mt-6 inline-flex whitespace-nowrap rounded-full bg-white/20 px-3 py-1 text-xs">
                    {settings.primaryColor === color ? "Sélectionné" : "Aperçu"}
                  </span>
                </button>
              ))}
            </div>
            <SegmentedControl
              label="Contraste de l’interface"
              value={settings.interfaceContrast}
              options={contrastOptions}
              onChange={(value) => updateSetting("interfaceContrast", value)}
            />
            <SegmentedControl
              label="Style d’ambiance"
              value={settings.ambienceStyle}
              options={ambienceOptions}
              onChange={(value) => updateSetting("ambienceStyle", value)}
            />
          </SettingsBlock>

          <SettingsBlock
            title="Présentation publique"
            description="Ces textes donnent le ton dès l’ouverture du menu par QR."
          >
            <TextField
              label="Titre de bienvenue"
              value={settings.publicWelcomeTitle}
              onChange={(value) => updateSetting("publicWelcomeTitle", value)}
            />
            <TextAreaField
              label="Message d’accueil"
              value={settings.publicWelcomeMessage}
              onChange={(value) => updateSetting("publicWelcomeMessage", value)}
            />
            <TextAreaField
              label="Message de règlement"
              value={settings.paymentMessage}
              onChange={(value) => updateSetting("paymentMessage", value)}
            />
          </SettingsBlock>

          <div className="lg:col-span-2">
            <SettingsBlock
              title="Tonalité client"
              description="Harmonisez l’instruction QR et la promesse affichée sur l’expérience mobile."
              tone="emerald"
            >
              <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <TextAreaField
                  label="Instruction QR"
                  value={settings.qrInstruction}
                  onChange={(value) => updateSetting("qrInstruction", value)}
                  rows={2}
                />
                <div
                  className={`min-w-0 rounded-[1.5rem] bg-gradient-to-br p-5 ${colorPreview[settings.primaryColor]}`}
                >
                  <p className="break-words text-xs font-black uppercase tracking-[0.18em] opacity-80">
                    Aperçu de tonalité
                  </p>
                  <p className="mt-4 break-words text-2xl font-black leading-tight">
                    {settings.publicWelcomeTitle}
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold leading-6 opacity-85">
                    {settings.publicWelcomeMessage}
                  </p>
                </div>
              </div>
            </SettingsBlock>
          </div>
        </div>
      </SettingsCard>
    );
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Paramètres"
        subtitle="Configurez votre établissement, vos QR, vos commandes et l’expérience client."
      >
        <button
          type="button"
          onClick={saveSettings}
          className="min-h-11 whitespace-nowrap rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={previewSettings}
          className="min-h-11 whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
        >
          Prévisualiser
        </button>
        <button
          type="button"
          onClick={resetSettings}
          className="min-h-11 whitespace-nowrap rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50"
        >
          Réinitialiser
        </button>
      </DashboardHeader>

      <main className="flex-1 overflow-x-hidden bg-slate-50/70 p-4 sm:p-5 lg:p-8">
        <div className="mx-auto min-w-0 max-w-[1500px] space-y-6">
          <section className="min-w-0 rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-5 shadow-sm shadow-emerald-950/5 md:p-6">
            <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <p className="break-words text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                  Vue d’ensemble
                </p>
                <h2 className="mt-2 break-words text-2xl font-black tracking-tight text-slate-950">
                  Centre de contrôle du restaurant
                </h2>
              </div>
              <p className="break-words text-sm font-semibold text-slate-500">
                {saveState === "saved"
                  ? "Dernière version enregistrée localement"
                  : "Modifications non enregistrées"}
              </p>
            </div>
            <div className="mt-5 grid min-w-0 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {overviewMetrics.map((item) => (
                <OverviewMetric key={item.label} {...item} />
              ))}
            </div>
          </section>

          <SettingsNavigation
            activeSection={activeSection}
            onChange={setActiveSection}
          />
          {renderActiveSection()}
        </div>
      </main>

      <SettingsToast message={toast} />
    </>
  );
}
