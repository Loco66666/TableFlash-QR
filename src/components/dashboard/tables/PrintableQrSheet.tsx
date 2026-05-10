import { PrintableQrCard } from "./PrintableQrCard";
import type { RestaurantTable } from "./tablesData";

type PrintableQrSheetProps = {
  tables: RestaurantTable[];
};

const restaurantName = "Le Bistrot des Halles";

export function PrintableQrSheet({ tables }: PrintableQrSheetProps) {
  return (
    <section className="print-sheet tableflash-print-sheet" aria-label="Planche de QR à imprimer">
      <header className="tableflash-print-sheet-header">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">TableFlash</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">QR actifs — {restaurantName}</h1>
        </div>
        <p className="text-sm font-bold text-slate-600">Scannez pour consulter le menu et commander.</p>
      </header>
      <div className="tableflash-print-sheet-grid">
        {tables.map((table) => (
          <PrintableQrCard compact key={table.id} table={table} />
        ))}
      </div>
    </section>
  );
}
