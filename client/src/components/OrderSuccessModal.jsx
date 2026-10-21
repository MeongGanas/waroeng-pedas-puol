import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, MessageSquare, CreditCard, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function OrderSuccessModal({ orderData, onClose }) {
  const [currentOrder, setCurrentOrder] = useState(orderData?.order || null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  if (!orderData || !currentOrder) return null;

  // Polling status pembayaran setiap 5 detik jika metode online dan belum lunas
  useEffect(() => {
    if (currentOrder.payment_method === 'online' && currentOrder.payment_status !== 'paid') {
      const interval = setInterval(async () => {
        try {
          const res = await api.getOrderStatus(currentOrder.order_code);
          if (res.data) {
            setCurrentOrder(res.data);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentOrder.order_code, currentOrder.payment_method, currentOrder.payment_status]);

  const handleRefreshStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const res = await api.getOrderStatus(currentOrder.order_code);
      if (res.data) {
        setCurrentOrder(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handlePayNow = () => {
    setPaymentError('');

    // Cek guard status sebelum buka popup
    if (currentOrder.payment_status === 'paid') {
      setPaymentError('Pesanan ini sudah berstatus LUNAS. Pembayaran ganda dicegah.');
      return;
    }

    const token = orderData.snap_token || currentOrder.snap_token;

    // Jika window.snap tersedia (Midtrans JS SDK)
    if (window.snap && token && !token.startsWith('mock-')) {
      window.snap.pay(token, {
        onSuccess: function (result) {
          handleRefreshStatus();
        },
        onPending: function (result) {
          handleRefreshStatus();
        },
        onError: function (result) {
          setPaymentError('Terjadi kesalahan pembayaran via Midtrans.');
        },
        onClose: function () {
          handleRefreshStatus();
        }
      });
    } else {
      // Simulator mode jika belum isi credential asli
      const simulatedConfirm = window.confirm(
        `[SIMULASI DEV PEMBAYARAN ONLINE]\n\nAnda sedang melakukan pembayaran QRIS sebesar Rp ${currentOrder.total_amount.toLocaleString('id-ID')} untuk Pesanan #${currentOrder.order_code}.\n\nKlik OK untuk mensimulasikan Pembayaran Berhasil!`
      );

      if (simulatedConfirm) {
        // Panggil endpoint webhook/admin untuk simulasi lunas
        api.markCashierPaid(currentOrder.id).then(() => {
          handleRefreshStatus();
        });
      }
    }
  };

  const isPaid = currentOrder.payment_status === 'paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 text-center my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-lg bg-neutral-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Icon */}
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="font-extrabold text-xl text-white mb-1">Pesanan Berhasil Dibuat!</h3>
        <p className="text-xs text-neutral-400 mb-4">
          Pesanan Anda telah dicatat oleh sistem dapur Waroeng Pedes Puooll.
        </p>

        {/* Order Ticket Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-left space-y-2 mb-5">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
            <span className="text-xs text-neutral-400">Kode Pesanan</span>
            <span className="font-extrabold text-sm text-red-400 font-mono">
              #{currentOrder.order_code}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Pemesan</span>
            <span className="font-semibold text-neutral-200">{currentOrder.customer_name}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Tipe Pesanan</span>
            <span className="font-semibold text-neutral-200">
              {currentOrder.order_type === 'dine_in' && `Makan di Meja (${currentOrder.table_number})`}
              {currentOrder.order_type === 'takeaway' && 'Bawa Pulang'}
              {currentOrder.order_type === 'delivery' && 'Kirim Alamat'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Total Tagihan</span>
            <span className="font-extrabold text-sm text-white">
              Rp {currentOrder.total_amount.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
            <span className="text-neutral-400">Status Pembayaran</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              isPaid
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {isPaid ? '✓ LUNAS' : '⏳ BELUM LUNAS'}
            </span>
          </div>
        </div>

        {paymentError && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/50 border border-red-500 text-red-300 text-xs flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{paymentError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Tombol Bayar Sekarang (Jika Online & Belum Lunas) */}
          {currentOrder.payment_method === 'online' && !isPaid && (
            <button
              onClick={handlePayNow}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-700/20 transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Buka QRIS / Bayar Online Sekarang</span>
            </button>
          )}

          {/* Tombol WhatsApp Kasir */}
          <a
            href={orderData.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-700/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kirim Bukti / Struk ke WhatsApp Warung</span>
          </a>

          {/* Cek Status Live Button */}
          {!isPaid && (
            <button
              onClick={handleRefreshStatus}
              disabled={isCheckingStatus}
              className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-white py-2 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
              <span>Perbarui Status Pembayaran</span>
            </button>
          )}

          {isPaid && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs">
              🎉 Pembayaran sudah lunas! Dapur sedang memasak pesanan Anda dengan pedas puooll!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

