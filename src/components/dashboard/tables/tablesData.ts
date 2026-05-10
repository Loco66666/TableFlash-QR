export type TableStatusFilter = "Tous" | "Actifs" | "Inactifs";
export type TableSortMode = "custom" | "name" | "zone" | "scans";

export type RestaurantTable = {
  createdAt: string;
  id: string;
  isActive: boolean;
  lastScanAt: string;
  name: string;
  ordersToday: number;
  publicUrl: string;
  scansToday: number;
  zone: string;
};

export const zoneFilters = ["Toutes", "Salle", "Terrasse", "Comptoir"] as const;
export type TableZoneFilter = (typeof zoneFilters)[number];

export const initialTables: RestaurantTable[] = [
  {
    id: "table-1",
    name: "Table 1",
    zone: "Salle",
    isActive: true,
    publicUrl: "/r/le-bistrot-des-halles/table/table-1",
    scansToday: 18,
    ordersToday: 4,
    lastScanAt: "12:44",
    createdAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "table-2",
    name: "Table 2",
    zone: "Salle",
    isActive: true,
    publicUrl: "/r/le-bistrot-des-halles/table/table-2",
    scansToday: 11,
    ordersToday: 2,
    lastScanAt: "12:31",
    createdAt: "2026-05-10T09:01:00.000Z",
  },
  {
    id: "table-7",
    name: "Table 7",
    zone: "Salle",
    isActive: true,
    publicUrl: "/r/le-bistrot-des-halles/table/table-7",
    scansToday: 9,
    ordersToday: 2,
    lastScanAt: "12:24",
    createdAt: "2026-05-10T09:02:00.000Z",
  },
  {
    id: "terrasse-1",
    name: "Terrasse 1",
    zone: "Terrasse",
    isActive: true,
    publicUrl: "/r/le-bistrot-des-halles/table/terrasse-1",
    scansToday: 14,
    ordersToday: 3,
    lastScanAt: "12:40",
    createdAt: "2026-05-10T09:03:00.000Z",
  },
  {
    id: "terrasse-3",
    name: "Terrasse 3",
    zone: "Terrasse",
    isActive: true,
    publicUrl: "/r/le-bistrot-des-halles/table/terrasse-3",
    scansToday: 21,
    ordersToday: 5,
    lastScanAt: "12:38",
    createdAt: "2026-05-10T09:04:00.000Z",
  },
  {
    id: "comptoir",
    name: "Comptoir",
    zone: "Comptoir",
    isActive: true,
    publicUrl: "/r/le-bistrot-des-halles/table/comptoir",
    scansToday: 7,
    ordersToday: 1,
    lastScanAt: "12:12",
    createdAt: "2026-05-10T09:05:00.000Z",
  },
  {
    id: "table-privee",
    name: "Table privée",
    zone: "Salle",
    isActive: false,
    publicUrl: "/r/le-bistrot-des-halles/table/table-privee",
    scansToday: 0,
    ordersToday: 0,
    lastScanAt: "—",
    createdAt: "2026-05-10T09:06:00.000Z",
  },
];
