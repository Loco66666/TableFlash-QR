type StatusBadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "warning" | "neutral" | "danger";
};

const variantClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
};

export function StatusBadge({ children, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
