type PublicPaymentNoticeProps = {
  note: string;
  compact?: boolean;
};

export function PublicPaymentNotice({ note, compact = false }: PublicPaymentNoticeProps) {
  return (
    <div className={`rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-900 ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Règlement</p>
      <p className={`${compact ? "mt-1 text-sm" : "mt-2 text-sm leading-6"}`}>{note}</p>
    </div>
  );
}
