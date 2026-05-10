type LiveServiceStatusCardProps = {
  servicePaused: boolean;
};

export function LiveServiceStatusCard({ servicePaused }: LiveServiceStatusCardProps) {
  return (
    <section className={`relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm shadow-slate-200/70 ${servicePaused ? "border-amber-200" : "border-emerald-200"}`}>
      <div className={`absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl ${servicePaused ? "bg-amber-100/70" : "bg-emerald-100/70"}`} aria-hidden="true" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="relative mt-1 flex h-4 w-4 shrink-0">
            {!servicePaused ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" /> : null}
            <span className={`relative inline-flex h-4 w-4 rounded-full ring-4 ${servicePaused ? "bg-amber-500 ring-amber-100" : "bg-emerald-500 ring-emerald-100"}`} />
          </span>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950">{servicePaused ? "Service en pause" : "Service midi en cours"}</p>
            <p className="mt-2 max-w-3xl text-base font-medium leading-7 text-slate-500">
              {servicePaused
                ? "Les commandes sont fermées dans cette maquette locale. Vous pouvez reprendre le service à tout moment."
                : "Les clients peuvent commander depuis leur table. Le paiement se fait à la caisse ou auprès du serveur."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">11:30 — 14:30</span>
          <span className={`rounded-full border px-4 py-2 text-sm font-black ${servicePaused ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {servicePaused ? "Commandes fermées" : "Commandes ouvertes"}
          </span>
        </div>
      </div>
    </section>
  );
}
