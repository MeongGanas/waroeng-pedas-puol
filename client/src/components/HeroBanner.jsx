import React from 'react';
import { Flame, Clock, CreditCard, Banknote, Phone, Truck } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-red-950/40 border border-neutral-800 p-5 sm:p-7 mb-7">
      {/* Background glow circle */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-3">
          <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          Penyetan • Sambal Bawang, Tomat & Tempong • Siap Antar!
        </div>

        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
          Pedasnya <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Nampol Nagih Puooll!</span> 🔥
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 mb-5 leading-relaxed">
          Penyetan lengkap dengan 3 varian sambal juara. Level pedas dari <strong>Play Group, TK, SD, SMP, SMA</strong> hingga <strong>Kuliah 🔥</strong>. Bisa pesan langsung dari meja atau delivery siap antar!
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl">
            <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-neutral-300 font-medium">Siap Antar Delivery</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl">
            <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-neutral-300 font-medium">QRIS & Kasir Tunai</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl col-span-2 sm:col-span-1">
            <Phone className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-neutral-300 font-medium">WA: 0852-3069-7857</span>
          </div>
        </div>
      </div>
    </div>
  );
}
