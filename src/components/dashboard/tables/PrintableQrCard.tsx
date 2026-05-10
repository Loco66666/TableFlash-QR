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

      <section className={`${compact ? "mt-6 space-y-1" : "mt-10 space-y-2"}`}>
        <p className={`${compact ? "text-sm" : "text-lg"} font-black uppercase tracking-[0.22em] text-emerald-700`}>Votre QR</p>
        <h1 className={`${compact ? "text-3xl" : "text-5xl"} font-black tracking-tight text-slate-950`}>{table.name}</h1>
      </section>

      <div className={`${compact ? "mt-5" : "mt-8"} flex justify-center`}>
        <QrCodeRenderer muted={!table.isActive} value={table.publicUrl} variant={compact ? "preview" : "print"} />
      </div>

      <section className={`${compact ? "mt-5 space-y-2 text-sm leading-5" : "mt-7 space-y-3 text-lg leading-8"} font-bold text-slate-700`}>
        <p className="font-black text-slate-950">Scannez pour consulter le menu et commander.</p>
        <p>Paiement à la caisse ou auprès du serveur.</p>
      </section>

      <p className={`${compact ? "mt-5 text-[0.62rem] leading-4" : "mt-7 text-xs leading-5"} break-all font-bold text-slate-400`}>{table.publicUrl}</p>
      <footer className={`${compact ? "mt-4 text-[0.62rem]" : "mt-7 text-xs"} font-black uppercase tracking-[0.22em] text-slate-400`}>Propulsé par TableFlash</footer>
    </article>
  );
}
