import type { CategoryItem } from "./menuData";

type CategoryListProps = {
  activeCategoryId: string;
  categories: CategoryItem[];
  onSelectCategory: (categoryId: string) => void;
};

export function CategoryList({ activeCategoryId, categories, onSelectCategory }: CategoryListProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Menu</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Catégories</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{categories.length} actives</span>
      </div>

      <div className="mt-6 space-y-3">
        <CategoryButton
          active={activeCategoryId === "all"}
          indexLabel="★"
          name="Toutes"
          productCount={categories.reduce((total, category) => total + category.productCount, 0)}
          onClick={() => onSelectCategory("all")}
        />
        {categories.map((category, index) => (
          <CategoryButton
            active={activeCategoryId === category.id}
            indexLabel={String(index + 1)}
            key={category.id}
            name={category.name}
            productCount={category.productCount}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>

      <button className="mt-6 w-full rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100" type="button">
        Réorganiser les catégories
      </button>
    </section>
  );
}

type CategoryButtonProps = {
  active: boolean;
  indexLabel: string;
  name: string;
  productCount: number;
  onClick: () => void;
};

function CategoryButton({ active, indexLabel, name, productCount, onClick }: CategoryButtonProps) {
  return (
    <button
      aria-pressed={active}
      className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition ${
        active
          ? "border-emerald-300 bg-emerald-50 shadow-sm shadow-emerald-900/5 ring-2 ring-emerald-100"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/60"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black ${active ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"}`}>
          {indexLabel}
        </span>
        <span>
          <span className="block font-black text-slate-950">{name}</span>
          <span className="mt-1 block text-sm font-semibold text-slate-500">{productCount} produits</span>
        </span>
      </span>
      <ChevronRightIcon />
    </button>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
