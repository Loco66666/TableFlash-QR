type QrCodeRendererProps = {
  label?: string;
  muted?: boolean;
  value: string;
  variant: "compact" | "preview" | "print";
};

type QrModule = {
  accent: boolean;
  active: boolean;
  finder: boolean;
};

const qrVariantStyles = {
  compact: {
    wrapper: "gap-0",
    frame: "h-20 w-20 rounded-[1.2rem] p-2",
    grid: "rounded-xl p-1",
    cell: "rounded-[1.5px]",
    badge: "h-7 w-7 rounded-xl border-[3px] text-xs",
    caption: "sr-only",
  },
  preview: {
    wrapper: "gap-3",
    frame: "h-48 w-48 rounded-[2rem] p-3",
    grid: "rounded-2xl p-1.5",
    cell: "rounded-[2px]",
    badge: "h-11 w-11 rounded-2xl border-4 text-lg",
    caption: "text-center text-sm font-black text-slate-800",
  },
  print: {
    wrapper: "gap-4",
    frame: "h-64 w-64 rounded-[2.25rem] p-4 print:h-[78mm] print:w-[78mm] print:rounded-[8mm] print:p-[4mm]",
    grid: "rounded-[1.6rem] p-2 print:rounded-[5mm] print:p-[2.5mm]",
    cell: "rounded-[2px] print:rounded-[0.6mm]",
    badge: "h-14 w-14 rounded-3xl border-[5px] text-2xl print:h-[16mm] print:w-[16mm] print:rounded-[5mm] print:border-[1.4mm] print:text-[18pt]",
    caption: "text-center text-base font-black text-slate-800 print:text-[12pt]",
  },
} as const;

const qrSize = 29;
const centerStart = 11;
const centerEnd = 17;

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
      >
        <div className={`relative grid h-full w-full grid-cols-[repeat(29,minmax(0,1fr))] gap-[2px] bg-white ${styles.grid}`}>
          {modules.map((module, index) => (
            <span
              aria-hidden="true"
              className={`${styles.cell} ${getModuleClass(module)}`}
              key={`${value}-${index}`}
            />
          ))}
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
      const finder = isFinderModule(row, column);
      const reserved = isReservedQuietModule(row, column) || isCenterBadgeModule(row, column);
      const active = finder || (!reserved && shouldActivateModule(row, column, seed, value));
      const accent = active && !finder && shouldAccentModule(row, column, seed);

      modules.push({ accent, active, finder });
    }
  }

  return modules;
}

function shouldActivateModule(row: number, column: number, seed: number, value: string) {
  const charCode = value.charCodeAt((row * 7 + column * 11) % Math.max(value.length, 1)) || 47;
  const mixed = (row + 1) * 73 + (column + 3) * 137 + seed + charCode * 17 + ((row ^ column) * 19);
  const wave = (row * column + seed) % 11;

  return mixed % 5 !== 0 || wave === 0 || (row + column + charCode) % 7 === 0;
}

function shouldAccentModule(row: number, column: number, seed: number) {
  return (row * 31 + column * 17 + seed) % 23 === 0 || (row + column + seed) % 41 === 0;
}

function isFinderModule(row: number, column: number) {
  const inTopLeft = row < 7 && column < 7;
  const inTopRight = row < 7 && column >= qrSize - 7;
  const inBottomLeft = row >= qrSize - 7 && column < 7;

  if (!inTopLeft && !inTopRight && !inBottomLeft) {
    return false;
  }

  const localRow = row < 7 ? row : row - (qrSize - 7);
  const localColumn = column < 7 ? column : column - (qrSize - 7);
  const outerRing = localRow === 0 || localRow === 6 || localColumn === 0 || localColumn === 6;
  const innerBlock = localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4;

  return outerRing || innerBlock;
}

function isReservedQuietModule(row: number, column: number) {
  const nearTopLeft = row <= 7 && column <= 7;
  const nearTopRight = row <= 7 && column >= qrSize - 8;
  const nearBottomLeft = row >= qrSize - 8 && column <= 7;

  return nearTopLeft || nearTopRight || nearBottomLeft;
}

function isCenterBadgeModule(row: number, column: number) {
  return row >= centerStart && row <= centerEnd && column >= centerStart && column <= centerEnd;
}

function hashValue(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getModuleClass(module: QrModule) {
  if (!module.active) {
    return "bg-transparent";
  }

  if (module.finder) {
    return "bg-slate-950";
  }

  return module.accent ? "bg-emerald-600" : "bg-slate-950";
}
