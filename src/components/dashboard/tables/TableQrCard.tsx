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
  return (
    <article className={`rounded-[2rem] border bg-white p-5 shadow-sm transition ${selected ? "border-emerald-400 shadow-emerald-950/15 ring-4 ring-emerald-100" : "border-slate-200 shadow-emerald-950/5"} ${table.isActive ? "" : "opacity-75"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950">{table.name}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <ZoneBadge zone={table.zone} />
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ring-1 ${table.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-slate-200"}`}>
              {table.isActive ? "QR actif" : "QR inactif"}
            </span>
          </div>
        </div>
        <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800" onClick={() => onSelect(table.id)} type="button">
          Aperçu
        </button>
      </div>

      <div className="mt-5 flex flex-col items-center rounded-[1.75rem] bg-slate-50 p-4">
        <QrMockCode label={table.name} muted={!table.isActive} />
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-3">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Lien public</p>
        <p className="mt-1 break-all text-sm font-bold text-slate-700">{table.publicUrl}</p>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Metric value={String(table.scansToday)} label="Scans" />
        <Metric value={String(table.ordersToday)} label="Commandes" />
        <Metric value={table.lastScanAt} label="Dernier scan" />
      </dl>

      {isReorderMode ? (
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={!canMoveUp} onClick={() => onMoveUp(table.id)} type="button">
            Monter
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={!canMoveDown} onClick={() => onMoveDown(table.id)} type="button">
            Descendre
          </button>
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <ActionButton onClick={() => onCopy(table)}>Copier le lien</ActionButton>
        <ActionButton onClick={() => onDownload(table)}>Télécharger QR</ActionButton>
        <ActionButton onClick={() => onPrint(table)}>Imprimer</ActionButton>
        <ActionButton onClick={() => onToggleActive(table)}>{table.isActive ? "Désactiver" : "Activer"}</ActionButton>
        <ActionButton onClick={() => onEdit(table)}>Modifier</ActionButton>
        <button className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100" onClick={() => onDelete(table)} type="button">
          Supprimer
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <dt className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-400">{label}</dt>
      <dd className="mt-1 text-lg font-black text-slate-950">{value}</dd>
    </div>
  );
}

function ActionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800" onClick={onClick} type="button">
      {children}
    </button>
  );
}
