import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RefreshCw, CheckCircle, Clock, Utensils, AlertCircle, Banknote, Flame } from 'lucide-react';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPayment) params.payment_status = filterPayment;

      const res = await api.getAdminOrders(params);
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000); // Polling order baru tiap 8 detik
    return () => clearInterval(interval);
  }, [filterStatus, filterPayment]);

  const handleMarkPaid = async (orderId) => {
    setActionLoading(`paid-${orderId}`);
    try {
      await api.markCashierPaid(orderId);
      await fetchOrders();
    } catch (err) {
      alert(err.message || 'Gagal menandai lunas');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(`status-${orderId}`);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      alert(err.message || 'Gagal mengubah status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>👨‍🍳</span> Panel Monitor Kasir & Dapur
          </h2>
          <p className="text-xs text-neutral-400">
            Pantau pesanan masuk secara real-time, terima pembayaran kasir, dan update status masak.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-neutral-500 font-semibold mr-1">Filter Status:</span>
        {[
          { label: 'Semua Status', val: '' },
          { label: 'Pending / Baru', val: 'pending' },
          { label: 'Sedang Dimasak', val: 'cooking' },
          { label: 'Siap Disajikan', val: 'ready' },
          { label: 'Selesai', val: 'completed' },
        ].map(item => (
          <button
            key={item.val}
            onClick={() => setFilterStatus(item.val)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterStatus === item.val
                ? 'bg-red-600 text-white border-red-500 font-bold'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length === 0 && !loading && (
          <div className="col-span-full bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 text-center text-neutral-500">
            <span className="text-4xl block mb-2">📋</span>
            <p className="font-semibold text-neutral-300">Belum Ada Pesanan Masuk</p>
            <p className="text-xs text-neutral-500 mt-1">Pesanan pelanggan akan otomatis muncul di sini secara real-time.</p>
          </div>
        )}

        {orders.map(order => {
          const isPaid = order.payment_status === 'paid';
          const isCashier = order.payment_method === 'cashier';

          return (
            <div
              key={order.id}
              className={`bg-neutral-900 border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                !isPaid && isCashier
                  ? 'border-amber-500/50 bg-amber-950/10 shadow-lg shadow-amber-950/20'
                  : order.order_status === 'cooking'
                  ? 'border-orange-500/40 bg-orange-950/10'
                  : 'border-neutral-800'
              }`}
            >
              <div>
                {/* Header Ticket */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <span className="font-mono font-extrabold text-sm text-red-400 block">
                      #{order.order_code}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {/* Status Masak Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.order_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      order.order_status === 'cooking' ? 'bg-orange-500/20 text-orange-400' :
                      order.order_status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                      order.order_status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {order.order_status === 'pending' && '⏳ Menunggu'}
                      {order.order_status === 'cooking' && '🔥 Sedang Dimasak'}
                      {order.order_status === 'ready' && '🍽️ Siap Saji'}
                      {order.order_status === 'completed' && '✅ Selesai'}
                    </span>

                    {/* Status Pembayaran Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPaid 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/20 text-amber-400 animate-pulse'
                    }`}>
                      {isPaid ? '✓ LUNAS' : isCashier ? '💰 BAYAR KASIR' : '⏳ BELUM BAYAR'}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="py-2.5 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Pemesan:</span>
                    <span className="font-bold text-neutral-200">{order.customer_name} ({order.customer_phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Tipe:</span>
                    <span className="font-semibold text-neutral-300">
                      {order.order_type === 'dine_in' && `Makan di Meja (${order.table_number || '-'})`}
                      {order.order_type === 'takeaway' && 'Bawa Pulang'}
                      {order.order_type === 'delivery' && `Antar (${order.delivery_address || '-'})`}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-neutral-950/80 rounded-xl p-3 space-y-2 border border-neutral-800/80 my-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Daftar Menu:</span>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-center text-neutral-200 font-semibold gap-1">
                        <span>{item.quantity}x {item.menu?.name || 'Menu'}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.sambal_type && (
                            <span className="text-[10px] bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded font-medium">
                              {item.sambal_type}
                            </span>
                          )}
                          {item.portion_size && (
                            <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                              Uk. {item.portion_size}
                            </span>
                          )}
                          {item.spicy_level > 0 && (
                            <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 flex items-center gap-0.5 font-bold">
                              <Flame className="w-2.5 h-2.5 fill-red-500" />
                              {item.spicy_level === 1 ? 'Play Group' :
                               item.spicy_level === 2 ? 'TK' :
                               item.spicy_level === 3 ? 'SD' :
                               item.spicy_level === 4 ? 'SMP' :
                               item.spicy_level === 5 ? 'SMA' :
                               item.spicy_level === 6 ? 'Kuliah 🔥' : `Lv. ${item.spicy_level}`}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.notes && (
                        <p className="text-[10px] text-neutral-400 italic mt-0.5 pl-2 border-l border-neutral-700">
                          Catatan: {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                  {order.notes && (
                    <div className="pt-2 border-t border-neutral-800 text-[11px] text-amber-400 italic">
                      ⚠️ Catatan Pesanan: {order.notes}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-sm font-extrabold text-white py-1">
                  <span>Total Tagihan:</span>
                  <span className="text-red-400">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-800 space-y-2 mt-2">
                {/* Tombol Kasir: Tandai Lunas jika belum bayar */}
                {!isPaid && (
                  <button
                    onClick={() => handleMarkPaid(order.id)}
                    disabled={actionLoading === `paid-${order.id}`}
                    className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold py-2 px-3 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Tandai Lunas Tunai di Kasir</span>
                  </button>
                )}

                {/* Tombol Alur Dapur */}
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'cooking')}
                    disabled={order.order_status === 'cooking' || actionLoading === `status-${order.id}`}
                    className="bg-neutral-800 hover:bg-orange-600 disabled:bg-orange-600/30 disabled:text-orange-400 text-neutral-300 hover:text-white py-1.5 rounded-lg font-bold transition-all"
                  >
                    Masak 🔥
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                    disabled={order.order_status === 'ready' || actionLoading === `status-${order.id}`}
                    className="bg-neutral-800 hover:bg-blue-600 disabled:bg-blue-600/30 disabled:text-blue-400 text-neutral-300 hover:text-white py-1.5 rounded-lg font-bold transition-all"
                  >
                    Siap 🍽️
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                    disabled={order.order_status === 'completed' || actionLoading === `status-${order.id}`}
                    className="bg-neutral-800 hover:bg-emerald-600 disabled:bg-emerald-600/30 disabled:text-emerald-400 text-neutral-300 hover:text-white py-1.5 rounded-lg font-bold transition-all"
                  >
                    Selesai ✅
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

