import { useState } from "react";

type ReviewResponseBoxProps = {
  initialValue?: string;
  onCancel: () => void;
  onSave: (response: string) => void;
};

export function ReviewResponseBox({ initialValue = "", onCancel, onSave }: ReviewResponseBoxProps) {
  const [response, setResponse] = useState(initialValue);

  return (
    <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
      <label className="text-sm font-black text-slate-950" htmlFor="review-response">Réponse du restaurant</label>
      <textarea
        className="mt-3 min-h-32 w-full rounded-2xl border border-emerald-100 bg-white p-4 text-sm font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
        id="review-response"
        onChange={(event) => setResponse(event.target.value)}
        placeholder="Ex : Merci pour votre retour, nous sommes ravis que vous ayez apprécié votre repas."
        value={response}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700" onClick={() => onSave(response)} type="button">
          Enregistrer la réponse
        </button>
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50" onClick={onCancel} type="button">
          Annuler
        </button>
      </div>
    </div>
  );
}
