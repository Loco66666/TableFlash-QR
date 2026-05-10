import type { CategoryItem } from "./menuData";

type CategoryListProps = {
  categories: CategoryItem[];
  productCounts: Record<string, number>;
  selectedCategoryId: string | "all";
  reorderMode: boolean;
  onSelectCategory: (categoryId: string | "all") => void;
  onToggleReorderMode: () => void;
  onMoveCategoryUp: (categoryId: string) => void;
  onMoveCategoryDown: (categoryId: string) => void;
};

export function CategoryList({
  categories,
  productCounts,
  selectedCategoryId,
  reorderMode,
  onSelectCategory,
  onToggleReorderMode,
  onMoveCategoryUp,
  onMoveCategoryDown,
}: CategoryListProps) {
  const options: Array<CategoryItem & { id: string | "all" }> = [
    { id: "all", name: "Toutes" },
    ...categories,
  ];
  const activeCount = categories.length;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Menu
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Catégories
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          {activeCount} actives
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {options.map((category, index) => {
          const active = selectedCategoryId === category.id;
          const isAllOption = category.id === "all";
          const realCategoryIndex = index - 1;
          const count = isAllOption
            ? Object.values(productCounts).reduce(
                (total, value) => total + value,
                0,
              )
            : (productCounts[category.id] ?? 0);

          if (reorderMode && !isAllOption) {
            return (
              <article
                className={`rounded-3xl border px-4 py-4 transition ${
                  active
                    ? "border-emerald-200 bg-emerald-50 shadow-sm shadow-emerald-900/5"
                    : "border-slate-200 bg-white"
                }`}
                key={category.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() => onSelectCategory(category.id)}
                    type="button"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${active ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {index}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-black text-slate-950">
                        {category.name}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-slate-500">
                        {count} produit{count > 1 ? "s" : ""}
                      </span>
                    </span>
                  </button>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={realCategoryIndex === 0}
                      onClick={() => onMoveCategoryUp(category.id)}
                      type="button"
                    >
                      Monter
                    </button>
                    <button
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={realCategoryIndex === categories.length - 1}
                      onClick={() => onMoveCategoryDown(category.id)}
                      type="button"
                    >
                      Descendre
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <button
              aria-pressed={active}
              className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition ${
                active
                  ? "border-emerald-200 bg-emerald-50 shadow-sm shadow-emerald-900/5"
                  : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/60"
              }`}
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              type="button"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black ${active ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {isAllOption ? "★" : index}
                </span>
                <span>
                  <span className="block font-black text-slate-950">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-500">
                    {count} produit{count > 1 ? "s" : ""}
                  </span>
                </span>
              </span>
              <ChevronRightIcon />
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-3">
        {reorderMode ? (
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm font-black text-emerald-800">
              Mode réorganisation actif
            </p>
            <button
              className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800"
              onClick={onToggleReorderMode}
              type="button"
            >
              Terminer
            </button>
          </div>
        ) : (
          <button
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-emerald-800 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-700 hover:text-white"
            onClick={onToggleReorderMode}
            type="button"
          >
            Réorganiser les catégories
          </button>
        )}
      </div>
    </section>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
