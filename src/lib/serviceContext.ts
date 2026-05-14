import type { RestaurantSettings } from "@/lib/localRestaurantSettings";

export type ServiceContextStatus = "open" | "paused" | "closed" | "between-services";
export type ActiveServicePeriod = "midi" | "soir" | "all-day" | "none";

export type CurrentServiceContext = {
  status: ServiceContextStatus;
  activePeriod: ActiveServicePeriod;
  label: string;
  startTime: string | null;
  endTime: string | null;
  nextServiceLabel: string | null;
  nextServiceStart: string | null;
  currentDayOpen: boolean;
  message: string;
};

type OpeningHour = RestaurantSettings["hours"][number];

type ServiceSlot = {
  period: Exclude<ActiveServicePeriod, "none">;
  label: string;
  startTime: string;
  endTime: string;
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

function toMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function getDayLabel(date: Date) {
  return dayOrder[date.getDay()];
}

function getSlotsForDay(settings: RestaurantSettings, dayHours?: OpeningHour): ServiceSlot[] {
  if (!dayHours?.open) {
    return [];
  }

  if (settings.serviceMode === "Toute la journée") {
    return [
      {
        period: "all-day",
        label: "Service en continu",
        startTime: dayHours.lunchStart,
        endTime: dayHours.dinnerEnd,
      },
    ];
  }

  return [
    {
      period: "midi",
      label: "Service midi",
      startTime: dayHours.lunchStart,
      endTime: dayHours.lunchEnd,
    },
    {
      period: "soir",
      label: "Service soir",
      startTime: dayHours.dinnerStart,
      endTime: dayHours.dinnerEnd,
    },
  ];
}

function findNextService(settings: RestaurantSettings, now: Date) {
  const currentDayIndex = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset < 8; offset += 1) {
    const dayName = dayOrder[(currentDayIndex + offset) % 7];
    const dayHours = settings.hours.find((hour) => hour.day === dayName);
    const nextSlot = getSlotsForDay(settings, dayHours).find(
      (slot) => offset > 0 || toMinutes(slot.startTime) > nowMinutes,
    );

    if (!nextSlot) {
      continue;
    }

    const dayPrefix = offset === 0 ? "" : offset === 1 ? " demain" : ` ${dayName.toLowerCase()}`;

    return {
      label: `${nextSlot.label}${dayPrefix}`,
      startTime: nextSlot.startTime,
    };
  }

  return { label: null, startTime: null };
}

function getForcedOpenSlot(settings: RestaurantSettings, todayHours?: OpeningHour): ServiceSlot | null {
  const slots = getSlotsForDay(settings, todayHours);

  if (slots.length > 0) {
    return slots[0];
  }

  return null;
}

export function getCurrentServiceContext(
  settings: RestaurantSettings,
  now: Date,
): CurrentServiceContext {
  const todayHours = settings.hours.find((hour) => hour.day === getDayLabel(now));
  const currentDayOpen = Boolean(todayHours?.open);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nextService = findNextService(settings, now);

  if (settings.serviceOpeningMode === "Mettre en pause" || settings.serviceStatus === "En pause") {
    return {
      status: "paused",
      activePeriod: "none",
      label: "Service en pause",
      startTime: null,
      endTime: null,
      nextServiceLabel: nextService.label,
      nextServiceStart: nextService.startTime,
      currentDayOpen,
      message: "Les commandes QR sont temporairement suspendues.",
    };
  }

  if (settings.serviceOpeningMode === "Forcer fermé" || settings.serviceStatus === "Fermé") {
    return {
      status: "closed",
      activePeriod: "none",
      label: "Restaurant fermé",
      startTime: null,
      endTime: null,
      nextServiceLabel: nextService.label,
      nextServiceStart: nextService.startTime,
      currentDayOpen,
      message: "Les statistiques affichent le dernier service disponible.",
    };
  }

  if (settings.serviceOpeningMode === "Forcer ouvert") {
    const forcedSlot = getForcedOpenSlot(settings, todayHours);

    return {
      status: "open",
      activePeriod: forcedSlot?.period ?? "none",
      label: forcedSlot?.period === "all-day" ? "Service en continu" : forcedSlot?.period === "soir" ? "Service soir en cours" : "Service midi en cours",
      startTime: forcedSlot?.startTime ?? null,
      endTime: forcedSlot?.endTime ?? null,
      nextServiceLabel: nextService.label,
      nextServiceStart: nextService.startTime,
      currentDayOpen,
      message: "Commandes ouvertes",
    };
  }

  const slots = getSlotsForDay(settings, todayHours);
  const activeSlot = slots.find(
    (slot) => nowMinutes >= toMinutes(slot.startTime) && nowMinutes <= toMinutes(slot.endTime),
  );

  if (activeSlot) {
    return {
      status: "open",
      activePeriod: activeSlot.period,
      label: activeSlot.period === "all-day" ? "Service en continu" : `${activeSlot.label} en cours`,
      startTime: activeSlot.startTime,
      endTime: activeSlot.endTime,
      nextServiceLabel: nextService.label,
      nextServiceStart: nextService.startTime,
      currentDayOpen,
      message: "Commandes ouvertes",
    };
  }

  if (currentDayOpen && nextService.label && nextService.startTime) {
    return {
      status: "between-services",
      activePeriod: "none",
      label: "Entre deux services",
      startTime: null,
      endTime: null,
      nextServiceLabel: nextService.label,
      nextServiceStart: nextService.startTime,
      currentDayOpen,
      message: `Prochain service : ${nextService.label.toLowerCase()} à ${nextService.startTime}`,
    };
  }

  return {
    status: "closed",
    activePeriod: "none",
    label: "Restaurant fermé",
    startTime: null,
    endTime: null,
    nextServiceLabel: nextService.label,
    nextServiceStart: nextService.startTime,
    currentDayOpen,
    message: "Les statistiques affichent le dernier service disponible.",
  };
}

export function getTodayServiceHours(
  settings: RestaurantSettings,
  now: Date,
  period: "midi" | "soir" | "all-day",
) {
  const todayHours = settings.hours.find((hour) => hour.day === getDayLabel(now));

  if (!todayHours?.open) {
    return null;
  }

  if (period === "midi") {
    return {
      period,
      label: "Service midi",
      startTime: todayHours.lunchStart,
      endTime: todayHours.lunchEnd,
    };
  }

  if (period === "soir") {
    return {
      period,
      label: "Service soir",
      startTime: todayHours.dinnerStart,
      endTime: todayHours.dinnerEnd,
    };
  }

  return {
    period,
    label: "Service en continu",
    startTime: todayHours.lunchStart,
    endTime: todayHours.dinnerEnd,
  };
}
