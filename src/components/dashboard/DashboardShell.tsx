import { DashboardMobileNav } from "./DashboardMobileNav";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardMobileNav />
          {children}
        </div>
      </div>
    </div>
  );
}
