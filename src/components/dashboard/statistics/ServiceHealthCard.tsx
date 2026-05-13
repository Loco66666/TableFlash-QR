import type { ServiceStatus } from "./statisticsData";

const statusClasses: Record<ServiceStatus, string> = {
  "Service fluide": "bg-emerald-50 text-emerald-800 ring-emerald-100",
  "Attention aux retards": "bg-rose-50 text-rose-800 ring-rose-100",
};

export function ServiceHealthCard({ status, recommendation }: { status: ServiceStatus; recommendation: string }) {
  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="break-words text-2xl font-black text-slate-950">État du service</h2>
      <div className={`mt-5 rounded-3xl p-5 ring-1 ${statusClasses[status]}`}>
        <p className="text-sm font-black uppercase tracking-[0.18em] opacity-70">Diagnostic opérationnel</p>
        <p className="mt-2 break-words text-3xl font-black leading-tight">{status}</p>
      </div>
      <p className="mt-5 break-words text-sm font-semibold leading-6 text-slate-500">{recommendation}</p>
    </article>
  );
}
