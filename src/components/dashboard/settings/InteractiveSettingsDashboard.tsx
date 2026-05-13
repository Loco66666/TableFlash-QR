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
  | "customerExperience";

type OperationalStatus = {
  modeLabel: string;
  customerState: "Service ouvert" | "Commandes en pause" | "Service fermé";
  customerHelper: string;
  activeSlot: string;
  nextSlot: string;
  isOpen: boolean;
  isPaused: boolean;
};

type ReadinessItem = {
  label: string;
  helper: string;
  checked: boolean;
};

const openingModes: RestaurantSettings["serviceOpeningMode"][] = [
  "Automatique selon les horaires",
  "Forcer ouvert",
  "Mettre en pause",
  "Forcer fermé",
];

const primaryColors: RestaurantSettings["primaryColor"][] = [
  "Émeraude",
  "Noir premium",
  "Sable",
  "Bleu nuit",
];

const settingsSections: Array<{
  id: SectionId;
  label: string;
  helper: string;
}> = [
  { id: "establishment", label: "Établissement", helper: "Identité publique" },
  { id: "service", label: "Service", helper: "Ouverture & horaires" },
  { id: "orders", label: "Commandes", helper: "Traitement & règlement" },
  { id: "qr", label: "QR", helper: "Impression & zones" },
  { id: "reviews", label: "Avis", helper: "Réputation" },
  {
    id: "customerExperience",
    label: "Expérience client",
    helper: "Messages & identité visuelle",
  },
];

const colorPreview: Record<RestaurantSettings["primaryColor"], string> = {
  Émeraude: "from-emerald-700 to-emerald-500 text-white",
  "Noir premium": "from-slate-950 to-slate-700 text-white",
  Sable: "from-amber-200 to-stone-100 text-slate-950",
  "Bleu nuit": "from-slate-900 to-blue-900 text-white",
};

const colorSwatch: Record<RestaurantSettings["primaryColor"], string> = {
  Émeraude: "bg-emerald-700",
  "Noir premium": "bg-slate-950",
  Sable: "bg-amber-200",
  "Bleu nuit": "bg-blue-950",
};

const dayOrder = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

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

function toMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function isInsideSlot(now: number, start: string, end: string) {
  return now >= toMinutes(start) && now <= toMinutes(end);
}

function getTodayLabel(date: Date) {
  return dayOrder[date.getDay()];
}

function getSlotLabel(hour: OpeningHour, period: "midi" | "soir") {
  return period === "midi"
    ? `${hour.day} midi · ${hour.lunchStart}–${hour.lunchEnd}`
    : `${hour.day} soir · ${hour.dinnerStart}–${hour.dinnerEnd}`;
}

function computeAutomaticStatus(
  settings: RestaurantSettings,
  now = new Date(),
) {
  const todayHour = settings.hours.find(
    (hour) => hour.day === getTodayLabel(now),
  );
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (todayHour?.open) {
    if (isInsideSlot(nowMinutes, todayHour.lunchStart, todayHour.lunchEnd)) {
      return { isOpen: true, activeSlot: getSlotLabel(todayHour, "midi") };
    }

    if (isInsideSlot(nowMinutes, todayHour.dinnerStart, todayHour.dinnerEnd)) {
      return { isOpen: true, activeSlot: getSlotLabel(todayHour, "soir") };
    }
  }

  return { isOpen: false, activeSlot: "Aucun créneau actif" };
}

function findNextSlot(settings: RestaurantSettings, now = new Date()) {
  const currentDayIndex = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset < 8; offset += 1) {
    const dayName = dayOrder[(currentDayIndex + offset) % 7];
    const hour = settings.hours.find((item) => item.day === dayName);
    if (!hour?.open) continue;

    const slots: Array<{ period: "midi" | "soir"; start: string }> = [
      { period: "midi", start: hour.lunchStart },
      { period: "soir", start: hour.dinnerStart },
    ];
    const next = slots.find(
      (slot) => offset > 0 || toMinutes(slot.start) > nowMinutes,
    );
    if (!next) continue;

    if (offset === 0) return `Aujourd’hui à ${next.start}`;
    if (offset === 1) return `Demain à ${next.start}`;
    return `${dayName} à ${next.start}`;
  }

  return "Aucun créneau prévu aujourd’hui";
}

