import { DashboardHeader, EmptyState, StatusBadge } from "@/components/dashboard";

export default function Page() {
  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Statistiques"
        subtitle="Analysez les commandes, produits populaires et avis."
      >
        <StatusBadge variant="neutral">Maquette statique</StatusBadge>
      </DashboardHeader>

      <main className="flex-1 p-5 lg:p-8">
        <EmptyState
          title="Les statistiques resteront simples pour le MVP"
          description="Cette section est prête dans le dashboard, sans backend, sans authentification et sans données connectées pour le moment."
        />
      </main>
    </>
  );
}
