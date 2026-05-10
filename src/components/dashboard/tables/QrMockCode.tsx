type QrMockCodeProps = {
  label: string;
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

export function QrMockCode({ label, large = false, muted = false }: QrMockCodeProps) {
  const sizeClass = large ? "h-64 w-64" : "h-36 w-36";
  const cellClass = large ? "rounded-[3px]" : "rounded-[2px]";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClass} rounded-[2rem] border border-slate-200 bg-white p-4 shadow-inner shadow-emerald-950/5 ${muted ? "opacity-55 grayscale" : ""}`} aria-label={`QR code de démonstration pour ${label}`} role="img">
        <div className="relative grid h-full w-full grid-cols-12 gap-1 rounded-2xl bg-slate-50 p-2">
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
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-4 border-white bg-emerald-600 text-xl font-black text-white shadow-lg shadow-emerald-950/20" aria-hidden="true">
            ⚡
          </span>
        </div>
      </div>
      <p className="text-center text-sm font-black text-slate-800">{label}</p>
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
