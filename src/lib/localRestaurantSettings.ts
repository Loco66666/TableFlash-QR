export const LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY = "tableflash.localRestaurantSettings.v1";

export type RestaurantSettings = {
  restaurantName: string;
  publicSlug: string;
  legalName?: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  serviceStatus: "Ouvert" | "En pause" | "Fermé";
  serviceMode: "Service midi" | "Service soir" | "Toute la journée";
  paymentMessage: string;
  publicWelcomeMessage: string;
  googleReviewUrl: string;
  primaryColor: "Émeraude" | "Noir premium" | "Sable" | "Bleu nuit";
  qrStyle: "Classique" | "Premium" | "Minimal";
  qrInstruction: string;
  qrShowLocationName: boolean;
  qrShowPublicLink: boolean;
  orderAutoAccept: boolean;
  requirePaymentBeforePreparation: boolean;
  showPreparationTracking: boolean;
  allowCustomerNotes: boolean;
  allowReviewsAfterMeal: boolean;
  suggestGoogleForPositiveReviews: boolean;
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
  legalName: "Le Bistrot des Halles",
  address: "12 rue des Halles",
  city: "Bayonne",
  postalCode: "64100",
  phone: "05 59 00 00 00",
  email: "contact@lebistrotdeshalles.fr",
  website: "",
  serviceStatus: "Ouvert",
  serviceMode: "Service midi",
  paymentMessage: "Paiement à la caisse ou auprès du serveur.",
  publicWelcomeMessage: "Commandez simplement depuis votre table, nous nous occupons du reste.",
  googleReviewUrl: "https://g.page/r/tableflash-demo/review",
  primaryColor: "Émeraude",
  qrStyle: "Premium",
  qrInstruction: "Scannez pour consulter le menu et commander.",
  qrShowLocationName: true,
  qrShowPublicLink: true,
  orderAutoAccept: false,
  requirePaymentBeforePreparation: true,
  showPreparationTracking: true,
  allowCustomerNotes: true,
  allowReviewsAfterMeal: true,
  suggestGoogleForPositiveReviews: true,
  zones: [
    { id: "zone-salle", name: "Salle", enabled: true },
    { id: "zone-terrasse", name: "Terrasse", enabled: true },
    { id: "zone-comptoir", name: "Comptoir", enabled: true },
  ],
  hours: [
    { day: "Lundi", open: true, lunchStart: "11:30", lunchEnd: "14:30", dinnerStart: "18:30", dinnerEnd: "22:30" },
    { day: "Mardi", open: true, lunchStart: "11:30", lunchEnd: "14:30", dinnerStart: "18:30", dinnerEnd: "22:30" },
    { day: "Mercredi", open: true, lunchStart: "11:30", lunchEnd: "14:30", dinnerStart: "18:30", dinnerEnd: "22:30" },
    { day: "Jeudi", open: true, lunchStart: "11:30", lunchEnd: "14:30", dinnerStart: "18:30", dinnerEnd: "22:30" },
    { day: "Vendredi", open: true, lunchStart: "11:30", lunchEnd: "14:30", dinnerStart: "18:30", dinnerEnd: "23:00" },
    { day: "Samedi", open: true, lunchStart: "11:30", lunchEnd: "15:00", dinnerStart: "18:30", dinnerEnd: "23:00" },
    { day: "Dimanche", open: false, lunchStart: "11:30", lunchEnd: "14:30", dinnerStart: "18:30", dinnerEnd: "22:30" },
  ],
};

function mergeWithDefaults(value: Partial<RestaurantSettings>): RestaurantSettings {
  return {
    ...defaultRestaurantSettings,
    ...value,
    legalName: value.legalName ?? defaultRestaurantSettings.legalName,
    website: value.website ?? defaultRestaurantSettings.website,
    zones: Array.isArray(value.zones) && value.zones.length > 0 ? value.zones : defaultRestaurantSettings.zones,
    hours: Array.isArray(value.hours) && value.hours.length > 0 ? value.hours : defaultRestaurantSettings.hours,
  };
}

export function getLocalRestaurantSettings(): RestaurantSettings {
  if (typeof window === "undefined") {
    return defaultRestaurantSettings;
  }

  try {
    const storedSettings = window.localStorage.getItem(LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY);

    if (!storedSettings) {
      return defaultRestaurantSettings;
    }

    const parsedSettings = JSON.parse(storedSettings) as Partial<RestaurantSettings>;
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
    window.localStorage.setItem(LOCAL_RESTAURANT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
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
