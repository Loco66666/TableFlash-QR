import { DashboardHeader, EmptyState, StatusBadge } from "@/components/dashboard";

export default function Page() {
  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Gestion du menu"
        subtitle="Organisez vos catégories, produits et disponibilités."
      >
        <StatusBadge variant="neutral">Maquette statique</StatusBadge>
      </DashboardHeader>

      <main className="flex-1 p-5 lg:p-8">
        <EmptyState
          title="Le menu détaillé arrive à la prochaine phase"
          description="Cette section est prête dans le dashboard, sans backend, sans authentification et sans données connectées pour le moment."
        />
      </main>
    </>
  );
}
