import { QrMockCode } from "./QrMockCode";
import { ZoneBadge } from "./ZoneBadge";
import type { RestaurantTable } from "./tablesData";

type TableQrPreviewPanelProps = {
  onCopy: (table: RestaurantTable) => void;
  onDownload: (table: RestaurantTable) => void;
  onEdit: (table: RestaurantTable) => void;
  onPrint: (table: RestaurantTable) => void;
  onToggleActive: (table: RestaurantTable) => void;
  table: RestaurantTable | null;
};

export function TableQrPreviewPanel({ onCopy, onDownload, onEdit, onPrint, onToggleActive, table }: TableQrPreviewPanelProps) {
  if (!table) {
    return (
      <aside className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm lg:sticky lg:top-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl" aria-hidden="true">⌁</div>
        <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">Aucun QR sélectionné</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Sélectionnez une table pour prévisualiser son QR code et ses actions.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-emerald-950/5 lg:sticky lg:top-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Aperçu du QR</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{table.name}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ring-1 ${table.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-slate-200"}`}>
          {table.isActive ? "QR actif" : "QR inactif"}
        </span>
      </div>
      <div className="mt-4">
        <ZoneBadge zone={table.zone} />
      </div>

      <div className="mt-6 flex justify-center rounded-[2rem] bg-slate-50 p-5">
        <QrMockCode large label={table.name} muted={!table.isActive} />
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Lien public</p>
        <p className="mt-2 break-all text-sm font-bold leading-6 text-slate-700">{table.publicUrl}</p>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Metric label="Scans" value={String(table.scansToday)} />
        <Metric label="Commandes" value={String(table.ordersToday)} />
        <Metric label="Dernier scan" value={table.lastScanAt} />
      </dl>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <ActionButton onClick={() => onCopy(table)}>Copier le lien</ActionButton>
        <ActionButton onClick={() => onDownload(table)}>Télécharger QR</ActionButton>
        <ActionButton onClick={() => onPrint(table)}>Imprimer</ActionButton>
        <ActionButton onClick={() => onToggleActive(table)}>{table.isActive ? "Désactiver" : "Activer"}</ActionButton>
        <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 sm:col-span-2 lg:col-span-1 xl:col-span-2" onClick={() => onEdit(table)} type="button">
          Modifier
        </button>
      </div>
    </aside>
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
    <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800" onClick={onClick} type="button">
      {children}
    </button>
  );
}
