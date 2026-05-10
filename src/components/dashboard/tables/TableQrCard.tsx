"use client";

import { useEffect, useRef, useState } from "react";

import { QrMockCode } from "./QrMockCode";
import { ZoneBadge } from "./ZoneBadge";
import type { RestaurantTable } from "./tablesData";

type TableQrCardProps = {
  canMoveDown: boolean;
  canMoveUp: boolean;
  isReorderMode: boolean;
  onCopy: (table: RestaurantTable) => void;
  onDelete: (table: RestaurantTable) => void;
  onDownload: (table: RestaurantTable) => void;
  onEdit: (table: RestaurantTable) => void;
  onMoveDown: (tableId: string) => void;
  onMoveUp: (tableId: string) => void;
  onPrint: (table: RestaurantTable) => void;
  onSelect: (tableId: string) => void;
  onToggleActive: (table: RestaurantTable) => void;
  selected: boolean;
  table: RestaurantTable;
};

export function TableQrCard({ canMoveDown, canMoveUp, isReorderMode, onCopy, onDelete, onDownload, onEdit, onMoveDown, onMoveUp, onPrint, onSelect, onToggleActive, selected, table }: TableQrCardProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActionsOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!actionsMenuRef.current?.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isActionsOpen]);

  function handleSecondaryAction(action: () => void) {
    action();
    setIsActionsOpen(false);
  }

  return (
    <article className={`relative rounded-[1.75rem] border bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-950/5 ${selected ? "border-emerald-300 shadow-emerald-950/10 ring-2 ring-emerald-100" : "border-slate-200/80 shadow-emerald-950/[0.03]"} ${table.isActive ? "" : "bg-slate-50/80 opacity-80"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black tracking-tight text-slate-950">{table.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <ZoneBadge zone={table.zone} />
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] ring-1 ${table.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-slate-200"}`}>
              {table.isActive ? "QR actif" : "QR inactif"}
            </span>
          </div>
        </div>
        <button className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800" onClick={() => onSelect(table.id)} type="button">
          Aperçu
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-gradient-to-br from-white to-emerald-50/40 p-3">
        <QrMockCode compact label={table.name} muted={!table.isActive} />
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-400">Lien public</p>
          <div className="mt-2 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2">
            <p className="min-w-0 flex-1 truncate text-xs font-bold text-slate-600">{table.publicUrl}</p>
            <button className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 transition hover:bg-emerald-100" onClick={() => onCopy(table)} type="button">
              Copier
            </button>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric value={String(table.scansToday)} label="Scans" />
        <Metric value={String(table.ordersToday)} label="Commandes" />
        <Metric value={table.lastScanAt} label="Dernier scan" />
      </dl>

      {isReorderMode ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={!canMoveUp} onClick={() => onMoveUp(table.id)} type="button">
            Monter
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={!canMoveDown} onClick={() => onMoveDown(table.id)} type="button">
            Descendre
          </button>
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        <ActionButton onClick={() => onCopy(table)}>Copier le lien</ActionButton>
        <ActionButton onClick={() => onToggleActive(table)}>{table.isActive ? "Désactiver" : "Activer"}</ActionButton>
        <div className="relative" ref={actionsMenuRef}>
          <button
            aria-expanded={isActionsOpen}
            aria-haspopup="menu"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            onClick={() => setIsActionsOpen((currentValue) => !currentValue)}
            type="button"
          >
            <span className="sr-only">Ouvrir les actions secondaires</span>
            ⋯
          </button>
          {isActionsOpen ? (
            <div className="absolute bottom-12 right-0 z-20 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-950/10" role="menu">
              <MenuAction onClick={() => handleSecondaryAction(() => onDownload(table))}>Télécharger QR</MenuAction>
              <MenuAction onClick={() => handleSecondaryAction(() => onPrint(table))}>Imprimer</MenuAction>
              <MenuAction onClick={() => handleSecondaryAction(() => onEdit(table))}>Modifier</MenuAction>
              <MenuAction destructive onClick={() => handleSecondaryAction(() => onDelete(table))}>Supprimer</MenuAction>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50/80 p-2.5 ring-1 ring-slate-200/70">
      <dt className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-400">{label}</dt>
      <dd className="mt-1 truncate text-sm font-black text-slate-950">{value}</dd>
    </div>
  );
}

function ActionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800" onClick={onClick} type="button">
      {children}
    </button>
  );
}

function MenuAction({ children, destructive = false, onClick }: { children: React.ReactNode; destructive?: boolean; onClick: () => void }) {
  return (
    <button className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-black transition ${destructive ? "text-rose-700 hover:bg-rose-50" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"}`} onClick={onClick} role="menuitem" type="button">
      {children}
    </button>
  );
}
