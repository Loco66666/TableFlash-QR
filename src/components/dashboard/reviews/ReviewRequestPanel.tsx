import { useState } from "react";

type ReviewRequestPanelProps = {
  onClose: () => void;
  onSubmit: () => void;
};

const channels = ["QR sur écran", "Lien à copier", "SMS plus tard", "Email plus tard"];

export function ReviewRequestPanel({ onClose, onSubmit }: ReviewRequestPanelProps) {
  const [channel, setChannel] = useState(channels[0]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="review-request-title">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl shadow-slate-950/25">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Boucle après repas</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950" id="review-request-title">Demander un avis après repas</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Envoyez un lien simple au client pour recueillir son retour après la commande.</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-xl font-black text-slate-500 transition hover:bg-slate-50 hover:text-slate-900" onClick={onClose} type="button" aria-label="Fermer la demande d’avis">×</button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-black text-slate-800">
            Table ou commande
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="Ex : Table 4 ou #2003" />
          </label>
          <label className="text-sm font-black text-slate-800">
            Nom du client optionnel
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="Ex : Marie" />
          </label>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-black text-slate-800">Canal</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {channels.map((channelOption) => (
              <label className={`rounded-2xl border p-3 text-sm font-black transition ${channel === channelOption ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600"}`} key={channelOption}>
                <input className="sr-only" checked={channel === channelOption} onChange={() => setChannel(channelOption)} type="radio" name="review-channel" />
                {channelOption}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-black text-emerald-900">Aperçu du message</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">Merci pour votre visite. Votre avis nous aide à améliorer l’expérience.</p>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50" onClick={onClose} type="button">Annuler</button>
          <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/15 transition hover:bg-emerald-700" onClick={onSubmit} type="button">Créer une demande d’avis</button>
        </div>
      </div>
    </div>
  );
}
