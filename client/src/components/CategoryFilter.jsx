import React from 'react';
import { Search, Flame, Utensils, Sparkles, CupSoda, UtensilsCrossed } from 'lucide-react';

const ICON_MAP = {
  Flame: Flame,
  Utensils: Utensils,
  Bowl: UtensilsCrossed,
  Sparkles: Sparkles,
  CupSoda: CupSoda,
};

export default function CategoryFilter({
  categories = [],
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari menu pedas, ayam geprek, es kelapa..."
          className="w-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-neutral-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
            activeCategory === ''
              ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
          }`}
        >
          <span>🔥</span>
          <span>Semua Menu</span>
        </button>

        {categories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Utensils;
          const isActive = activeCategory === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              {cat.menus_count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {cat.menus_count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

