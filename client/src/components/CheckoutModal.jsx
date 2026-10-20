import React, { useState } from 'react';
import { X, CreditCard, Banknote, MapPin, Phone, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess }) {
  const { cartItems, totalAmount, tableNumber, setTableNumber, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState('dine_in'); // dine_in, takeaway, delivery
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online'); // online, cashier
  const [notes, setNotes] = useState('');
  
  // Anti-double click lock
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

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
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Silakan isi Alamat Pengantaran.');
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
        delivery_address: orderType === 'delivery' ? deliveryAddress : null,
        payment_method: paymentMethod,
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
      
      // Clear cart upon successful order creation
      clearCart();
      onClose();
      onOrderSuccess(result.data);
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">Konfirmasi Pemesanan</h3>
            <p className="text-xs text-neutral-400">Total Tagihan: <span className="font-bold text-red-400">Rp {totalAmount.toLocaleString('id-ID')}</span></p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg bg-neutral-800 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                Nama Pemesan:
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Farrel / Mas Jerry"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                No. WhatsApp:
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Order Type */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Tipe Pesanan:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dine_in', label: 'Makan di Meja', icon: '🍽️' },
                { id: 'takeaway', label: 'Bawa Pulang', icon: '🛍️' },
                { id: 'delivery', label: 'Kirim Alamat', icon: '🛵' },
              ].map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setOrderType(type.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    orderType === type.id
                      ? 'border-red-500 bg-red-500/15 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-base block mb-0.5">{type.icon}</span>
                  <span className="text-[11px] block">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Input Meja / Alamat */}
          {orderType === 'dine_in' && (
            <div>
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                Nomor Meja:
              </label>
              <input
                type="text"
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Contoh: 04 / Meja Depan"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {orderType === 'delivery' && (
            <div>
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                Alamat Lengkap Pengantaran:
              </label>
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Alamat jalan, nomor rumah, patokan..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Dual Payment Options */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Pilih Metode Pembayaran:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Opsi 1: Bayar Online */}
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'online'
                    ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${paymentMethod === 'online' ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-white">Bayar di Web</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  QRIS (BCA, GoPay, Dana, dll.) & Virtual Account langsung dari HP.
                </p>
              </button>

              {/* Opsi 2: Bayar di Kasir */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cashier')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'cashier'
                    ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/50'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${paymentMethod === 'cashier' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>
                    <Banknote className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-white">Bayar di Kasir</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Bayar tunai / QRIS manual di meja kasir setelah memesan.
                </p>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Catatan Pesanan Keseluruhan (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: tolong buat cepat, sendok plastik 2"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-xl shadow-red-700/30 transition-all active:scale-95 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pesanan Aman...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'online' ? 'Lanjut Bayar Online (QRIS)' : 'Kirim Pesanan ke Kasir'}
                  </span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-neutral-500 mt-2">
              🔒 Dilengkapi proteksi transaksi aman & pencegahan pembayaran ganda.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

