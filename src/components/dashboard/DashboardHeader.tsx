type DashboardHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
};

export function DashboardHeader({ title, subtitle, eyebrow, children }: DashboardHeaderProps) {
  return (
    <header className="flex min-w-0 max-w-full flex-col gap-5 overflow-x-hidden border-b border-slate-200/80 bg-white/90 px-5 py-6 backdrop-blur lg:px-8">
      <div className="flex min-w-0 max-w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 max-w-full">
          {eyebrow ? (
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="break-words text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl break-words text-base text-slate-500">{subtitle}</p> : null}
        </div>
        {children ? <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">{children}</div> : null}
      </div>
    </header>
  );
}
