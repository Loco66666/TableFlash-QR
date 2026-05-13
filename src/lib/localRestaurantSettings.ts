export const LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY =
  "tableflash.localRestaurantSettings.v1";

export type RestaurantSettings = {
  restaurantName: string;
  publicSlug: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  serviceStatus: "Ouvert" | "En pause" | "Fermé";
  serviceMode: "Service midi" | "Service soir" | "Toute la journée";
  serviceOpeningMode:
    | "Automatique selon les horaires"
    | "Forcer ouvert"
    | "Mettre en pause"
    | "Forcer fermé";
  paymentMessage: string;
  publicWelcomeMessage: string;
  googleReviewUrl: string;
  primaryColor: "Émeraude" | "Noir premium" | "Sable" | "Bleu nuit";
  qrInstruction: string;
  publicWelcomeTitle: string;
  interfaceContrast: "Doux" | "Équilibré" | "Marqué";
  ambienceStyle:
    | "Brasserie élégante"
    | "Comptoir moderne"
    | "Maison chaleureuse";
  qrShowLocationName: boolean;
  qrShowPublicLink: boolean;
  qrShowTableFlashMention: boolean;
  orderAutoAccept: boolean;
  requirePaymentBeforePreparation: boolean;
  showPreparationTracking: boolean;
  allowCustomerNotes: boolean;
  blockOrdersWhenClosed: boolean;
  showClosedMessage: boolean;
  warnPendingOrder: boolean;
  allowReviewsAfterMeal: boolean;
  reviewSoftInviteOnlyAfterServed: boolean;
  keepNegativeReviewsInternal: boolean;
  flagReviewsToHandle: boolean;
  showRecentReviewsDashboard: boolean;
  suggestGoogleForPositiveReviews: boolean;
  clientPromise: string;
  showOpenServiceBadge: boolean;
  showAllergens: boolean;
  showUnavailableItems: boolean;
  allowProductNotes: boolean;
  allowOrderGlobalNote: boolean;
  showThankYouMessage: boolean;
  zones: Array<{
    id: string;
    name: string;
    enabled: boolean;
  }>;
  hours: Array<{
    day: string;
    open: boolean;
    lunchStart: string;
    lunchEnd: string;
    dinnerStart: string;
    dinnerEnd: string;
  }>;
};

export const defaultRestaurantSettings: RestaurantSettings = {
  restaurantName: "Le Bistrot des Halles",
  publicSlug: "le-bistrot-des-halles",
  address: "12 rue des Halles",
  city: "Bayonne",
  postalCode: "64100",
  phone: "05 59 00 00 00",
  email: "contact@lebistrotdeshalles.fr",
  website: "",
  serviceStatus: "Ouvert",
  serviceMode: "Service midi",
  serviceOpeningMode: "Automatique selon les horaires",
  paymentMessage: "Paiement à la caisse ou auprès du serveur.",
  publicWelcomeMessage:
    "Commandez simplement depuis votre table, nous nous occupons du reste.",
  googleReviewUrl: "https://g.page/r/tableflash/review",
  primaryColor: "Émeraude",
  qrInstruction: "Scannez pour consulter le menu et commander.",
  publicWelcomeTitle: "Bienvenue à table",
  interfaceContrast: "Équilibré",
  ambienceStyle: "Brasserie élégante",
  qrShowLocationName: true,
  qrShowPublicLink: true,
  qrShowTableFlashMention: true,
  orderAutoAccept: false,
  requirePaymentBeforePreparation: true,
  showPreparationTracking: true,
  allowCustomerNotes: true,
  blockOrdersWhenClosed: true,
  showClosedMessage: true,
  warnPendingOrder: true,
  allowReviewsAfterMeal: true,
  reviewSoftInviteOnlyAfterServed: true,
  keepNegativeReviewsInternal: true,
  flagReviewsToHandle: true,
  showRecentReviewsDashboard: true,
  suggestGoogleForPositiveReviews: true,
  clientPromise: "Commandez à votre rythme",
  showOpenServiceBadge: true,
  showAllergens: true,
  showUnavailableItems: true,
  allowProductNotes: true,
  allowOrderGlobalNote: true,
  showThankYouMessage: true,
  zones: [
    { id: "zone-salle", name: "Salle", enabled: true },
    { id: "zone-terrasse", name: "Terrasse", enabled: true },
    { id: "zone-comptoir", name: "Comptoir", enabled: true },
  ],
  hours: [
    {
      day: "Lundi",
      open: true,
      lunchStart: "11:30",
      lunchEnd: "14:30",
      dinnerStart: "18:30",
      dinnerEnd: "22:30",
    },
    {
      day: "Mardi",
      open: true,
      lunchStart: "11:30",
      lunchEnd: "14:30",
      dinnerStart: "18:30",
      dinnerEnd: "22:30",
    },
    {
      day: "Mercredi",
      open: true,
      lunchStart: "11:30",
      lunchEnd: "14:30",
      dinnerStart: "18:30",
      dinnerEnd: "22:30",
    },
    {
      day: "Jeudi",
      open: true,
      lunchStart: "11:30",
      lunchEnd: "14:30",
      dinnerStart: "18:30",
      dinnerEnd: "22:30",
    },
    {
      day: "Vendredi",
      open: true,
      lunchStart: "11:30",
      lunchEnd: "14:30",
      dinnerStart: "18:30",
      dinnerEnd: "23:00",
    },
    {
      day: "Samedi",
      open: true,
      lunchStart: "11:30",
      lunchEnd: "15:00",
      dinnerStart: "18:30",
      dinnerEnd: "23:00",
    },
    {
      day: "Dimanche",
      open: false,
      lunchStart: "11:30",
      lunchEnd: "14:30",
      dinnerStart: "18:30",
      dinnerEnd: "22:30",
    },
  ],
};

function mergeWithDefaults(
  value: Partial<RestaurantSettings>,
): RestaurantSettings {
  return {
    ...defaultRestaurantSettings,
    ...value,
    website: value.website ?? defaultRestaurantSettings.website,
    zones:
      Array.isArray(value.zones) && value.zones.length > 0
        ? value.zones
        : defaultRestaurantSettings.zones,
    hours:
      Array.isArray(value.hours) && value.hours.length > 0
        ? value.hours
        : defaultRestaurantSettings.hours,
  };
}

export function getLocalRestaurantSettings(): RestaurantSettings {
  if (typeof window === "undefined") {
    return defaultRestaurantSettings;
  }

  try {
    const storedSettings = window.localStorage.getItem(
      LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY,
    );

    if (!storedSettings) {
      return defaultRestaurantSettings;
    }

    const parsedSettings = JSON.parse(
      storedSettings,
    ) as Partial<RestaurantSettings>;
    return mergeWithDefaults(parsedSettings);
  } catch {
    return defaultRestaurantSettings;
  }
}

export function saveLocalRestaurantSettings(settings: RestaurantSettings) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings),
    );
  } catch {
    return;
  }
}

export function resetLocalRestaurantSettings(): RestaurantSettings {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY);
    } catch {
      return defaultRestaurantSettings;
    }
  }

  return defaultRestaurantSettings;
}
