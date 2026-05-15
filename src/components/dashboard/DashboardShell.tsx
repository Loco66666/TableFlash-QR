import { DashboardMobileNav } from "./DashboardMobileNav";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F9FAFB] text-slate-950">
      <div className="flex min-h-screen min-w-0 max-w-full">
        <DashboardSidebar />
        <div className="tableflash-dashboard-shell flex min-w-0 max-w-full flex-1 flex-col overflow-x-hidden">
          <DashboardMobileNav />
          {children}
        </div>
      </div>
    </div>
  );
}
