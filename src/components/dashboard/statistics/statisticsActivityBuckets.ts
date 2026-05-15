import {
  defaultRestaurantSettings,
  type RestaurantSettings,
} from "@/lib/localRestaurantSettings";
import type { CurrentServiceContext } from "@/lib/serviceContext";
import type { AnalyticsOrder, StatisticsPeriod } from "./statisticsData";

export type StatisticsServiceHours = {
  startTime: string;
  endTime: string;
} | null;

export type StatisticsServiceHoursConfig = {
  today: StatisticsServiceHours;
  lunch: StatisticsServiceHours;
  dinner: StatisticsServiceHours;
  usesAllDayHours: boolean;
};

export type ActivityBucket = {
  label: string;
  orders: number;
  sales: number;
};

export const fallbackStatisticsServiceHours: {
  today: NonNullable<StatisticsServiceHours>;
  lunch: NonNullable<StatisticsServiceHours>;
  dinner: NonNullable<StatisticsServiceHours>;
  usesAllDayHours: boolean;
} = {
  today: { startTime: "11:30", endTime: "22:30" },
  lunch: { startTime: "11:30", endTime: "14:30" },
  dinner: { startTime: "18:30", endTime: "22:30" },
  usesAllDayHours: false,
};

const dailyBucketLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const monthlyBucketLabels = [
  "Semaine 1",
  "Semaine 2",
  "Semaine 3",
  "Semaine 4",
];
const dayOrder = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const averageOrderValue = 18;

function parseServiceTime(value: string | null) {
  if (!value) {
    return null;
  }

  const [rawHours = "", rawMinutes = ""] = value.split(":");
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return Math.max(0, Math.min(23 * 60 + 59, hours * 60 + minutes));
}

function formatHourLabel(hour: number) {
  return `${hour}h`;
}

function buildHourLabelsForRange(hours: StatisticsServiceHours) {
  const startMinutes = parseServiceTime(hours?.startTime ?? null);
  const endMinutes = parseServiceTime(hours?.endTime ?? null);

  if (startMinutes === null || endMinutes === null) {
    return [];
  }

  const startHour = Math.floor(startMinutes / 60);
  const endHour = Math.floor(endMinutes / 60);

  if (endMinutes < startMinutes) {
    return [
      ...Array.from({ length: 24 - startHour }, (_, index) =>
        formatHourLabel(startHour + index),
      ),
      ...Array.from({ length: endHour + 1 }, (_, index) =>
        formatHourLabel(index),
      ),
    ];
  }

  return Array.from(
    { length: Math.max(1, endHour - startHour + 1) },
    (_, index) => formatHourLabel(startHour + index),
  );
}

function getOrderHourLabel(time: string) {
  const parsedMinutes = parseServiceTime(time);

  if (parsedMinutes === null) {
    return "12h";
  }

  return formatHourLabel(Math.floor(parsedMinutes / 60));
}

function normalizeHours(
  hours: StatisticsServiceHours,
  fallback: NonNullable<StatisticsServiceHours>,
) {
  return hours?.startTime && hours.endTime ? hours : fallback;
}

function getTodayHoursFromServices(serviceHours: StatisticsServiceHoursConfig) {
  if (serviceHours.usesAllDayHours) {
    return normalizeHours(
      serviceHours.today,
      fallbackStatisticsServiceHours.today,
    );
  }

  const lunch = normalizeHours(
    serviceHours.lunch,
    fallbackStatisticsServiceHours.lunch,
  );
  const dinner = normalizeHours(
    serviceHours.dinner,
    fallbackStatisticsServiceHours.dinner,
  );

  return {
    startTime: lunch.startTime,
    endTime: dinner.endTime,
  };
}

function getLabelsForPeriod(
  period: StatisticsPeriod,
  serviceHours: StatisticsServiceHoursConfig,
  serviceContext: CurrentServiceContext | null,
) {
  if (period === "7d") {
    return dailyBucketLabels;
  }

  if (period === "30d") {
    return monthlyBucketLabels;
  }

  if (period === "lunch") {
    return buildHourLabelsForRange(
      normalizeHours(serviceHours.lunch, fallbackStatisticsServiceHours.lunch),
    );
  }

  if (period === "dinner") {
    return buildHourLabelsForRange(
      normalizeHours(
        serviceHours.dinner,
        fallbackStatisticsServiceHours.dinner,
      ),
    );
  }

  if (period === "current" && serviceContext?.status === "open") {
    if (serviceContext.activePeriod === "midi") {
      return buildHourLabelsForRange(
        normalizeHours(
          serviceHours.lunch,
          fallbackStatisticsServiceHours.lunch,
        ),
      );
    }

    if (serviceContext.activePeriod === "soir") {
      return buildHourLabelsForRange(
        normalizeHours(
          serviceHours.dinner,
          fallbackStatisticsServiceHours.dinner,
        ),
      );
    }
  }

  return buildHourLabelsForRange(getTodayHoursFromServices(serviceHours));
}

