import { QrMockCode } from "./QrMockCode";
import { ZoneBadge } from "./ZoneBadge";
import type { RestaurantTable } from "./tablesData";

type TableQrPreviewPanelProps = {
  onClose: () => void;
  onCopy: (table: RestaurantTable) => void;
  onDownload: (table: RestaurantTable) => void;
  onEdit: (table: RestaurantTable) => void;
  onDelete: (table: RestaurantTable) => void;
  onPrint: (table: RestaurantTable) => void;
  onToggleActive: (table: RestaurantTable) => void;
  table: RestaurantTable | null;
};

export function TableQrPreviewPanel({ onClose, onCopy, onDelete, onDownload, onEdit, onPrint, onToggleActive, table }: TableQrPreviewPanelProps) {
  if (!table) {
    return (
      <aside className="relative rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 p-4 text-center shadow-sm 2xl:sticky 2xl:top-6 2xl:self-start">
        <CloseButton onClose={onClose} />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl" aria-hidden="true">⌁</div>
        <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950">Aucun QR sélectionné</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Sélectionnez une table pour prévisualiser son QR code et ses actions.</p>
      </aside>
    );
  }

  return (
    <aside className="relative rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-4 shadow-lg shadow-emerald-950/[0.04] 2xl:sticky 2xl:top-6 2xl:self-start">
      <CloseButton onClose={onClose} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 pr-11">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Aperçu du QR</p>
          <h2 className="mt-1 truncate text-xl font-black tracking-tight text-slate-950">{table.name}</h2>
        </div>
        <span className={`mr-11 shrink-0 rounded-full px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] ring-1 ${table.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-slate-200"}`}>
          {table.isActive ? "QR actif" : "QR inactif"}
        </span>
      </div>
      <div className="mt-2">
        <ZoneBadge zone={table.zone} />
      </div>

      <div className="mt-4 flex justify-center rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-3">
        <QrMockCode large label={table.name} muted={!table.isActive} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Lien public</p>
          <button className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-50" onClick={() => onCopy(table)} type="button">
            Copier
          </button>
        </div>
        <p className="mt-2 break-all text-xs font-bold leading-5 text-slate-700">{table.publicUrl}</p>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Metric label="Scans" value={String(table.scansToday)} />
        <Metric label="Commandes" value={String(table.ordersToday)} />
        <Metric label="Dernier scan" value={table.lastScanAt} />
      </dl>

      <div className="mt-4 rounded-[1.35rem] border border-slate-200/80 bg-white p-3">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Actions principales</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3 2xl:grid-cols-1">
          <PrimaryActionButton onClick={() => onCopy(table)}>Copier le lien</PrimaryActionButton>
          <PrimaryActionButton onClick={() => onDownload(table)}>Télécharger QR</PrimaryActionButton>
          <PrimaryActionButton onClick={() => onPrint(table)}>Imprimer</PrimaryActionButton>
        </div>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-3 2xl:grid-cols-1">
        <SecondaryActionButton onClick={() => onToggleActive(table)}>{table.isActive ? "Désactiver" : "Activer"}</SecondaryActionButton>
        <SecondaryActionButton onClick={() => onEdit(table)}>Modifier</SecondaryActionButton>
        <SecondaryActionButton destructive onClick={() => onDelete(table)}>Supprimer</SecondaryActionButton>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50/80 p-2 ring-1 ring-slate-200/70">
      <dt className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-400">{label}</dt>
      <dd className="mt-1 truncate text-sm font-black text-slate-950">{value}</dd>
    </div>
  );
}

function PrimaryActionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button className="rounded-2xl bg-emerald-600 px-3 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700" onClick={onClick} type="button">
      {children}
    </button>
  );
}

function SecondaryActionButton({ children, destructive = false, onClick }: { children: React.ReactNode; destructive?: boolean; onClick: () => void }) {
  return (
    <button className={`rounded-2xl border bg-white px-4 py-2.5 text-sm font-black transition ${destructive ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-label="Fermer l’aperçu du QR"
      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black leading-none text-slate-500 ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:text-emerald-800 hover:ring-emerald-200"
      onClick={onClose}
      type="button"
    >
      ×
    </button>
  );
}
