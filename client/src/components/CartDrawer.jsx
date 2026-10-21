import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Flame, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose, onOpenCheckout }) {
  const { cartItems, updateQuantity, clearCart, totalAmount, totalItemsCount } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-2xl transition-transform duration-200 ease-out transform ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <h2 className="font-extrabold text-base text-neutral-900 dark:text-white">Keranjang Pesanan</h2>
            <span className="bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs px-2 py-0.5 rounded-full border border-red-200 dark:border-transparent">
              {totalItemsCount} item
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors"
                title="Kosongkan Keranjang"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
              <span className="text-4xl mb-3">🍲</span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-300 text-sm mb-1">Keranjang Masih Kosong</p>
              <p className="text-xs text-neutral-500">Yuk pilih menu ayam geprek atau sambal mercon favoritmu!</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                key={index}
                className="bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-3 flex gap-3 items-center"
              >
                <img
                  src={item.menu.image_url}
                  alt={item.menu.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-neutral-200 dark:bg-neutral-800"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 truncate mb-1">
                    {item.menu.name}
                  </h4>

                  <div className="flex items-center flex-wrap gap-1.5 mb-1">
                    {item.sambalType && (
                      <span className="text-[10px] bg-neutral-200/70 dark:bg-neutral-800 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">
                        {item.sambalType}
                      </span>
                    )}
                    {item.portionSize && (
                      <span className="text-[10px] bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded">
                        Gelas {item.portionSize}
                      </span>
                    )}
                    {item.spicyLevel > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-500/30">
                        <Flame className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                        Lv. {item.spicyLevel}
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 bg-neutral-200/70 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                        Nol Pedas
                      </span>
                    )}
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Rp {(item.menu.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 italic truncate">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Counter */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-0.5 rounded-lg shadow-sm">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center text-neutral-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-950/90 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">Total Pembayaran:</span>
              <span className="font-extrabold text-lg text-neutral-900 dark:text-white">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={() => {
                handleClose();
                setTimeout(() => onOpenCheckout(), 220);
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-xl shadow-red-700/20 transition-transform active:scale-95"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}