function getOperationalStatus(settings: RestaurantSettings): OperationalStatus {
  const automatic = computeAutomaticStatus(settings);
  const nextSlot = findNextSlot(settings);

  if (settings.serviceOpeningMode === "Forcer ouvert") {
    return {
      modeLabel: "Forcé ouvert",
      customerState: "Service ouvert",
      customerHelper: "Le client peut commander depuis sa table.",
      activeSlot: "Ouverture décidée par l’équipe",
      nextSlot,
      isOpen: true,
      isPaused: false,
    };
  }

  if (settings.serviceOpeningMode === "Mettre en pause") {
    return {
      modeLabel: "Pause décidée par l’équipe",
      customerState: "Commandes en pause",
      customerHelper:
        "Le menu reste visible, mais les commandes sont suspendues.",
      activeSlot: "QR accessibles, commandes suspendues",
      nextSlot,
      isOpen: false,
      isPaused: true,
    };
  }

  if (settings.serviceOpeningMode === "Forcer fermé") {
    return {
      modeLabel: "Forcé fermé",
      customerState: "Service fermé",
      customerHelper: "Le client voit que le service n’est pas ouvert.",
      activeSlot: "Prise de commandes fermée",
      nextSlot,
      isOpen: false,
      isPaused: false,
    };
  }

  return {
    modeLabel: "Automatique selon les horaires",
    customerState: automatic.isOpen ? "Service ouvert" : "Service fermé",
    customerHelper: automatic.isOpen
      ? "Le client peut commander depuis sa table."
      : "Le client voit que le service n’est pas ouvert.",
    activeSlot: automatic.activeSlot,
    nextSlot,
    isOpen: automatic.isOpen,
    isPaused: false,
  };
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
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  helper?: string;
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
      {helper ? (
        <span className="mt-2 block break-words text-xs font-semibold leading-5 text-slate-500">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  helper?: string;
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
      {helper ? (
        <span className="mt-2 block break-words text-xs font-semibold leading-5 text-slate-500">
          {helper}
        </span>
      ) : null}
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
    <label className="block min-w-[112px] flex-1">
      <span className="whitespace-nowrap text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <input
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full min-w-[112px] rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
            className={`min-h-11 flex-1 basis-[190px] rounded-xl px-4 py-2.5 text-sm font-black transition ${
              value === option
                ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                : "text-slate-600 hover:bg-white hover:text-emerald-700"
            }`}
          >
            <span className="break-words">{option}</span>
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

function ReadinessChecklistItem({ item }: { item: ReadinessItem }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-black ${
            item.checked
              ? "bg-emerald-700 text-white"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {item.checked ? "✓" : "!"}
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="break-words text-sm font-black text-slate-900">
              {item.label}
            </p>
            <span
              className={`rounded-full px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] ${
                item.checked
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {item.checked ? "Prêt" : "À compléter"}
            </span>
          </div>
          <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-500">
            {item.helper}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "emerald" | "amber" | "slate";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : tone === "amber"
        ? "bg-amber-50 text-amber-800 ring-amber-100"
        : "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex min-h-8 max-w-full items-center rounded-full px-3 text-xs font-black ring-1 ${toneClass}`}
    >
      <span className="break-words">{children}</span>
    </span>
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
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-sm font-black transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                  : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
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

function ReadinessOverview({
  score,
  checklist,
  saveState,
  operationalStatus,
}: {
  score: number;
  checklist: ReadinessItem[];
  saveState: SaveState;
  operationalStatus: OperationalStatus;
}) {
  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
      <div className="min-w-0 rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm shadow-emerald-950/5 md:p-6">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="break-words text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
              Avant le service
            </p>
            <h2 className="mt-2 break-words text-3xl font-black tracking-tight text-slate-950">
              État de préparation
            </h2>
            <p className="mt-2 max-w-3xl break-words text-sm font-semibold leading-6 text-slate-500">
              Vérifiez rapidement si votre restaurant est prêt à recevoir des
              commandes par QR.
            </p>
          </div>
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-emerald-700 text-white shadow-xl shadow-emerald-900/20">
            <div className="text-center">
              <p className="text-3xl font-black">{score}%</p>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] opacity-80">
                prêt
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {checklist.map((item) => (
            <ReadinessChecklistItem key={item.label} item={item} />
          ))}
        </div>
        <p className="mt-4 break-words text-sm font-bold text-slate-500">
          Dernière sauvegarde locale ·{" "}
          {saveState === "saved"
            ? "Paramètres enregistrés localement"
            : "Modifications non enregistrées"}
        </p>
      </div>

      <CustomerStateCard operationalStatus={operationalStatus} />
    </section>
  );
}

function CustomerStateCard({
  operationalStatus,
}: {
  operationalStatus: OperationalStatus;
}) {
  return (
    <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
            Pilotage du service
          </p>
          <h2 className="mt-2 break-words text-2xl font-black tracking-tight text-slate-950">
            Ce que voit le client maintenant
          </h2>
        </div>
        <StatusPill
          tone={
            operationalStatus.isOpen
              ? "emerald"
              : operationalStatus.isPaused
                ? "amber"
                : "slate"
          }
        >
          {operationalStatus.customerState}
        </StatusPill>
      </div>
      <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        <p className="break-words text-2xl font-black text-slate-950">
          {operationalStatus.customerState}
        </p>
        <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-500">
          {operationalStatus.customerHelper}
        </p>
      </div>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
        <StatusTile label="Mode service" value={operationalStatus.modeLabel} />
        <StatusTile
          label="Prochain créneau"
          value={operationalStatus.nextSlot}
        />
      </div>
    </section>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="break-words text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black leading-5 text-slate-900">
        {value}
      </p>
    </div>
  );
}

function TimeRangeEditor({
  title,
  hour,
  onChange,
}: {
  title: "Service du midi" | "Service du soir";
  hour: OpeningHour;
  onChange: (patch: Partial<OpeningHour>) => void;
}) {
  const isLunch = title === "Service du midi";

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-3 break-words text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
        <TimeField
          label="Début"
          value={isLunch ? hour.lunchStart : hour.dinnerStart}
          onChange={(value) =>
            onChange(isLunch ? { lunchStart: value } : { dinnerStart: value })
          }
        />
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
    <div className="grid h-32 w-32 grid-cols-5 gap-1 rounded-2xl border border-slate-200 bg-white p-3">
      {Array.from({ length: 25 }).map((_, index) => (
        <span
          key={index}
          className={`rounded-sm ${(index * 7) % 5 === 0 || index % 6 === 0 || index === 12 ? "bg-slate-950" : "bg-slate-100"}`}
        />
      ))}
    </div>
  );
}

function QrPreview({ settings }: { settings: RestaurantSettings }) {
  return (
    <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
      <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
        QR premium imprimé
      </p>
      <div className="mt-4 min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-center shadow-sm">
        <p className="mx-auto inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          TableFlash
        </p>
        <p className="mt-4 break-words text-lg font-black text-slate-950">
          {settings.restaurantName}
        </p>
        <div className="mt-5 flex justify-center">
          <QrMockCode />
        </div>
        {settings.qrShowLocationName ? (
          <p className="mt-5 break-words text-2xl font-black text-slate-950">
            Table 1
          </p>
        ) : null}
        <p className="mt-2 break-words text-sm font-semibold leading-5 text-slate-500">
          {settings.qrInstruction}
        </p>
        {settings.qrShowPublicLink ? (
          <p className="mt-4 break-all rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">
            /r/{settings.publicSlug}/table/table-1
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CustomerPreview({
  settings,
  previewRef,
}: {
  settings: RestaurantSettings;
  previewRef: RefObject<HTMLElement | null>;
}) {
  return (
    <aside
      ref={previewRef}
      tabIndex={-1}
      className="min-w-0 rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/10 outline-none"
    >
      <p className="break-words text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
        Aperçu client
      </p>
      <h3 className="mt-2 break-words text-2xl font-black text-slate-950">
        Expérience après scan
      </h3>
      <div className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-inner shadow-slate-950/20">
        <div className="min-w-0 rounded-[1.5rem] bg-white p-4">
          <div
            className={`min-w-0 rounded-[1.25rem] bg-gradient-to-br p-4 ${colorPreview[settings.primaryColor]}`}
          >
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black tracking-[0.14em]">
                Service à table
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                Table 1
              </span>
            </div>
            <h3 className="mt-4 break-words text-2xl font-black leading-tight">
              {settings.restaurantName}
            </h3>
            <p className="mt-2 break-words text-sm font-semibold leading-6 opacity-90">
              {settings.publicWelcomeMessage}
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Règlement sur place
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
    </aside>
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
  const operationalStatus = useMemo(
    () => getOperationalStatus(settings),
    [settings],
  );
  const publicTableLink = `/r/${settings.publicSlug}/table/table-1`;

  const readinessItems = useMemo<ReadinessItem[]>(
    () => [
      {
        label: "Identité renseignée",
        helper: "Nom, slug et contact prêts",
        checked: Boolean(
          settings.restaurantName &&
          settings.publicSlug &&
          settings.phone &&
          settings.email,
        ),
      },
      {
        label: "Horaires configurés",
        helper: "Ouverture automatique selon vos créneaux",
        checked: settings.hours.some((hour) => hour.open),
      },
      {
        label: "Zones actives",
        helper: "Salle, terrasse ou comptoir disponibles",
        checked: enabledZones.length > 0,
      },
      {
        label: "QR prêt à imprimer",
        helper: "Instruction et zones prêtes",
        checked: Boolean(
          settings.qrInstruction &&
          settings.publicSlug &&
          enabledZones.length > 0,
        ),
      },
      {
        label: "Commandes configurées",
        helper: settings.orderAutoAccept
          ? "Acceptation automatique activée"
          : "Validation manuelle recommandée",
        checked: Boolean(settings.paymentMessage),
      },
      {
        label: "Avis après repas activés",
        helper: "Invitation proposée une fois le repas terminé",
        checked: settings.allowReviewsAfterMeal,
      },
      {
        label: "Message client prêt",
        helper: "Accueil, règlement et instruction QR visibles",
        checked: Boolean(
          settings.publicWelcomeMessage &&
          settings.paymentMessage &&
          settings.qrInstruction,
        ),
      },
    ],
    [
      enabledZones.length,
      settings.allowReviewsAfterMeal,
      settings.email,
      settings.hours,
      settings.orderAutoAccept,
      settings.paymentMessage,
      settings.phone,
      settings.publicSlug,
      settings.publicWelcomeMessage,
      settings.qrInstruction,
      settings.restaurantName,
    ],
  );

  const readinessScore = Math.round(
    (readinessItems.filter((item) => item.checked).length /
      readinessItems.length) *
      100,
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

  const copyText = async (value: string, successMessage: string) => {
    try {
      await window.navigator.clipboard.writeText(value);
      showToast(successMessage);
    } catch {
      showToast("Copie indisponible dans ce navigateur.");
    }
  };

  const saveSettings = () => {
    saveLocalRestaurantSettings(settings);
    setSaveState("saved");
    showToast("Paramètres enregistrés localement.");
  };

  const previewSettings = () => {
    setActiveSection("customerExperience");
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
        "Voulez-vous vraiment réinitialiser les paramètres de ce restaurant ?",
      )
    ) {
      return;
    }

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
    showToast("Slug public généré.");
  };

  const addZone = () => {
    const nextNumber = settings.zones.length + 1;
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: [
        ...currentSettings.zones,
        {
          id: `zone-${Date.now()}`,
          name: `Zone ${nextNumber}`,
          enabled: true,
        },
      ],
    }));
    setSaveState("dirty");
    showToast("Zone ajoutée.");
  };

  const deleteZone = (zoneId: string) => {
    if (!window.confirm("Supprimer cette zone de service ?")) return;
    setSettings((currentSettings) => ({
      ...currentSettings,
      zones: currentSettings.zones.filter((zone) => zone.id !== zoneId),
    }));
    setSaveState("dirty");
    showToast("Zone supprimée.");
  };

  const copyMondayToWeek = () => {
    const monday = settings.hours.find((hour) => hour.day === "Lundi");
    if (!monday) return;

    setSettings((currentSettings) => ({
      ...currentSettings,
      hours: currentSettings.hours.map((hour) => ({
        ...hour,
        open: monday.open,
        lunchStart: monday.lunchStart,
        lunchEnd: monday.lunchEnd,
        dinnerStart: monday.dinnerStart,
        dinnerEnd: monday.dinnerEnd,
      })),
    }));
    setSaveState("dirty");
    showToast("Horaires du lundi appliqués à la semaine.");
  };

  const closeSundays = () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      hours: currentSettings.hours.map((hour) =>
        hour.day === "Dimanche" ? { ...hour, open: false } : hour,
      ),
    }));
    setSaveState("dirty");
    showToast("Dimanche fermé.");
  };

  const resetHours = () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      hours: defaultRestaurantSettings.hours,
    }));
    setSaveState("dirty");
    showToast("Horaires réinitialisés.");
  };

  const copyGoogleReviewLink = () => {
    if (!settings.googleReviewUrl) return;
    void copyText(settings.googleReviewUrl, "Lien Google Avis copié.");
  };

  const testGoogleReviewLink = () => {
    if (!settings.googleReviewUrl) return;
    window.open(settings.googleReviewUrl, "_blank", "noopener,noreferrer");
  };

  const openTablesPage = () => {
    window.location.href = "/dashboard/tables";
  };

  const getDayBadge = (hour: OpeningHour) => {
    const today = getTodayLabel(new Date());

    if (!hour.open) return <StatusPill>Fermé</StatusPill>;
    if (hour.day === today && operationalStatus.isOpen) {
      return <StatusPill tone="emerald">Ouvert aujourd’hui</StatusPill>;
    }
    if (
      operationalStatus.nextSlot.includes(hour.day) ||
      (operationalStatus.nextSlot.includes("Aujourd’hui") && hour.day === today)
    ) {
      return <StatusPill tone="amber">Prochain service</StatusPill>;
    }
    return null;
  };

  const renderActiveSection = () => {
    if (activeSection === "establishment") {
      return (
        <SettingsCard
          eyebrow="Identité commerciale"
          title="Établissement"
          description="Centralisez les informations visibles par vos clients et utilisées comme base pour vos QR de table."
        >
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_380px]">
            <div className="min-w-0 space-y-5">
              <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                <TextField
                  label="Nom du restaurant"
                  value={settings.restaurantName}
                  onChange={(value) => updateSetting("restaurantName", value)}
                />
                <TextField
                  label="Slug public"
                  value={settings.publicSlug}
                  onChange={(value) =>
                    updateSetting("publicSlug", createSlug(value))
                  }
                  helper="Utilisé dans les liens publics et les QR."
                />
                <TextField
                  label="Site web"
                  value={settings.website ?? ""}
                  onChange={(value) => updateSetting("website", value)}
                  placeholder="https://votre-restaurant.fr"
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
                  type="tel"
                />
                <TextField
                  label="Email"
                  value={settings.email}
                  onChange={(value) => updateSetting("email", value)}
                  type="email"
                />
              </div>
            </div>

            <SettingsBlock
              title="Lien public principal"
              description="Ce lien servira de base aux QR de vos tables."
              tone="emerald"
            >
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <p className="break-all text-lg font-black text-slate-950">
                  {publicTableLink}
                </p>
                <p className="mt-3 break-words text-sm font-semibold leading-6 text-slate-500">
                  Chaque emplacement reprend ce lien avec son identifiant dédié.
                </p>
              </div>
              <div className="flex min-w-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void copyText(publicTableLink, "Lien public copié.")
                  }
                  className="min-h-11 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Copier le lien
                </button>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="min-h-11 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Générer le slug
                </button>
              </div>
            </SettingsBlock>
          </div>
        </SettingsCard>
      );
    }

    if (activeSection === "service") {
      return (
        <SettingsCard
          eyebrow="Pilotage du service"
          title="Service"
          description="Avant l’arrivée des clients, contrôlez l’ouverture des commandes et les créneaux réellement servis."
        >
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="min-w-0 space-y-5">
              <SettingsBlock
                title="Mode service"
                description="Le mode automatique suit vos horaires. Les modes forcés permettent à l’équipe d’agir immédiatement pendant le service."
                tone="emerald"
              >
                <SegmentedControl
                  label="Ouverture des commandes"
                  value={settings.serviceOpeningMode}
                  options={openingModes}
                  onChange={(value) =>
                    updateSetting("serviceOpeningMode", value)
                  }
                />
              </SettingsBlock>

              <SettingsBlock title="Repères opérationnels" tone="soft">
                <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                  <StatusTile
                    label="État client"
                    value={operationalStatus.customerState}
                  />
                  <StatusTile
                    label="Créneau actif"
                    value={operationalStatus.activeSlot}
                  />
                  <StatusTile
                    label="Prochain créneau"
                    value={operationalStatus.nextSlot}
                  />
                </div>
              </SettingsBlock>
            </div>

            <CustomerStateCard operationalStatus={operationalStatus} />
          </div>

          <div className="mt-6 min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 md:p-5">
            <div className="mb-4 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-black tracking-tight text-slate-950">
                  Planning hebdomadaire
                </h3>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-500">
                  Chaque journée distingue le service du midi et le service du
                  soir pour rester lisible en salle comme en cuisine.
                </p>
              </div>
              <div className="flex min-w-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyMondayToWeek}
                  className="min-h-11 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Copier lundi sur la semaine
                </button>
                <button
                  type="button"
                  onClick={closeSundays}
                  className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Fermer tous les dimanches
                </button>
                <button
                  type="button"
                  onClick={resetHours}
                  className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Réinitialiser les horaires
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {settings.hours.map((hour) => (
                <article
                  key={hour.day}
                  className={`grid min-w-0 gap-4 rounded-[1.5rem] border p-4 2xl:grid-cols-[minmax(150px,0.55fr)_minmax(180px,0.65fr)_minmax(0,1fr)_minmax(0,1fr)] 2xl:items-center ${
                    hour.open
                      ? "border-slate-200 bg-white"
                      : "border-slate-200 bg-slate-50/80"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p
                        className={`whitespace-nowrap text-base font-black ${hour.open ? "text-slate-950" : "text-slate-500"}`}
                      >
                        {hour.day}
                      </p>
                      {getDayBadge(hour)}
                    </div>
                    <p className="mt-1 break-words text-xs font-bold text-slate-500">
                      {hour.open
                        ? "Service planifié"
                        : "Aucune prise de commandes"}
                    </p>
                  </div>
                  <ToggleRow
                    label="Jour ouvert"
                    helper={
                      hour.open
                        ? "Commandes selon les créneaux"
                        : "Service fermé"
                    }
                    checked={hour.open}
                    onChange={(checked) =>
                      updateHour(hour.day, { open: checked })
                    }
                  />
                  <div className={hour.open ? "min-w-0" : "min-w-0 opacity-55"}>
                    <TimeRangeEditor
                      title="Service du midi"
                      hour={hour}
                      onChange={(patch) => updateHour(hour.day, patch)}
                    />
                  </div>
                  <div className={hour.open ? "min-w-0" : "min-w-0 opacity-55"}>
                    <TimeRangeEditor
                      title="Service du soir"
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
          eyebrow="Traitement des commandes"
          title="Commandes"
          description="Définissez comment l’équipe valide, encaisse et fait avancer les commandes reçues depuis les QR."
        >
          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <SettingsBlock
              title="Validation des commandes"
              description="Nous recommandons de valider les commandes manuellement pendant les premiers services."
              tone="emerald"
            >
              <ToggleRow
                label="Validation manuelle recommandée"
                helper="L’équipe accepte chaque commande avant préparation."
                checked={!settings.orderAutoAccept}
                onChange={(checked) =>
                  updateSetting("orderAutoAccept", !checked)
                }
              />
              <ToggleRow
                label="Acceptation automatique"
                helper="À réserver aux services parfaitement rodés."
                checked={settings.orderAutoAccept}
                onChange={(checked) =>
                  updateSetting("orderAutoAccept", checked)
                }
              />
            </SettingsBlock>

            <SettingsBlock
              title="Règlement"
              description="TableFlash ne déclenche aucun paiement en ligne. Le règlement reste physique."
              tone="soft"
            >
              <ToggleRow
                label="Paiement au comptoir ou auprès du serveur"
                checked={!settings.requirePaymentBeforePreparation}
                onChange={(checked) =>
                  updateSetting("requirePaymentBeforePreparation", !checked)
                }
              />
              <ToggleRow
                label="Paiement requis avant préparation"
                helper="Rappelle à l’équipe d’encaisser sur place avant la cuisine."
                checked={settings.requirePaymentBeforePreparation}
                onChange={(checked) =>
                  updateSetting("requirePaymentBeforePreparation", checked)
                }
              />
              <TextAreaField
                label="Message de règlement"
                value={settings.paymentMessage}
                onChange={(value) => updateSetting("paymentMessage", value)}
              />
            </SettingsBlock>

            <SettingsBlock
              title="Suivi client"
              description="Le client suit sa commande sans solliciter l’équipe."
            >
              <ToggleRow
                label="Afficher l’avancement au client"
                checked={settings.showPreparationTracking}
                onChange={(checked) =>
                  updateSetting("showPreparationTracking", checked)
                }
              />
              <ToggleRow
                label="Afficher l’état prêt / servi"
                checked={settings.showOpenServiceBadge}
                onChange={(checked) =>
                  updateSetting("showOpenServiceBadge", checked)
                }
              />
              <ToggleRow
                label="Autoriser les notes clients"
                checked={settings.allowCustomerNotes}
                onChange={(checked) =>
                  updateSetting("allowCustomerNotes", checked)
                }
              />
            </SettingsBlock>

            <SettingsBlock title="Process recommandé" tone="emerald">
              <ol className="space-y-3">
                {[
                  "Accepter la commande",
                  "Encaisser sur place",
                  "Lancer la préparation",
                  "Marquer prête",
                  "Marquer servie",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex min-w-0 items-center gap-3 rounded-2xl bg-white px-4 py-3"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <span className="break-words text-sm font-black text-slate-900">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </SettingsBlock>
          </div>
        </SettingsCard>
      );
    }

    if (activeSection === "qr") {
      return (
        <SettingsCard
          eyebrow="QR par table"
          title="QR"
          description="Préparez une fiche QR premium unique, lisible à l’impression, puis organisez les zones de service."
        >
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-5">
              <SettingsBlock title="Fiche QR imprimée" tone="emerald">
                <TextAreaField
                  label="Instruction QR"
                  value={settings.qrInstruction}
                  onChange={(value) => updateSetting("qrInstruction", value)}
                  rows={2}
                />
                <ToggleRow
                  label="Afficher le nom de l’emplacement"
                  checked={settings.qrShowLocationName}
                  onChange={(checked) =>
                    updateSetting("qrShowLocationName", checked)
                  }
                />
                <ToggleRow
                  label="Afficher le lien public"
                  checked={settings.qrShowPublicLink}
                  onChange={(checked) =>
                    updateSetting("qrShowPublicLink", checked)
                  }
                />
              </SettingsBlock>

              <SettingsBlock
                title="Zones de service"
                description="Salle, terrasse, comptoir ou espaces temporaires peuvent chacun recevoir leurs emplacements QR."
              >
                <div className="space-y-3">
                  {settings.zones.map((zone) => (
                    <article
                      key={zone.id}
                      className="grid min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                    >
                      <TextField
                        label="Nom de zone"
                        value={zone.name}
                        onChange={(value) =>
                          updateZone(zone.id, { name: value })
                        }
                      />
                      <div className="flex min-w-0 flex-wrap gap-2 md:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            updateZone(zone.id, { enabled: !zone.enabled })
                          }
                          className={`min-h-11 rounded-full px-4 py-2 text-sm font-black transition ${
                            zone.enabled
                              ? "bg-emerald-700 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {zone.enabled ? "Active" : "Désactivée"}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteZone(zone.id)}
                          className="min-h-11 rounded-full border border-rose-200 px-4 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addZone}
                  className="min-h-11 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Ajouter une zone
                </button>
              </SettingsBlock>

              <SettingsBlock
                title="Conseil impression"
                description="Imprimez un QR par table ou emplacement. Chaque QR conserve son lien dédié pour suivre les commandes correctement."
                tone="soft"
              >
                <div className="flex min-w-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openTablesPage}
                    className="min-h-11 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                  >
                    Voir QR par table
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void copyText(
                        settings.qrInstruction,
                        "Instruction QR copiée.",
                      )
                    }
                    className="min-h-11 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    Copier instruction QR
                  </button>
                </div>
              </SettingsBlock>
            </div>

            <QrPreview settings={settings} />
          </div>
        </SettingsCard>
      );
    }

    if (activeSection === "reviews") {
      return (
        <SettingsCard
          eyebrow="Réputation"
          title="Avis"
          description="Cadrez l’invitation après repas et gardez les retours utiles au bon endroit pour protéger votre image sans automatisme opaque."
        >
          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <SettingsBlock
              title="Après repas"
              description="L’invitation apparaît uniquement lorsque le repas est terminé, sans interrompre le client."
              tone="emerald"
            >
              <ToggleRow
                label="Autoriser les avis après repas"
                checked={settings.allowReviewsAfterMeal}
                onChange={(checked) =>
                  updateSetting("allowReviewsAfterMeal", checked)
                }
              />
            </SettingsBlock>

            <SettingsBlock
              title="Satisfaction"
              description="Les clients satisfaits peuvent être orientés vers votre lien Google Avis. Aucune publication automatique n’est effectuée."
              tone="soft"
            >
              <ToggleRow
                label="Suggérer Google Avis aux clients satisfaits"
                checked={settings.suggestGoogleForPositiveReviews}
                onChange={(checked) =>
                  updateSetting("suggestGoogleForPositiveReviews", checked)
                }
              />
            </SettingsBlock>

            <SettingsBlock title="Google Avis">
              <TextField
                label="Lien Google Avis"
                value={settings.googleReviewUrl}
                onChange={(value) => updateSetting("googleReviewUrl", value)}
                placeholder="https://g.page/r/.../review"
              />
              <div className="flex min-w-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyGoogleReviewLink}
                  className="min-h-11 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Copier le lien
                </button>
                <button
                  type="button"
                  onClick={testGoogleReviewLink}
                  className="min-h-11 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Tester le lien
                </button>
              </div>
            </SettingsBlock>

            <SettingsBlock title="Protection de l’image" tone="emerald">
              <div className="rounded-[1.5rem] bg-white p-5">
                <p className="break-words text-xl font-black text-slate-950">
                  Les retours moins favorables restent visibles dans votre
                  tableau de bord afin de pouvoir réagir avant qu’ils ne
                  deviennent publics.
                </p>
                <p className="mt-3 break-words text-sm font-semibold leading-6 text-slate-500">
                  TableFlash aide l’équipe à traiter les retours après repas
                  sans masquer les avis ni publier automatiquement à la place du
                  client.
                </p>
              </div>
            </SettingsBlock>
          </div>
        </SettingsCard>
      );
    }

    return (
      <SettingsCard
        eyebrow="Expérience client"
        title="Expérience client"
        description="Préparez les messages visibles par le client et une identité visuelle simple, cohérente avec vos QR premium."
      >
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 space-y-5">
            <SettingsBlock title="Message d’accueil" tone="emerald">
              <TextAreaField
                label="Message d’accueil"
                value={settings.publicWelcomeMessage}
                onChange={(value) =>
                  updateSetting("publicWelcomeMessage", value)
                }
              />
            </SettingsBlock>

            <SettingsBlock title="Message de règlement" tone="soft">
              <TextAreaField
                label="Message de règlement"
                value={settings.paymentMessage}
                onChange={(value) => updateSetting("paymentMessage", value)}
              />
            </SettingsBlock>

            <SettingsBlock title="Instruction QR">
              <TextAreaField
                label="Instruction QR"
                value={settings.qrInstruction}
                onChange={(value) => updateSetting("qrInstruction", value)}
                rows={2}
              />
            </SettingsBlock>

            <SettingsBlock title="Identité visuelle" tone="emerald">
              <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                {primaryColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateSetting("primaryColor", color)}
                    className={`flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      settings.primaryColor === color
                        ? "border-emerald-500 bg-white shadow-lg shadow-emerald-900/10"
                        : "border-slate-200 bg-white hover:border-emerald-200"
                    }`}
                  >
                    <span
                      className={`h-9 w-9 shrink-0 rounded-full ${colorSwatch[color]}`}
                    />
                    <span className="min-w-0 break-words text-sm font-black text-slate-900">
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </SettingsBlock>
          </div>

          <CustomerPreview settings={settings} previewRef={previewRef} />
        </div>
      </SettingsCard>
    );
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Paramètres"
        subtitle="Avant le service, vérifiez que l’établissement, les QR, les commandes et l’expérience client sont prêts."
      >
        <button
          type="button"
          onClick={saveSettings}
          className="min-h-11 rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={previewSettings}
          className="min-h-11 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
        >
          Prévisualiser
        </button>
        <button
          type="button"
          onClick={resetSettings}
          className="min-h-11 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50"
        >
          Réinitialiser
        </button>
      </DashboardHeader>

      <main className="flex-1 overflow-x-hidden bg-slate-50/70 p-4 sm:p-5 lg:p-8">
        <div className="mx-auto min-w-0 max-w-[1500px] space-y-6">
          <ReadinessOverview
            score={readinessScore}
            checklist={readinessItems}
            saveState={saveState}
            operationalStatus={operationalStatus}
          />
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
