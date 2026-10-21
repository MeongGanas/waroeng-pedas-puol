import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Utensils } from 'lucide-react';
import SpicyLevelPicker from './SpicyLevelPicker';
import { useCart } from '../context/CartContext';

const SAMBAL_OPTIONS = [
  { id: 'Sambal Bawang', label: 'Sambal Bawang', icon: '🧄', desc: 'Bawang gurih minyak panas pedas mantap' },
  { id: 'Sambal Tomat', label: 'Sambal Tomat', icon: '🍅', desc: 'Segar asam manis pedas nikmat' },
  { id: 'Sambal Tempong', label: 'Sambal Tempong', icon: '🌶️', desc: 'Sambal mentah terasi khas Banyuwangi super pedas' },
];

const SIZE_OPTIONS = [
  { id: 'K', label: 'Kecil (K)' },
  { id: 'J', label: 'Jumbo (J)' },
  { id: 'SJ', label: 'Super Jumbo (SJ)' },
];

export default function MenuCustomModal({ menu, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState(menu?.is_spicy_customizable ? 1 : 0);
  const [sambalType, setSambalType] = useState('Sambal Bawang');
  const [portionSize, setPortionSize] = useState('J'); // Default Jumbo
  const [notes, setNotes] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animasi saat modal muncul
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    // Fade out animasi sebelum unmount
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!menu) return null;

  const isDrink = menu?.category?.slug === 'minuman' || (menu?.price <= 12000 && (menu?.name?.toLowerCase().includes('es ') || menu?.name?.toLowerCase().includes('teh')));

  const handleAdd = () => {
    addToCart(
      menu,
      quantity,
      spicyLevel,
      notes,
      menu?.is_spicy_customizable ? sambalType : null,
      isDrink ? portionSize : null
    );
    handleClose();
  };

  const subtotal = (menu?.price || 0) * quantity;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl transition-all duration-200 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 sm:translate-y-4 sm:scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 bg-neutral-200 dark:bg-neutral-800 shrink-0 overflow-hidden">
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay warna hitam pudar untuk kontras teks */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
          
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className="font-extrabold text-lg sm:text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{menu.name}</h3>
            <p className="text-xs text-neutral-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Rp {menu.price.toLocaleString('id-ID')} / porsi</p>
          </div>
        </div>

        {/* Scrollable Body (no scrollbar) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 no-scrollbar">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{menu.description}</p>

          {/* Pilihan Sambal (Khas Waroeng Pedes Puooll) */}
          {menu.is_spicy_customizable && (
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-red-500" />
                Pilih Varian Sambal:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SAMBAL_OPTIONS.map(sambal => (
                  <button
                    key={sambal.id}
                    type="button"
                    onClick={() => setSambalType(sambal.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      sambalType === sambal.id
                        ? 'border-red-500 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-white font-bold ring-1 ring-red-500/50'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-base block mb-0.5">{sambal.icon}</span>
                    <span className="text-xs block leading-tight">{sambal.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
                💡 {SAMBAL_OPTIONS.find(s => s.id === sambalType)?.desc}
              </p>
            </div>
          )}

          {/* Spicy Level Picker (Play Group, TK, SD, SMP, SMA, Kuliah) */}
          {menu.is_spicy_customizable && menu.max_spicy_level > 0 && (
            <SpicyLevelPicker
              value={spicyLevel}
              onChange={setSpicyLevel}
              maxLevel={menu.max_spicy_level}
            />
          )}

          {/* Pilihan Ukuran untuk Minuman (K / J / SJ) */}
          {isDrink && (
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 block">
                Pilih Ukuran Gelas:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SIZE_OPTIONS.map(size => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setPortionSize(size.id)}
                    className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${
                      portionSize === size.id
                        ? 'border-red-500 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-white font-bold ring-1 ring-red-500/50'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Input */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Catatan Khusus (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: sambal dipisah, lalapan timun banyakin, es sedikit"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-500 focus:bg-white dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:bg-neutral-950"
            />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Jumlah Pesanan:</span>
            <div className="flex items-center gap-3 bg-neutral-100 border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 flex items-center justify-center transition-colors shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-6 text-center text-neutral-900 dark:text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 flex items-center justify-center transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Subtotal</span>
            <span className="font-extrabold text-base text-neutral-900 dark:text-white">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-red-700/20 transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
