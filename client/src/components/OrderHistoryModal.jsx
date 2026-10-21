import React, { useState, useEffect } from 'react';
import { X, History, MessageSquare, Trash2, Clock } from 'lucide-react';

export default function OrderHistoryModal({ isOpen, onClose }) {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const loadHistory = () => {
    try {
      const data = JSON.parse(localStorage.getItem('waroeng_customer_order_history') || '[]');
      setHistoryOrders(data);
    } catch {
      setHistoryOrders([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
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

  const handleClearHistory = () => {
    if (window.confirm('Hapus seluruh riwayat pemesanan di perangkat ini?')) {
      localStorage.removeItem('waroeng_customer_order_history');
      setHistoryOrders([]);
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
        className={`relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[85vh] transition-all duration-200 ease-out transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-500/30">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Riwayat Pemesanan Saya</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Tersimpan di perangkat ini ({historyOrders.length} pesanan)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {historyOrders.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors"
                title="Hapus Riwayat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white p-1.5 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 no-scrollbar">
          {historyOrders.length === 0 ? (
            <div className="py-14 text-center text-neutral-500">
              <Clock className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
              <p className="font-bold text-neutral-800 dark:text-neutral-300 text-sm">Belum Ada Riwayat Pesanan</p>
              <p className="text-xs text-neutral-500 mt-1">Pesanan yang Anda buat akan otomatis tersimpan di sini.</p>
            </div>
          ) : (
            historyOrders.map((order, idx) => {
              const isPaid = order.payment_status === 'paid';
              const dateStr = order.created_at
                ? new Date(order.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Baru saja';

              return (
                <div 
                  key={order.id || idx}
                  className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 space-y-2.5"
                >
                  {/* Top info */}
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800/80 pb-2">
                    <div>
                      <span className="font-mono font-extrabold text-xs sm:text-sm text-red-600 dark:text-red-400">
                        #{order.order_code}
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200/80 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {order.order_type === 'dine_in' ? `Meja ${order.table_number || '-'}` : 'Bawa Pulang'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {isPaid ? 'Lunas' : 'Bayar Kasir'}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1 text-xs">
                    {order.items?.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between text-neutral-700 dark:text-neutral-300 text-[11px]">
                        <span className="truncate pr-2">
                          {item.quantity}x {item.menu?.name || 'Menu'}
                          {item.sambal_type && ` (${item.sambal_type})`}
                          {item.spicy_level > 0 && ` [Lv ${item.spicy_level}]`}
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400 font-mono shrink-0">
                          Rp {((item.price || 0) * (item.quantity || 1)).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer order card */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Total Pembayaran</span>
                      <span className="font-extrabold text-sm text-neutral-900 dark:text-white">
                        Rp {Number(order.total_amount || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    {order.whatsapp_url && (
                      <a
                        href={order.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Kirim ke WA</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}