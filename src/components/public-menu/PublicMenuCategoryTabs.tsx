import type { PublicMenuCategory } from "./types";

type PublicMenuCategoryTabsProps = {
  categories: PublicMenuCategory[];
  selectedCategory: PublicMenuCategory;
  onSelectCategory: (category: PublicMenuCategory) => void;
};

export function PublicMenuCategoryTabs({ categories, selectedCategory, onSelectCategory }: PublicMenuCategoryTabsProps) {
  return (
    <nav className="sticky top-0 z-20 -mx-4 border-b border-slate-100 bg-[#F9FAFB]/95 px-4 py-3 backdrop-blur" aria-label="Catégories du menu">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-extrabold transition ${
                isActive
                  ? "border-emerald-700 bg-emerald-700 text-white shadow-lg shadow-emerald-700/20"
                  : "border-slate-200 bg-white text-slate-600 shadow-sm"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
