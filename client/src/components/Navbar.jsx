import React from 'react';
import { Flame, ShoppingBag, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenCart }) {
  const { totalItemsCount, totalAmount, tableNumber, setTableNumber } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-white truncate flex items-center gap-1">
              <span>Waroeng Pedes</span>
              <span className="text-red-500 uppercase tracking-wider">Puooll!</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 -mt-0.5 font-medium hidden xs:flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              Buka • Cabai Rawit Asli 🌶️
            </p>
          </div>
        </div>

        {/* Right Section: Nomor Meja & Tombol Keranjang */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Table Number Display / Input */}
          {tableNumber ? (
            <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-red-500/30 px-2.5 py-1.5 rounded-xl text-xs shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-neutral-400 font-medium hidden sm:inline">Meja</span>
              <span className="font-extrabold text-white text-xs bg-red-600/30 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 font-mono">
                {tableNumber}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 rounded-xl text-xs">
              <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="text-neutral-400">Meja:</span>
              <input 
                type="text" 
                placeholder="No. Meja"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-14 bg-transparent font-bold text-red-400 focus:outline-none placeholder:text-neutral-600 text-xs"
              />
            </div>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 sm:gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-red-700/20 transition-all active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">
              {totalItemsCount > 0 ? `Rp ${totalAmount.toLocaleString('id-ID')}` : 'Keranjang'}
            </span>
            {totalItemsCount > 0 && (
              <span className="bg-amber-400 text-neutral-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
