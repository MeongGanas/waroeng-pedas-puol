import React from 'react';
import { Flame, Star, Plus } from 'lucide-react';

export default function MenuCard({ menu, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(menu)}
      className="group bg-neutral-900/70 border border-neutral-800/90 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-red-600/10 cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
        <img
          src={menu.image_url}
          alt={menu.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"></div>

        {/* Best seller badge */}
        {menu.is_best_seller && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-amber-500 text-neutral-950 font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-md">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-neutral-950" />
            <span className="hidden xs:inline">BEST SELLER</span>
            <span className="xs:hidden">TOP</span>
          </div>
        )}

        {/* Spicy badge */}
        {menu.is_spicy_customizable && menu.max_spicy_level > 0 && (
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 bg-neutral-950/80 backdrop-blur-md border border-red-500/30 text-red-400 font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-red-500 text-red-500" />
            <span>Lv. 0 - {menu.max_spicy_level}</span>
          </div>
        )}
      </div>

      {/* Content: Hanya Nama & Harga (tanpa deskripsi awal) */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-xs sm:text-sm text-neutral-100 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-2">
          {menu.name}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 mt-auto">
          <div>
            <span className="text-[9px] sm:text-[10px] text-neutral-500 block -mb-0.5">Harga</span>
            <span className="font-extrabold text-xs sm:text-sm text-white">
              Rp {menu.price.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(menu);
            }}
            className="flex items-center gap-1 bg-neutral-800 hover:bg-red-600 text-neutral-200 hover:text-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 active:scale-95 group-hover:bg-red-600 group-hover:text-white shrink-0"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Pesan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
