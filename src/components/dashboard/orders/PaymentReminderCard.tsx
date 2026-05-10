export function PaymentReminderCard() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-emerald-950 p-5 text-white shadow-xl shadow-emerald-950/10">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950" aria-hidden="true">
          €
        </span>
        <div>
          <h2 className="text-xl font-black tracking-tight">Paiement physique uniquement</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-emerald-50/80">
            TableFlash ne déclenche aucun paiement en ligne dans ce MVP. Le client règle à la caisse ou directement auprès du serveur.
          </p>
        </div>
      </div>
    </section>
  );
}
