import type { CategoryItem } from "./menuData";

type CategoryListProps = {
  categories: CategoryItem[];
  productCounts: Record<string, number>;
  reorderMode: boolean;
  selectedCategoryId: string | "all";
  onMoveCategoryDown: (categoryId: string) => void;
  onMoveCategoryUp: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSelectCategory: (categoryId: string | "all") => void;
  onToggleReorderMode: () => void;
};

export function CategoryList({
  categories,
  productCounts,
  reorderMode,
  selectedCategoryId,
  onDeleteCategory,
  onMoveCategoryDown,
  onMoveCategoryUp,
  onSelectCategory,
  onToggleReorderMode,
}: CategoryListProps) {
  const options: Array<CategoryItem & { id: string | "all" }> = [{ id: "all", name: "Toutes" }, ...categories];
  const activeCount = categories.length;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Menu</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Catégories</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          {activeCount} actives
        </span>
      </div>

      {reorderMode ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
          Mode réorganisation actif
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {options.map((category, index) => {
          const active = selectedCategoryId === category.id;
          const count =
            category.id === "all"
              ? Object.values(productCounts).reduce((total, value) => total + value, 0)
              : productCounts[category.id] ?? 0;
          const isRealCategory = category.id !== "all";
          const categoryIndex = categories.findIndex((item) => item.id === category.id);

          return (
            <div
              className={`rounded-3xl border transition ${
                active
                  ? "border-emerald-200 bg-emerald-50 shadow-sm shadow-emerald-900/5"
                  : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/60"
              }`}
              key={category.id}
            >
              <button
                aria-pressed={active}
                className="flex w-full items-center justify-between px-4 py-4 text-left"
                onClick={() => onSelectCategory(category.id)}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black ${
                      active ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.id === "all" ? "★" : index}
                  </span>
                  <span>
                    <span className="block font-black text-slate-950">{category.name}</span>
                    <span className="mt-1 block text-sm font-semibold text-slate-500">
                      {count} produit{count > 1 ? "s" : ""}
                    </span>
                  </span>
                </span>
                <ChevronRightIcon />
              </button>

              {reorderMode && isRealCategory ? (
                <div className="flex flex-wrap gap-2 border-t border-emerald-100 px-4 pb-4 pt-3">
                  <button
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={categoryIndex <= 0}
                    onClick={() => onMoveCategoryUp(category.id)}
                    type="button"
                  >
                    Monter
                  </button>
                  <button
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={categoryIndex === -1 || categoryIndex >= categories.length - 1}
                    onClick={() => onMoveCategoryDown(category.id)}
                    type="button"
                  >
                    Descendre
                  </button>
                </div>
              ) : null}

              {isRealCategory ? (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 pb-4 pt-3">
                  <span className="text-xs font-bold text-slate-400">Actions catégorie</span>
                  <button
                    aria-label={`Supprimer la catégorie ${category.name}`}
                    className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 transition hover:border-rose-200 hover:bg-rose-100"
                    onClick={() => onDeleteCategory(category.id)}
                    type="button"
                  >
                    Supprimer
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <button
        className="mt-6 w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
        onClick={onToggleReorderMode}
        type="button"
      >
        {reorderMode ? "Terminer" : "Réorganiser les catégories"}
      </button>
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
