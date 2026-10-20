import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import SpicyLevelPicker from './SpicyLevelPicker';
import { useCart } from '../context/CartContext';

export default function MenuCustomModal({ menu, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState(menu?.is_spicy_customizable ? 1 : 0);
  const [notes, setNotes] = useState('');

  if (!menu) return null;

  const handleAdd = () => {
    addToCart(menu, quantity, spicyLevel, notes);
    onClose();
  };

  const subtotal = (menu?.price || 0) * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 bg-neutral-800 shrink-0">
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-extrabold text-lg sm:text-xl text-white">{menu.name}</h3>
            <p className="text-xs text-neutral-300 font-medium">Rp {menu.price.toLocaleString('id-ID')} / porsi</p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          <p className="text-xs text-neutral-400 leading-relaxed">{menu.description}</p>

          {/* Spicy Picker */}
          {menu.is_spicy_customizable && menu.max_spicy_level > 0 && (
            <SpicyLevelPicker
              value={spicyLevel}
              onChange={setSpicyLevel}
              maxLevel={menu.max_spicy_level}
            />
          )}

          {/* Notes Input */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Catatan Khusus (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: sambal dipisah, tanpa lalapan, es batu sedikit"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-neutral-300">Jumlah Pesanan:</span>
            <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-6 text-center text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-neutral-500 block">Subtotal</span>
            <span className="font-extrabold text-base text-white">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-red-700/25 transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}

