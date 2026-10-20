import React from 'react';
import { Flame } from 'lucide-react';

const SPICY_LEVELS = [
  { level: 0, label: 'Tanpa Cabai', desc: 'Gurih santai, ramah untuk semua lidah', color: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
  { level: 1, label: 'Level 1: Pedes Manja', desc: 'Pedas tipis-tipis buat pemula', color: 'bg-amber-950/40 text-amber-400 border-amber-600/40' },
  { level: 2, label: 'Level 2: Pedes Sedap', desc: 'Bikin melek dan nafsu makan naik', color: 'bg-orange-950/40 text-orange-400 border-orange-500/50' },
  { level: 3, label: 'Level 3: Pedes Nampol', desc: 'Mulai basah keringatan!', color: 'bg-red-950/40 text-red-400 border-red-500/50' },
  { level: 4, label: 'Level 4: Mercon Membara', desc: 'Panas membakar lidah & tenggorokan', color: 'bg-red-900/50 text-red-300 border-red-500' },
  { level: 5, label: 'Level 5: Pedes PUOOLL! 🔥', desc: 'Pedas gila maksimal! Tanggung resiko sendiri', color: 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-red-400 shadow-lg shadow-red-600/30' },
];

export default function SpicyLevelPicker({ value = 0, onChange, maxLevel = 5 }) {
  const availableLevels = SPICY_LEVELS.filter(item => item.level <= maxLevel);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-red-500 fill-red-500" />
          Pilih Tingkat Kepedasan:
        </label>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
          {value === 0 ? 'Level 0' : `Level ${value}`}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {availableLevels.map(item => {
          const isSelected = value === item.level;
          return (
            <button
              key={item.level}
              type="button"
              onClick={() => onChange(item.level)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-red-500 ring-2 ring-red-500/50 bg-red-500/15'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-xs">{item.level === 0 ? 'Level 0' : `Lv. ${item.level}`}</span>
                <div className="flex">
                  {item.level === 0 ? (
                    <span className="text-[10px] text-neutral-500">🚫</span>
                  ) : (
                    Array.from({ length: item.level }).map((_, i) => (
                      <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500 -ml-1 first:ml-0" />
                    ))
                  )}
                </div>
              </div>
              <span className="text-[11px] leading-tight font-medium text-neutral-400">
                {item.level === 0 ? 'Nol Pedas' : item.level === 5 ? 'PUOOLL! 🔥' : `Pedes Lv ${item.level}`}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400 italic bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800/80">
        💡 {availableLevels.find(l => l.level === value)?.desc}
      </p>
    </div>
  );
}

