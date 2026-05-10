type PublicPaymentNoticeProps = {
  note: string;
  compact?: boolean;
  inverted?: boolean;
};

const customerJourneySteps = [
  "Choisissez ce qui vous fait plaisir",
  "Vérifiez puis confirmez votre commande",
  "Réglez au comptoir ou auprès du serveur",
  "L’équipe prépare votre commande",
];

export function PublicPaymentNotice({ note, compact = false, inverted = false }: PublicPaymentNoticeProps) {
  if (compact) {
    return (
      <div
        className={`rounded-2xl border p-3 ${
          inverted
            ? "border-white/15 bg-white/10 text-emerald-50 backdrop-blur"
            : "border-emerald-100 bg-emerald-50 text-emerald-900"
        }`}
      >
        <p className={`text-xs font-black uppercase tracking-[0.2em] ${inverted ? "text-emerald-100" : "text-emerald-700"}`}>
          Règlement sur place
        </p>
        <p className="mt-1 text-sm">{note}</p>
      </div>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-emerald-100 bg-white p-4 shadow-lg shadow-emerald-950/5" aria-labelledby="customer-journey-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Commande à table</p>
          <h2 id="customer-journey-title" className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950">
            Comment ça se passe ?
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800">4 étapes</span>
      </div>

      <ol className="mt-4 space-y-3">
        {customerJourneySteps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-800 text-xs font-black text-white">
              {index + 1}
            </span>
            <span className="text-sm font-extrabold leading-5 text-slate-800">{step}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-900">
        {note}
      </p>
    </section>
  );
}
