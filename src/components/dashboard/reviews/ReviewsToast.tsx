type ReviewsToastProps = {
  message: string;
  onClose: () => void;
};

export function ReviewsToast({ message, onClose }: ReviewsToastProps) {
  return (
    <div className="fixed right-5 top-5 z-50 max-w-sm rounded-3xl border border-emerald-200 bg-white p-4 shadow-2xl shadow-emerald-950/15" role="status">
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700" aria-hidden="true">✓</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-950">Action confirmée</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{message}</p>
        </div>
        <button className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button">
          <span className="sr-only">Fermer la notification</span>
          ×
        </button>
      </div>
    </div>
  );
}
