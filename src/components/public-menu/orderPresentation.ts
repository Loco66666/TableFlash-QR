import type { LocalOrderStatus, LocalPaymentStatus } from "@/lib/localOrders";

export type PublicTrackingStep = {
  label: string;
};

export type PublicTrackingStepState = "completed" | "current" | "upcoming";

export type PublicOrderPresentationModel = {
  currentStep: LocalOrderStatus;
  displayTitle: string;
  displaySubtitle: string;
  operationalLabel: string | null;
  paymentLabel: string | null;
  nextStepLabel: string | null;
  showPaymentReminder: boolean;
  showReviewInvite: boolean;
  showReviewThanks: boolean;
  showBottomActions: boolean;
  trackerStep: number | null;
  trackerCompletedSteps: number;
  isStopped: boolean;
};

export const publicTrackingSteps: PublicTrackingStep[] = [
  { label: "Commande" },
  { label: "Validation" },
  { label: "Règlement" },
  { label: "Préparation" },
  { label: "Service" },
];

type PresentationInput = {
  status: LocalOrderStatus;
  paymentStatus: LocalPaymentStatus;
  hasSubmittedReview: boolean;
};

function isPaid(paymentStatus: LocalPaymentStatus) {
  return paymentStatus === "Payée";
}

function getPaymentLabel(
  paymentStatus: LocalPaymentStatus,
  status: LocalOrderStatus,
) {
  if (
    paymentStatus === "Annulée" ||
    status === "Refusée" ||
    status === "Annulée"
  ) {
    return null;
  }

  return isPaid(paymentStatus) ? "Règlement confirmé" : "À régler sur place";
}

function isPaymentReminderUseful() {
  return false;
}

export function getPublicOrderPresentation({
  status,
  paymentStatus,
  hasSubmittedReview,
}: PresentationInput): PublicOrderPresentationModel {
  const paymentLabel = getPaymentLabel(paymentStatus, status);
  const paymentIsConfirmed = isPaid(paymentStatus);
  const showPaymentReminder = isPaymentReminderUseful();

  switch (status) {
    case "Nouvelle":
      return {
        currentStep: status,
        displayTitle: "Commande reçue",
        displaySubtitle: "Votre commande a bien été transmise au restaurant.",
        operationalLabel: "Commande reçue",
        paymentLabel,
        nextStepLabel: "L’équipe va la valider dans quelques instants.",
        showPaymentReminder,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: 1,
        trackerCompletedSteps: 0,
        isStopped: false,
      };
    case "Acceptée":
      return {
        currentStep: status,
        displayTitle: "Validation en cours",
        displaySubtitle: "L’équipe a bien pris votre commande en compte.",
        operationalLabel: "Validation en cours",
        paymentLabel,
        nextStepLabel: paymentIsConfirmed
          ? "La préparation peut commencer."
          : "Le règlement pourra se faire à la caisse ou auprès du serveur.",
        showPaymentReminder,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: paymentIsConfirmed ? null : 2,
        trackerCompletedSteps: paymentIsConfirmed ? 3 : 1,
        isStopped: false,
      };
    case "À payer":
      return {
        currentStep: status,
        displayTitle: "Règlement sur place",
        displaySubtitle:
          "Le règlement pourra se faire à la caisse ou auprès du serveur.",
        operationalLabel: "Règlement sur place",
        paymentLabel: "À régler sur place",
        nextStepLabel:
          "Une fois le règlement confirmé, la préparation pourra commencer.",
        showPaymentReminder: false,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: 3,
        trackerCompletedSteps: 2,
        isStopped: false,
      };
    case "Payée":
      return {
        currentStep: status,
        displayTitle: "Règlement confirmé",
        displaySubtitle: "Votre règlement a bien été pris en compte.",
        operationalLabel: "Validation terminée",
        paymentLabel: "Règlement confirmé",
        nextStepLabel: "La préparation peut désormais commencer.",
        showPaymentReminder: false,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: null,
        trackerCompletedSteps: 3,
        isStopped: false,
      };
    case "En préparation":
      return {
        currentStep: status,
        displayTitle: "En préparation",
        displaySubtitle: "L’équipe prépare actuellement votre commande.",
        operationalLabel: "En préparation",
        paymentLabel: "Règlement confirmé",
        nextStepLabel: "Vous serez informé lorsque votre commande sera prête.",
        showPaymentReminder: false,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: 4,
        trackerCompletedSteps: 3,
        isStopped: false,
      };
    case "Prête":
      return {
        currentStep: status,
        displayTitle: "Commande prête",
        displaySubtitle: "Votre commande est prête à être servie.",
        operationalLabel: "Prête",
        paymentLabel,
        nextStepLabel: "Un membre de l’équipe va vous l’apporter.",
        showPaymentReminder,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: 5,
        trackerCompletedSteps: 4,
        isStopped: false,
      };
    case "Servie":
      return {
        currentStep: status,
        displayTitle: "Commande servie",
        displaySubtitle:
          "Merci pour votre commande. Nous espérons que tout s’est bien passé.",
        operationalLabel: "Servie",
        paymentLabel: paymentIsConfirmed ? null : paymentLabel,
        nextStepLabel: null,
        showPaymentReminder: false,
        showReviewInvite: !hasSubmittedReview,
        showReviewThanks: hasSubmittedReview,
        showBottomActions: true,
        trackerStep: null,
        trackerCompletedSteps: 5,
        isStopped: false,
      };
    case "Refusée":
      return {
        currentStep: status,
        displayTitle: "Commande non retenue",
        displaySubtitle:
          "La commande n’a pas pu être prise en charge par le restaurant.",
        operationalLabel: "Non retenue",
        paymentLabel: null,
        nextStepLabel:
          "Rapprochez-vous de l’équipe en salle pour choisir une alternative.",
        showPaymentReminder: false,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: null,
        trackerCompletedSteps: 0,
        isStopped: true,
      };
    case "Annulée":
      return {
        currentStep: status,
        displayTitle: "Commande annulée",
        displaySubtitle: "Cette commande a été annulée.",
        operationalLabel: "Annulée",
        paymentLabel: null,
        nextStepLabel:
          "L’équipe reste disponible si vous souhaitez repasser commande.",
        showPaymentReminder: false,
        showReviewInvite: false,
        showReviewThanks: false,
        showBottomActions: true,
        trackerStep: null,
        trackerCompletedSteps: 0,
        isStopped: true,
      };
  }
}

export function getPublicTrackingStepState(
  presentation: PublicOrderPresentationModel,
  stepNumber: number,
): PublicTrackingStepState {
  if (stepNumber <= presentation.trackerCompletedSteps) {
    return "completed";
  }

  if (presentation.trackerStep === stepNumber) {
    return "current";
  }

  return "upcoming";
}
