import React from 'react';
import { CheckCircle2, MessageSquare, X, ReceiptText } from 'lucide-react';

export default function OrderSuccessModal({ orderData, onClose, onOpenHistory }) {
  if (!orderData) return null;

  const currentOrder = orderData.order;
  if (!currentOrder) return null;

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
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="font-extrabold text-xl text-white mb-1">Pesanan Berhasil Dikirim!</h3>
        <p className="text-xs text-neutral-400 mb-4">
          Pesanan Anda telah dicatat oleh sistem kasir & dapur Waroeng Pedes Puooll.
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
              {currentOrder.order_type === 'dine_in'
                ? `Makan di Meja (${currentOrder.table_number || '-'})`
                : 'Bawa Pulang (Takeaway)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Total Tagihan</span>
            <span className="font-extrabold text-sm text-white">
              Rp {Number(currentOrder.total_amount).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
            <span className="text-neutral-400">Metode Pembayaran</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {isPaid ? '✓ LUNAS' : '💰 BAYAR DI KASIR'}
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 mb-5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs text-left">
          💡 <strong>Petunjuk:</strong> Silakan sebutkan nama atau nomor pesanan <span className="text-red-400 font-mono font-bold">#{currentOrder.order_code}</span> saat melakukan pembayaran di kasir.
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
              onClose();
              if (onOpenHistory) onOpenHistory();
            }}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Lihat Riwayat Pesanan Saya</span>
          </button>
        </div>
      </div>
    </div>
  );
}
