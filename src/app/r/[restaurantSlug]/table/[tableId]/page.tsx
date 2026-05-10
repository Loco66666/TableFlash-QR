import type { Metadata } from "next";
import { InteractivePublicMenu, deriveTableName } from "@/components/public-menu";

type PublicTableMenuPageProps = {
  params: Promise<{
    restaurantSlug: string;
    tableId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Menu à table — TableFlash",
  description: "Menu QR TableFlash pour commander depuis sa table, sans paiement en ligne.",
};

export default async function PublicTableMenuPage({ params }: PublicTableMenuPageProps) {
  const { restaurantSlug, tableId } = await params;
  const tableName = deriveTableName(tableId);

  return <InteractivePublicMenu restaurantSlug={restaurantSlug} tableId={tableId} tableName={tableName} />;
}
