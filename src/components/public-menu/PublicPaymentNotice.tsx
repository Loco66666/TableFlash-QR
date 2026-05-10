type PublicPaymentNoticeProps = {
  note: string;
  compact?: boolean;
  inverted?: boolean;
};

export function PublicPaymentNotice({ note, compact = false, inverted = false }: PublicPaymentNoticeProps) {
  return (
    <div
      className={`rounded-2xl border ${compact ? "p-3" : "p-4"} ${
        inverted
          ? "border-white/15 bg-white/10 text-emerald-50 backdrop-blur"
          : "border-emerald-100 bg-emerald-50 text-emerald-900"
      }`}
    >
      <p className={`text-xs font-black uppercase tracking-[0.2em] ${inverted ? "text-emerald-100" : "text-emerald-700"}`}>
        Règlement
      </p>
      <p className={`${compact ? "mt-1 text-sm" : "mt-2 text-sm leading-6"}`}>{note}</p>
    </div>
  );
}
