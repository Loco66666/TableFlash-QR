import { DashboardHeader, EmptyState, StatusBadge } from "@/components/dashboard";

export default function Page() {
  return (
    <>
      <DashboardHeader
        eyebrow="Le Bistrot des Halles"
        title="Paramètres"
        subtitle="Configurez les informations de votre établissement."
      >
        <StatusBadge variant="neutral">Maquette statique</StatusBadge>
      </DashboardHeader>

      <main className="flex-1 p-5 lg:p-8">
        <EmptyState
          title="Les paramètres seront ajoutés après l’onboarding"
          description="Cette section est prête dans le dashboard, sans backend, sans authentification et sans données connectées pour le moment."
        />
      </main>
    </>
  );
}
