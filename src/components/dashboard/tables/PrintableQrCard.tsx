import { QrCodeRenderer } from "./QrCodeRenderer";
import type { RestaurantTable } from "./tablesData";

type PrintableQrCardProps = {
  compact?: boolean;
  table: RestaurantTable;
};

const restaurantName = "Le Bistrot des Halles";

export function PrintableQrCard({ compact = false, table }: PrintableQrCardProps) {
  return (
    <article className={`print-card tableflash-print-card break-inside-avoid border border-slate-200 bg-white text-center text-slate-950 ${compact ? "rounded-[1.5rem] p-5" : "rounded-[2.25rem] p-8"}`}>
      <header className="flex flex-col items-center">
        <div className={`mx-auto flex items-center justify-center bg-emerald-600 font-black text-white ${compact ? "h-10 w-10 rounded-xl text-xl" : "h-12 w-12 rounded-2xl text-2xl"}`} aria-hidden="true">
          ⚡
        </div>
        <p className={`${compact ? "mt-3 text-[0.66rem]" : "mt-4 text-sm"} font-black uppercase tracking-[0.24em] text-emerald-700`}>TableFlash</p>
        <p className={`${compact ? "mt-1 text-base" : "mt-2 text-xl"} font-black text-slate-950`}>{restaurantName}</p>
      </header>

      <section className={`${compact ? "mt-5 rounded-[1.1rem] px-4 py-3" : "mt-7 rounded-[1.5rem] px-5 py-4"} border border-emerald-100 bg-emerald-50/70`}>
        <p className={`${compact ? "text-[0.62rem]" : "text-xs"} font-black uppercase tracking-[0.22em] text-emerald-700`}>Votre QR de commande</p>
        <h1 className={`${compact ? "mt-1 text-2xl" : "mt-2 text-4xl"} font-black tracking-tight text-slate-950`}>{table.name}</h1>
        <p className={`${compact ? "mt-1 text-[0.68rem]" : "mt-2 text-base"} font-black uppercase tracking-[0.2em] text-emerald-700`}>{table.zone}</p>
      </section>

      <div className={`${compact ? "mt-5" : "mt-8"} flex justify-center`}>
        <QrCodeRenderer label={`${restaurantName} — ${table.name}`} muted={!table.isActive} value={table.publicUrl} variant={compact ? "preview" : "print"} />
      </div>

      <section className={`${compact ? "mt-5 space-y-2 text-sm leading-5" : "mt-7 space-y-3 text-lg leading-8"} font-bold text-slate-700`}>
        <p className="font-black text-slate-950">Scannez pour consulter le menu et commander.</p>
        <p>Paiement à la caisse ou auprès du serveur.</p>
      </section>

      <p className={`${compact ? "mt-5 rounded-xl px-3 py-2 text-[0.65rem] leading-4" : "mt-7 rounded-2xl px-4 py-3 text-sm leading-5"} break-all border border-slate-200 bg-slate-50 font-bold text-slate-600`}>{table.publicUrl}</p>
      <footer className={`${compact ? "mt-4 text-[0.62rem]" : "mt-7 text-xs"} font-black uppercase tracking-[0.22em] text-slate-400`}>Propulsé par TableFlash</footer>
    </article>
  );
}
