import { PrintableQrCard } from "./PrintableQrCard";
import type { RestaurantTable } from "./tablesData";

type PrintableQrSheetProps = {
  tables: RestaurantTable[];
};

export function PrintableQrSheet({ tables }: PrintableQrSheetProps) {
  return (
    <div className="tableflash-print-sheet" aria-label="Planche de QR à imprimer">
      {tables.map((table) => (
        <PrintableQrCard compact key={table.id} table={table} />
      ))}
    </div>
  );
}
