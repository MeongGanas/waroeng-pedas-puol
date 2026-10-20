import React from 'react';
import { Flame } from 'lucide-react';

const SPICY_LEVELS = [
  { level: 0, label: 'Nol', grade: 'Tanpa Cabai', desc: 'Gurih santai tanpa cabai, ramah di perut' },
  { level: 1, label: 'Lv 1', grade: 'Play Group', desc: 'Pedas tipis-tipis buat pengenalan' },
  { level: 2, label: 'Lv 2', grade: 'TK', desc: 'Mulai hangat terasa di lidah' },
  { level: 3, label: 'Lv 3', grade: 'SD', desc: 'Pedas sedap bikin semangat makan' },
  { level: 4, label: 'Lv 4', grade: 'SMP', desc: 'Mulai basah keringatan & nampol!' },
  { level: 5, label: 'Lv 5', grade: 'SMA', desc: 'Pedas membara, siapkan es teh!' },
  { level: 6, label: 'Lv 6', grade: 'Kuliah 🔥', desc: 'Pedas PUOOLL maksimal! Level tertinggi Waroeng' },
];

export default function SpicyLevelPicker({ value = 0, onChange, maxLevel = 6 }) {
  const availableLevels = SPICY_LEVELS.filter(item => item.level <= maxLevel);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          Pilih Tingkat Kepedasan:
        </label>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
          {availableLevels.find(l => l.level === value)?.grade || `Level ${value}`}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {availableLevels.map(item => {
          const isSelected = value === item.level;
          return (
            <button
              key={item.level}
              type="button"
              onClick={() => onChange(item.level)}
              className={`p-2 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-red-500 ring-2 ring-red-500/50 bg-red-500/20 shadow-md shadow-red-600/20'
                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-extrabold text-[11px] text-white">
                  {item.grade}
                </span>
                {item.level > 0 ? (
                  <span className="text-[10px] text-red-400">🔥{item.level}</span>
                ) : (
                  <span className="text-[10px] text-neutral-500">🚫</span>
                )}
              </div>
              <span className="text-[10px] leading-tight text-neutral-400 font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400 italic bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80">
        🌶️ <span className="text-red-400 font-semibold">{availableLevels.find(l => l.level === value)?.grade}:</span> {availableLevels.find(l => l.level === value)?.desc}
      </p>
    </div>
  );
}
