import { QrMockCode } from "./QrMockCode";
import type { RestaurantTable } from "./tablesData";

type PrintableQrCardProps = {
  table: RestaurantTable;
};

const restaurantName = "Le Bistrot des Halles";

export function PrintableQrCard({ table }: PrintableQrCardProps) {
  return (
    <article className="tableflash-print-card break-inside-avoid rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-950">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white" aria-hidden="true">
        ⚡
      </div>
      <p className="mt-4 text-sm font-black uppercase tracking-[0.24em] text-emerald-700">TableFlash</p>
      <p className="mt-2 text-lg font-black text-slate-950">{restaurantName}</p>

      <div className="mt-8 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 px-5 py-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">{table.name}</h1>
        <p className="mt-2 text-base font-black uppercase tracking-[0.2em] text-emerald-700">{table.zone}</p>
      </div>

      <div className="mt-8 flex justify-center">
        <QrMockCode large label={`${restaurantName} — ${table.name}`} muted={!table.isActive} />
      </div>

      <div className="mt-8 space-y-3 text-base font-bold leading-7 text-slate-700">
        <p>Scannez pour consulter le menu et commander.</p>
        <p>Paiement à la caisse ou auprès du serveur.</p>
      </div>

      <p className="mt-7 break-all rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">{table.publicUrl}</p>
      <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Menu QR • Commande à table • Avis clients</p>
    </article>
  );
}
