export function StatisticsToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-3xl border border-emerald-100 bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-emerald-950/20">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs">✓</span>
        <p className="flex-1">{message}</p>
        <button type="button" onClick={onClose} className="rounded-full px-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Fermer la notification">
          ×
        </button>
      </div>
    </div>
  );
}
