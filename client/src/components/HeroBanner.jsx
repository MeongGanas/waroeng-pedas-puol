import React from 'react';
import { Flame, Clock, CreditCard, Banknote, ShieldAlert } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-red-950/40 border border-neutral-800 p-6 sm:p-8 mb-8">
      {/* Background glow circle */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-4">
          <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          Kuliner Pedas Spesialis Sambal Ulek Segar
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
          Pedasnya <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Nampol Membakar Lidah</span>, Nagih Puooll! 🔥
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 mb-6 leading-relaxed">
          Pilih level cabai sesukamu dari Level 0 hingga Level 5 Puooll. Pesan langsung dari meja tanpa antre, bayar online via QRIS atau bayar tunai di kasir!
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl">
            <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-neutral-300 font-medium">QRIS & Online Web</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl">
            <Banknote className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-neutral-300 font-medium">Bisa Bayar di Kasir</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl col-span-2 sm:col-span-1">
            <Clock className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-neutral-300 font-medium">Dimasak Segar / Fresh</span>
          </div>
        </div>
      </div>
    </div>
  );
}

