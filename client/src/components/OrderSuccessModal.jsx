import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageSquare, X, ReceiptText } from 'lucide-react';

export default function OrderSuccessModal({ orderData, onClose, onOpenHistory }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (orderData) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [orderData]);

  if (!orderData && !isVisible) return null;

  const currentOrder = orderData?.order;
  if (!currentOrder) return null;

  const isPaid = currentOrder.payment_status === 'paid';

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-200 ease-out overflow-y-auto ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 text-center my-auto transition-all duration-200 ease-out transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Icon */}
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white mb-1">Pesanan Berhasil Dikirim!</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          Pesanan Anda telah dicatat oleh sistem kasir & dapur Waroeng Pedes Puooll.
        </p>

        {/* Order Ticket Card */}
        <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-left space-y-2 mb-5">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800/80 pb-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Kode Pesanan</span>
            <span className="font-extrabold text-sm text-red-600 dark:text-red-400 font-mono">
              #{currentOrder.order_code}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Pemesan</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentOrder.customer_name}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Tipe Pesanan</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {currentOrder.order_type === 'dine_in'
                ? `Makan di Meja (${currentOrder.table_number || '-'})`
                : 'Bawa Pulang (Takeaway)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Total Tagihan</span>
            <span className="font-extrabold text-sm text-neutral-900 dark:text-white">
              Rp {Number(currentOrder.total_amount).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800/80 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Metode Pembayaran</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              {isPaid ? '✓ LUNAS' : '💰 BAYAR DI KASIR'}
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 mb-5 rounded-xl bg-neutral-100/70 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs text-left">
          💡 <strong>Petunjuk:</strong> Silakan sebutkan nama atau nomor pesanan <span className="text-red-600 dark:text-red-400 font-mono font-bold">#{currentOrder.order_code}</span> saat melakukan pembayaran di kasir.
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Tombol WhatsApp Kasir */}
          {orderData.whatsapp_url && (
            <a
              href={orderData.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Struk ke WhatsApp Warung</span>
            </a>
          )}

          {/* Tombol Buka Riwayat Pesanan */}
          <button
            onClick={() => {
              handleClose();
              setTimeout(() => {
                if (onOpenHistory) onOpenHistory();
              }, 220);
            }}
            className="w-full flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Lihat Riwayat Pesanan Saya</span>
          </button>
        </div>
      </div>
    </div>
  );
}