function baseOrdersForLabel(
  label: string,
  period: StatisticsPeriod,
  index: number,
) {
  if (period === "7d") {
    return [18, 22, 19, 26, 31, 34, 16][index] ?? 12;
  }

  if (period === "30d") {
    return [82, 96, 118, 104][index] ?? 80;
  }

  const hour = Number(label.replace("h", ""));

  if (period === "dinner") {
    const dinnerPattern: Record<number, number> = {
      18: 4,
      19: 7,
      20: 10,
      21: 8,
      22: 5,
      23: 3,
    };
    return dinnerPattern[hour] ?? 2;
  }

  if (period === "lunch") {
    const lunchPattern: Record<number, number> = {
      11: 5,
      12: 11,
      13: 8,
      14: 4,
      15: 2,
    };
    return lunchPattern[hour] ?? 2;
  }

  const todayPattern: Record<number, number> = {
    11: 5,
    12: 11,
    13: 8,
    14: 4,
    15: 1,
    16: 1,
    17: 2,
    18: 4,
    19: 7,
    20: 10,
    21: 8,
    22: 5,
    23: 3,
  };

  return todayPattern[hour] ?? 1;
}

function salesForOrders(
  orders: number,
  period: StatisticsPeriod,
  index: number,
) {
  const periodAdjustment = period === "30d" ? 1.08 : period === "7d" ? 1.03 : 1;
  const bucketAdjustment = 1 + (index % 3) * 0.04;

  return Math.round(
    orders * averageOrderValue * periodAdjustment * bucketAdjustment,
  );
}

export function buildStatisticsServiceHoursConfig(
  settings: RestaurantSettings,
  dayIndex?: number,
): StatisticsServiceHoursConfig {
  const selectedDay = typeof dayIndex === "number" ? dayOrder[dayIndex] : null;
  const selectedOpenDay = selectedDay
    ? settings.hours.find((hour) => hour.day === selectedDay && hour.open)
    : null;
  const firstOpenDay =
    selectedOpenDay ??
    settings.hours.find((hour) => hour.open) ??
    defaultRestaurantSettings.hours.find((hour) => hour.open);
  const lunch = firstOpenDay
    ? { startTime: firstOpenDay.lunchStart, endTime: firstOpenDay.lunchEnd }
    : fallbackStatisticsServiceHours.lunch;
  const dinner = firstOpenDay
    ? { startTime: firstOpenDay.dinnerStart, endTime: firstOpenDay.dinnerEnd }
    : fallbackStatisticsServiceHours.dinner;

  if (settings.serviceMode === "Toute la journée") {
    return {
      today: firstOpenDay
        ? {
            startTime: firstOpenDay.lunchStart,
            endTime: firstOpenDay.dinnerEnd,
          }
        : fallbackStatisticsServiceHours.today,
      lunch,
      dinner,
      usesAllDayHours: true,
    };
  }

  return {
    today: { startTime: lunch.startTime, endTime: dinner.endTime },
    lunch,
    dinner,
    usesAllDayHours: false,
  };
}

export function getActivityBuckets({
  period,
  serviceHours,
  serviceContext,
  orders,
}: {
  period: StatisticsPeriod;
  serviceHours: StatisticsServiceHoursConfig;
  serviceContext: CurrentServiceContext | null;
  orders: AnalyticsOrder[];
}): ActivityBucket[] {
  const labels = getLabelsForPeriod(period, serviceHours, serviceContext);

  return labels.map((label, index) => {
    const visibleOrders =
      period === "7d" || period === "30d"
        ? []
        : orders.filter(
            (order) =>
              getOrderHourLabel(order.hour) === label || order.hour === label,
          );
    const baseOrders = baseOrdersForLabel(label, period, index);
    const orderCount = Math.max(baseOrders, visibleOrders.length);
    const visibleSales = visibleOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    return {
      label,
      orders: orderCount,
      sales: Math.max(
        salesForOrders(orderCount, period, index),
        Math.round(visibleSales),
      ),
    };
  });
}
