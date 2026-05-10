type QrMockCodeProps = {
  label: string;
  compact?: boolean;
  large?: boolean;
  muted?: boolean;
};

const activeCells = new Set([
  0, 1, 2, 4, 7, 8, 9, 10,
  11, 13, 15, 17, 19, 20,
  22, 24, 25, 26, 28, 31,
  33, 34, 36, 37, 39, 41, 42,
  44, 47, 48, 50, 52, 54,
  55, 56, 58, 60, 61, 62, 64,
  66, 68, 70, 72, 73, 75,
  77, 78, 80, 83, 84, 85, 87, 88, 89,
  91, 93, 95, 97, 98, 99,
  101, 102, 104, 106, 108,
  110, 111, 112, 114, 116, 118, 119,
  121, 123, 124, 126, 128, 130,
  132, 133, 135, 137, 139, 140, 142,
]);

export function QrMockCode({ compact = false, label, large = false, muted = false }: QrMockCodeProps) {
  const sizeClass = large ? "h-48 w-48" : compact ? "h-20 w-20" : "h-32 w-32";
  const cellClass = large ? "rounded-[3px]" : "rounded-[2px]";
  const wrapperGapClass = compact ? "gap-0" : "gap-3";
  const outerRadiusClass = compact ? "rounded-[1.25rem]" : "rounded-[2rem]";
  const outerPaddingClass = large ? "p-3" : compact ? "p-2" : "p-3";
  const innerRadiusClass = compact ? "rounded-xl" : "rounded-2xl";
  const logoSizeClass = large ? "h-11 w-11 rounded-2xl border-4 text-lg" : compact ? "h-7 w-7 rounded-xl border-[3px] text-xs" : "h-10 w-10 rounded-2xl border-4 text-base";

  return (
    <div className={`flex flex-col items-center ${wrapperGapClass}`}>
      <div className={`${sizeClass} ${outerRadiusClass} border border-slate-200/80 bg-white ${outerPaddingClass} shadow-inner shadow-emerald-950/[0.04] ${muted ? "opacity-55 grayscale" : ""}`} aria-label={`QR code pour ${label}`} role="img">
        <div className={`relative grid h-full w-full grid-cols-12 gap-1 ${innerRadiusClass} bg-emerald-50/40 p-1.5`}>
          {Array.from({ length: 144 }, (_, index) => {
            const isFinder = isFinderCell(index);
            const isActive = activeCells.has(index) || isFinder;
            return (
              <span
                aria-hidden="true"
                className={`${cellClass} ${isActive ? (isFinder ? "bg-slate-950" : "bg-emerald-700") : "bg-transparent"}`}
                key={index}
              />
            );
          })}
          <span className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border-white bg-emerald-600 font-black text-white shadow-lg shadow-emerald-950/15 ${logoSizeClass}`} aria-hidden="true">
            ⚡
          </span>
        </div>
      </div>
      {compact ? null : <p className="text-center text-sm font-black text-slate-800">{label}</p>}
    </div>
  );
}

function isFinderCell(index: number) {
  const row = Math.floor(index / 12);
  const column = index % 12;
  const inTopLeft = row <= 3 && column <= 3;
  const inTopRight = row <= 3 && column >= 8;
  const inBottomLeft = row >= 8 && column <= 3;

  if (!inTopLeft && !inTopRight && !inBottomLeft) {
    return false;
  }

  const localRow = row <= 3 ? row : row - 8;
  const localColumn = column <= 3 ? column : column - 8;

  return localRow === 0 || localRow === 3 || localColumn === 0 || localColumn === 3 || (localRow === 1 && localColumn === 1) || (localRow === 2 && localColumn === 2);
}
