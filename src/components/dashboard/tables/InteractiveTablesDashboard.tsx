"use client";

import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { DashboardHeader } from "@/components/dashboard";

import { EmptyTablesState } from "./EmptyTablesState";
import { TableFormModal } from "./TableFormModal";
import { TableQrCard } from "./TableQrCard";
import { PrintableQrCard } from "./PrintableQrCard";
import { PrintableQrSheet } from "./PrintableQrSheet";
import { TableQrPreviewPanel } from "./TableQrPreviewPanel";
import { TableSummaryCard } from "./TableSummaryCard";
import { TablesToolbar } from "./TablesToolbar";
import { initialTables } from "./tablesData";
import type { RestaurantTable, TableSortMode, TableStatusFilter, TableZoneFilter } from "./tablesData";

type ToastState = {
  id: number;
  message: string;
};

type TableFormValues = {
  isActive: boolean;
  name: string;
  zone: string;
};

export function InteractiveTablesDashboard() {
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(initialTables[0]?.id ?? null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeZoneFilter, setActiveZoneFilter] = useState<TableZoneFilter>("Toutes");
  const [activeStatusFilter, setActiveStatusFilter] = useState<TableStatusFilter>("Tous");
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isEditTableOpen, setIsEditTableOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<ToastState | null>(null);
  const [sortMode, setSortMode] = useState<TableSortMode>("custom");
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [printTargetTables, setPrintTargetTables] = useState<RestaurantTable[]>([]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  useEffect(() => {
    function clearPrintTargets() {
      setPrintTargetTables([]);
    }

    window.addEventListener("afterprint", clearPrintTargets);
    return () => window.removeEventListener("afterprint", clearPrintTargets);
  }, []);

  const selectedTable = selectedTableId ? tables.find((table) => table.id === selectedTableId) ?? null : null;
  const visibleTables = useMemo(() => filterAndSortTables(tables, searchQuery, activeZoneFilter, activeStatusFilter, sortMode), [activeStatusFilter, activeZoneFilter, searchQuery, sortMode, tables]);
  const summaryCards = useMemo(() => [
    { value: String(tables.length), label: "Tables configurées", helper: "QR générés localement" },
    { value: String(tables.filter((table) => table.isActive).length), label: "QR actifs", helper: "Disponibles au scan" },
    { value: String(tables.reduce((total, table) => total + table.scansToday, 0)), label: "Scans aujourd’hui", helper: "Depuis les QR de table" },
    { value: String(tables.reduce((total, table) => total + table.ordersToday, 0)), label: "Commandes QR", helper: "Envoyées sans paiement en ligne" },
  ], [tables]);

  function showToast(message: string) {
    setSuccessMessage({ id: Date.now(), message });
  }

  function handleHeaderPrint() {
    const tablesToPrint = selectedTable ? [selectedTable] : tables.filter((table) => table.isActive);

    if (tablesToPrint.length === 0) {
      showToast("Sélectionnez un QR puis cliquez sur Imprimer dans l’aperçu.");
      return;
    }

    printTables(tablesToPrint);
  }

  async function handleCopy(table: RestaurantTable) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(table.publicUrl);
        showToast("Lien copié.");
        return;
      } catch {
        showToast("Lien à copier : " + table.publicUrl);
        return;
      }
    }

    showToast("Lien à copier : " + table.publicUrl);
  }

  function handleDownload(table: RestaurantTable) {
    const content = `TableFlash QR\n${table.name}\n${table.zone}\n${table.publicUrl}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${table.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Téléchargement QR simulé dans la maquette.");
  }

  function handlePrintTable(table: RestaurantTable) {
    setSelectedTableId(table.id);
    printTables([table]);
  }

  function printTables(tablesToPrint: RestaurantTable[]) {
    flushSync(() => {
      setPrintTargetTables(tablesToPrint);
      setSuccessMessage({ id: Date.now(), message: "Préparation de l’impression des QR." });
    });

    window.setTimeout(() => window.print(), 0);
  }

  function handleOpenPreview(tableId: string) {
    setSelectedTableId(tableId);
    setIsPreviewOpen(true);
  }

  function closePreviewPanel() {
    setIsPreviewOpen(false);
  }

  function handleToggleActive(table: RestaurantTable) {
    setTables((currentTables) => currentTables.map((currentTable) => currentTable.id === table.id ? { ...currentTable, isActive: !currentTable.isActive } : currentTable));
    showToast(table.isActive ? "QR désactivé." : "QR activé.");
  }

  function handleDelete(table: RestaurantTable) {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce QR de table ?");

    if (!confirmed) {
      return;
    }

    setTables((currentTables) => {
      const nextTables = currentTables.filter((currentTable) => currentTable.id !== table.id);
      if (selectedTableId === table.id) {
        const nextSelectedTable = nextTables[0] ?? null;
        setSelectedTableId(nextSelectedTable?.id ?? null);
        if (!nextSelectedTable) {
          setIsPreviewOpen(false);
        }
      }
      return nextTables;
    });
    showToast("Table supprimée de la maquette.");
  }

  function handleOpenEdit(table: RestaurantTable) {
    setSelectedTableId(table.id);
    setIsEditTableOpen(true);
  }

  function handleAddTable(values: TableFormValues) {
    const name = values.name.trim();
    const zone = values.zone.trim();

    if (!name || !zone) {
      showToast("Renseignez un nom de table et une zone.");
      return;
    }

    const slug = createSlug(name);
    const id = createUniqueId(slug, tables);
    const newTable: RestaurantTable = {
      id,
      name,
      zone,
      isActive: values.isActive,
      publicUrl: `/r/le-bistrot-des-halles/table/${id}`,
      scansToday: 0,
      ordersToday: 0,
      lastScanAt: "—",
      createdAt: new Date().toISOString(),
    };

    setTables((currentTables) => [...currentTables, newTable]);
    setSelectedTableId(newTable.id);
    setIsAddTableOpen(false);
    setSortMode("custom");
    showToast("Table ajoutée dans la maquette.");
  }

  function handleEditTable(values: TableFormValues) {
    if (!selectedTable) {
      return;
    }

    const name = values.name.trim();
    const zone = values.zone.trim();

    if (!name || !zone) {
      showToast("Renseignez un nom de table et une zone.");
      return;
    }

    const nextSlug = name === selectedTable.name ? selectedTable.id : createUniqueId(createSlug(name), tables.filter((table) => table.id !== selectedTable.id));

    setTables((currentTables) => currentTables.map((table) => table.id === selectedTable.id ? {
      ...table,
      id: nextSlug,
      name,
      zone,
      isActive: values.isActive,
      publicUrl: `/r/le-bistrot-des-halles/table/${nextSlug}`,
    } : table));
    setSelectedTableId(nextSlug);
    setIsEditTableOpen(false);
    showToast("Table mise à jour dans la maquette.");
  }

  function handleSortModeChange(nextSortMode: TableSortMode) {
    setSortMode(nextSortMode);
    if (nextSortMode !== "custom") {
      setIsReorderMode(false);
    }
  }

  function handleReorderToggle() {
    if (sortMode !== "custom") {
      showToast("Repassez en tri personnalisé pour réorganiser les tables.");
      return;
    }

    setIsReorderMode((currentValue) => !currentValue);
  }

  function moveTable(tableId: string, direction: "up" | "down") {
    if (sortMode !== "custom") {
      showToast("Repassez en tri personnalisé pour réorganiser les tables.");
      return;
    }

    setTables((currentTables) => {
      const currentIndex = currentTables.findIndex((table) => table.id === tableId);
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentTables.length) {
        return currentTables;
      }

      const nextTables = [...currentTables];
      const [movedTable] = nextTables.splice(currentIndex, 1);
      nextTables.splice(nextIndex, 0, movedTable);
      return nextTables;
    });
    showToast("Ordre des tables mis à jour dans la maquette.");
  }

  return (
    <>
      <section aria-label="QR à imprimer" className="print-only tableflash-print-area" data-print-ready={printTargetTables.length > 0 ? "true" : "false"}>
        {printTargetTables.length === 1 ? <PrintableQrCard table={printTargetTables[0]} /> : <PrintableQrSheet tables={printTargetTables} />}
      </section>

      <div className="no-print tableflash-dashboard-screen">
        <DashboardHeader
          eyebrow="Le Bistrot des Halles"
          title="QR par table"
          subtitle="Générez, organisez et imprimez les QR codes que vos clients scannent depuis leur table."
        >
          <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800" onClick={() => showToast("Export des QR simulé dans la maquette.")} type="button">
            Exporter les QR
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800" onClick={handleHeaderPrint} type="button">
            Imprimer la sélection
          </button>
          <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700" onClick={() => setIsAddTableOpen(true)} type="button">
            Ajouter une table
          </button>
        </DashboardHeader>

        <main className="flex-1 space-y-5 p-5 lg:p-8">
        <section className="overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white shadow-xl shadow-emerald-950/10">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-200">Flux client</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">Un QR unique pour chaque table</h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-emerald-50/85">Chaque QR code ouvre le menu public avec la table déjà associée. Le client commande sans paiement en ligne, puis règle à la caisse ou auprès du serveur.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-4 lg:min-w-[540px]">
              {["QR scanné", "Menu public", "Panier validé", "Commande reçue"].map((step, index) => (
                <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/15" key={step}>
                  <p className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300 text-sm font-black text-emerald-950">{index + 1}</p>
                  <p className="mt-2 text-xs font-black text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <TableSummaryCard key={card.label} {...card} />
          ))}
        </section>

        <TablesToolbar
          activeStatusFilter={activeStatusFilter}
          activeZoneFilter={activeZoneFilter}
          isReorderMode={isReorderMode}
          onAddTable={() => setIsAddTableOpen(true)}
          onReorderToggle={handleReorderToggle}
          onSearchChange={setSearchQuery}
          onSortModeChange={handleSortModeChange}
          onStatusFilterChange={setActiveStatusFilter}
          onZoneFilterChange={setActiveZoneFilter}
          searchQuery={searchQuery}
          sortMode={sortMode}
        />

        <section className={`grid items-start gap-5 ${isPreviewOpen ? "2xl:grid-cols-[minmax(0,1fr)_380px]" : ""}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950">QR configurés</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{visibleTables.length} table{visibleTables.length > 1 ? "s" : ""} affichée{visibleTables.length > 1 ? "s" : ""} dans cette maquette locale.</p>
              </div>
            </div>

            {visibleTables.length > 0 ? (
              <div className={`grid gap-3 ${isPreviewOpen ? "xl:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
                {visibleTables.map((table) => {
                  const customIndex = tables.findIndex((currentTable) => currentTable.id === table.id);
                  return (
                    <TableQrCard
                      canMoveDown={customIndex < tables.length - 1}
                      canMoveUp={customIndex > 0}
                      isReorderMode={isReorderMode}
                      key={table.id}
                      onCopy={handleCopy}
                      onMoveDown={(tableId) => moveTable(tableId, "down")}
                      onMoveUp={(tableId) => moveTable(tableId, "up")}
                      onSelect={handleOpenPreview}
                      onToggleActive={handleToggleActive}
                      selected={isPreviewOpen && table.id === selectedTableId}
                      table={table}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyTablesState onAddTable={() => setIsAddTableOpen(true)} />
            )}
          </div>

          {isPreviewOpen ? (
            <TableQrPreviewPanel
              onClose={closePreviewPanel}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onEdit={handleOpenEdit}
              onPrint={handlePrintTable}
              onToggleActive={handleToggleActive}
              table={selectedTable}
            />
          ) : null}
          </section>
        </main>
      </div>

      {isAddTableOpen ? <TableFormModal mode="add" onClose={() => setIsAddTableOpen(false)} onSave={handleAddTable} /> : null}
      {isEditTableOpen ? <TableFormModal mode="edit" onClose={() => setIsEditTableOpen(false)} onSave={handleEditTable} table={selectedTable} /> : null}

      {successMessage ? (
        <div className="fixed right-5 top-5 z-[60] max-w-sm rounded-3xl border border-emerald-200 bg-white p-4 shadow-2xl shadow-emerald-950/15" role="status">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700" aria-hidden="true">✓</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-950">Action confirmée</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{successMessage.message}</p>
            </div>
            <button className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => setSuccessMessage(null)} type="button">
              <span className="sr-only">Fermer la notification</span>
              ×
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function filterAndSortTables(tables: RestaurantTable[], searchQuery: string, activeZoneFilter: TableZoneFilter, activeStatusFilter: TableStatusFilter, sortMode: TableSortMode) {
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase("fr-FR");

  const filteredTables = tables.filter((table) => {
    const matchesSearch = !normalizedSearch || `${table.name} ${table.zone} ${table.publicUrl}`.toLocaleLowerCase("fr-FR").includes(normalizedSearch);
    const matchesZone = activeZoneFilter === "Toutes" || table.zone === activeZoneFilter;
    const matchesStatus = activeStatusFilter === "Tous" || (activeStatusFilter === "Actifs" && table.isActive) || (activeStatusFilter === "Inactifs" && !table.isActive);

    return matchesSearch && matchesZone && matchesStatus;
  });

  return [...filteredTables].sort((firstTable, secondTable) => {
    if (sortMode === "name") {
      return firstTable.name.localeCompare(secondTable.name, "fr-FR", { numeric: true });
    }

    if (sortMode === "zone") {
      return firstTable.zone.localeCompare(secondTable.zone, "fr-FR") || firstTable.name.localeCompare(secondTable.name, "fr-FR", { numeric: true });
    }

    if (sortMode === "scans") {
      return secondTable.scansToday - firstTable.scansToday;
    }

    return 0;
  });
}

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "table";
}

function createUniqueId(baseId: string, tables: RestaurantTable[]) {
  let nextId = baseId;
  let suffix = 2;

  while (tables.some((table) => table.id === nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return nextId;
}
