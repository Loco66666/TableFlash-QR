import type { PublicMenuCategory } from "./types";

type PublicMenuCategoryTabsProps = {
  categories: PublicMenuCategory[];
  categoryCounts: Record<PublicMenuCategory, number>;
  selectedCategory: PublicMenuCategory;
  onSelectCategory: (category: PublicMenuCategory) => void;
};

export function PublicMenuCategoryTabs({
  categories,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
}: PublicMenuCategoryTabsProps) {
  return (
    <nav
      className="sticky top-0 z-20 -mx-4 border-y border-emerald-950/5 bg-[#F8FAF7]/95 px-4 py-3 backdrop-blur-xl"
      aria-label="Catégories du menu"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-extrabold transition active:scale-[0.98] ${
                isActive
                  ? "border-emerald-800 bg-emerald-800 text-white shadow-lg shadow-emerald-800/20"
                  : "border-white bg-white text-slate-600 shadow-sm shadow-slate-200/70"
              }`}
            >
              <span>{category}</span>
              <span className={`rounded-full px-2 py-0.5 text-[0.7rem] ${isActive ? "bg-white/15" : "bg-slate-100 text-slate-500"}`}>
                {categoryCounts[category]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
