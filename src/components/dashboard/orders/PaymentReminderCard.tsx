export function PaymentReminderCard() {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 text-slate-700 shadow-sm shadow-slate-200/70">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-700 ring-1 ring-emerald-100" aria-hidden="true">
          €
        </span>
        <div>
          <h2 className="text-base font-black tracking-tight text-slate-950">Paiement sur place</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
            Le règlement se fait à la caisse ou auprès du serveur.
          </p>
        </div>
      </div>
    </section>
  );
}
