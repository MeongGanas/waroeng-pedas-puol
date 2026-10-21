import React, { useState, useEffect } from 'react';
import { X, Banknote, MapPin, Phone, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const RANDOM_NAMES = [
  'Budi Santoso',
  'Siti Rahma',
  'Dimas Pratama',
  'Putri Ayu',
  'Rian Hidayat',
  'Maya Sari',
  'Bagas Aditya',
  'Ayu Wulandari',
  'Reza Fahlevi',
  'Dewi Lestari',
];

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess }) {
  const { cartItems, totalAmount, tableNumber, setTableNumber, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState('dine_in'); // dine_in, takeaway
  const [notes, setNotes] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [randomPlaceholder, setRandomPlaceholder] = useState('Contoh: Budi Santoso');
  
  // Anti-double click lock
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      const chosen = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      setRandomPlaceholder(`Contoh: ${chosen}`);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit

    if (!customerName.trim()) {
      setErrorMessage('Silakan isi Nama Pemesan.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Silakan isi Nomor WhatsApp Pemesan.');
      return;
    }
    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setErrorMessage('Silakan isi Nomor Meja Anda.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        order_type: orderType,
        table_number: orderType === 'dine_in' ? tableNumber : null,
        delivery_address: null,
        payment_method: 'cashier', // Pembayaran langsung di kasir
        notes: notes,
        items: cartItems.map(item => ({
          menu_id: item.menu.id,
          quantity: item.quantity,
          spicy_level: item.spicyLevel,
          sambal_type: item.sambalType,
          portion_size: item.portionSize,
          notes: item.notes,
        })),
      };

      const result = await api.createOrder(payload);

      // Simpan riwayat pesanan ke localStorage pengguna
      try {
        const history = JSON.parse(localStorage.getItem('waroeng_customer_order_history') || '[]');
        const newHistoryItem = {
          ...result.data.order,
          whatsapp_url: result.data.whatsapp_url,
          created_at: new Date().toISOString(),
        };
        history.unshift(newHistoryItem);
        localStorage.setItem('waroeng_customer_order_history', JSON.stringify(history));
      } catch (errHistory) {
        console.error('Gagal menyimpan riwayat pesanan lokal:', errHistory);
      }
      
      // Clear cart upon successful order creation
      clearCart();
      setIsVisible(false);
      setTimeout(() => {
        onClose();
        onOrderSuccess(result.data);
      }, 200);
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ease-out overflow-y-auto ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto transition-all duration-200 ease-out transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-white">Konfirmasi Pemesanan</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Tagihan: <span className="font-bold text-red-600 dark:text-red-400">Rp {totalAmount.toLocaleString('id-ID')}</span></p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white p-1.5 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                Nama Pemesan:
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={randomPlaceholder}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                No. WhatsApp:
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Order Type: Hanya Makan di Meja & Bawa Pulang */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Tipe Pesanan:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'dine_in', label: 'Makan di Meja', icon: '🍽️', desc: 'Disajikan langsung ke meja' },
                { id: 'takeaway', label: 'Bawa Pulang', icon: '🛍️', desc: 'Dibungkus untuk dibawa pulang' },
              ].map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setOrderType(type.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    orderType === type.id
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-white font-bold ring-1 ring-red-500'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-lg">{type.icon}</span>
                    <span className={`text-xs font-bold ${orderType === type.id ? 'text-red-700 dark:text-white' : 'text-neutral-900 dark:text-white'}`}>{type.label}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Meja jika Dine In */}
          {orderType === 'dine_in' && (
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                Nomor Meja:
              </label>
              <input
                type="text"
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Contoh: 05 / Meja Depan"
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Info Pembayaran di Kasir */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Metode Pembayaran:
            </label>
            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-neutral-900 dark:text-white block mb-0.5">
                  Bayar di Kasir (Tunai / QRIS Kasir)
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight block">
                  Pesanan akan langsung dimasak. Pembayaran dilakukan di kasir dengan menyebutkan nomor pesanan.
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Catatan Pesanan Keseluruhan (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: tolong jangan terlalu asin, sendok 2"
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-neutral-400 dark:disabled:bg-neutral-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-xl shadow-red-700/20 transition-all active:scale-95 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pesanan...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kirim Pesanan ke Kasir</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-neutral-500 mt-2">
              Pesanan Anda akan langsung diteruskan ke sistem dapur dan dicatat di kasir.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}