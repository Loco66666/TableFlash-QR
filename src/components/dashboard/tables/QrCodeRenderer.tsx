type QrCodeRendererProps = {
  label?: string;
  muted?: boolean;
  value: string;
  variant: "compact" | "preview" | "print";
};

type QrModule = {
  accent: boolean;
  column: number;
  row: number;
};

const qrVariantStyles = {
  compact: {
    wrapper: "gap-0",
    frame: "rounded-[1.2rem] p-2",
    frameSize: "92px",
    badge: "h-7 w-7 rounded-xl border-[3px] text-xs",
    caption: "sr-only",
  },
  preview: {
    wrapper: "gap-3",
    frame: "rounded-[2rem] p-3",
    frameSize: "190px",
    badge: "h-11 w-11 rounded-2xl border-4 text-lg",
    caption: "text-center text-sm font-black text-slate-800",
  },
  print: {
    wrapper: "gap-4",
    frame: "rounded-[8mm] p-[4mm]",
    frameSize: "92mm",
    badge: "h-[14mm] w-[14mm] rounded-[4.5mm] border-[1.2mm] text-[17pt]",
    caption: "text-center text-base font-black text-slate-800 print:text-[12pt]",
  },
} as const;

const qrSize = 29;
const finderSize = 7;
const finderPositions = [
  { column: 0, row: 0 },
  { column: qrSize - finderSize, row: 0 },
  { column: 0, row: qrSize - finderSize },
] as const;

export function QrCodeRenderer({ label, muted = false, value, variant }: QrCodeRendererProps) {
  const styles = qrVariantStyles[variant];
  const modules = buildQrModules(value);
  const accessibleLabel = label ? `QR code pour ${label}` : "QR code TableFlash";

  return (
    <div className={`flex flex-col items-center ${styles.wrapper}`}>
      <div
        aria-label={accessibleLabel}
        className={`${styles.frame} border border-slate-200/90 bg-white shadow-inner shadow-emerald-950/[0.05] ${muted ? "opacity-55 grayscale" : ""}`}
        role="img"
        style={{ height: styles.frameSize, width: styles.frameSize }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-white">
          <svg
            aria-hidden="true"
            className="block h-full w-full bg-white"
            focusable="false"
            shapeRendering="crispEdges"
            viewBox={`0 0 ${qrSize} ${qrSize}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect fill="#ffffff" height={qrSize} width={qrSize} x="0" y="0" />
            {modules.map((module) => (
              <rect
                fill={module.accent ? "#059669" : "#020617"}
                height="1"
                key={`${value}-${module.row}-${module.column}`}
                width="1"
                x={module.column}
                y={module.row}
              />
            ))}
            {finderPositions.map((position) => (
              <g key={`${position.row}-${position.column}`}>
                <rect fill="#020617" height="7" width="7" x={position.column} y={position.row} />
                <rect fill="#ffffff" height="5" width="5" x={position.column + 1} y={position.row + 1} />
                <rect fill="#020617" height="3" width="3" x={position.column + 2} y={position.row + 2} />
              </g>
            ))}
          </svg>
          <span
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border-white bg-emerald-600 font-black text-white shadow-lg shadow-emerald-950/20 ${styles.badge}`}
          >
            ⚡
          </span>
        </div>
      </div>
      {label ? <p className={styles.caption}>{label}</p> : null}
    </div>
  );
}

function buildQrModules(value: string) {
  const seed = hashValue(value || "tableflash");
  const modules: QrModule[] = [];

  for (let row = 0; row < qrSize; row += 1) {
    for (let column = 0; column < qrSize; column += 1) {
      if (isFinderZone(row, column)) {
        continue;
      }

      if (shouldActivateModule(row, column, seed, value)) {
        modules.push({
          accent: shouldAccentModule(row, column, seed),
          column,
          row,
        });
      }
    }
  }

  return modules;
}

function shouldActivateModule(row: number, column: number, seed: number, value: string) {
  const charCode = value.charCodeAt((row * 7 + column * 11) % Math.max(value.length, 1)) || 47;
  const mixed = (row + 1) * 73 + (column + 3) * 137 + seed + charCode * 17 + ((row ^ column) * 19);
  const diagonal = (row * 3 + column * 5 + seed + charCode) % 13;
  const timingLike = row === 6 || column === 6 || row === 22 || column === 22;
  const texture = ((row * column + seed) % 11) <= 2;

  return timingLike || mixed % 6 !== 0 || diagonal <= 2 || texture;
}

function shouldAccentModule(row: number, column: number, seed: number) {
  return (row * 31 + column * 17 + seed) % 23 === 0 || (row + column + seed) % 41 === 0;
}

function isFinderZone(row: number, column: number) {
  return finderPositions.some((position) => {
    const inRow = row >= position.row && row < position.row + finderSize;
    const inColumn = column >= position.column && column < position.column + finderSize;

    return inRow && inColumn;
  });
}

function hashValue(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
