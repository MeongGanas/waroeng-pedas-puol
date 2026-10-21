import { DUMMY_CATEGORIES, DUMMY_MENUS } from '../data/dummyData';

const API_BASE_URL = 'http://localhost:8000/api';
const WAROENG_WA_PHONE = '6285230697857';

const LEVEL_NAMES = {
  0: 'Nol Pedas',
  1: 'Play Group',
  2: 'TK',
  3: 'SD',
  4: 'SMP',
  5: 'SMA',
  6: 'Kuliah 🔥',
};

// Helper filter untuk data dummy
function filterDummyMenus(params = {}) {
  let result = [...DUMMY_MENUS];

  if (params.category) {
    result = result.filter(m => m.category?.slug === params.category);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(m => 
      m.name.toLowerCase().includes(q) || 
      (m.description && m.description.toLowerCase().includes(q))
    );
  }

  if (params.best_seller) {
    result = result.filter(m => m.is_best_seller);
  }

  return result;
}

// Helper pembuat struk WhatsApp saat mode offline
function formatOfflineWhatsApp(order) {
  const typeLabel = order.order_type === 'dine_in'
    ? `Makan di Tempat (Meja: ${order.table_number || '-'})`
    : order.order_type === 'takeaway'
    ? 'Bawa Pulang (Takeaway)'
    : `Kirim ke Alamat (${order.delivery_address || '-'})`;

  const payLabel = order.payment_method === 'online'
    ? (order.payment_status === 'paid' ? 'LUNAS (Bayar di Web)' : 'Online (Menunggu Pembayaran)')
    : 'Bayar Tunai di Kasir';

  let text = "🌶️ *PESANAN BARU - WAROENG PEDES PUOOLL* 🌶️\n\n";
  text += `Kode Pesanan: *#${order.order_code}*\n`;
  text += `Nama Pemesan: ${order.customer_name}\n`;
  text += `No. WhatsApp: ${order.customer_phone}\n`;
  text += `Tipe Pesanan: ${typeLabel}\n`;
  text += `Metode Bayar: ${payLabel}\n`;
  text += "--------------------------------------\n";

  order.items.forEach(item => {
    const details = [];
    if (item.portion_size) details.push(`Ukuran: ${item.portion_size}`);
    if (item.sambal_type) details.push(`Sambal: ${item.sambal_type}`);
    if (item.spicy_level > 0) details.push(`Level: ${LEVEL_NAMES[item.spicy_level] || item.spicy_level}`);

    const detailStr = details.length > 0 ? ` (${details.join(' | ')})` : '';
    const subtotal = (item.price * item.quantity).toLocaleString('id-ID');
    text += `• ${item.quantity}x ${item.menu?.name || 'Menu'}${detailStr} = Rp ${subtotal}\n`;
    if (item.notes) text += `  _Catatan: ${item.notes}_\n`;
  });

  text += "--------------------------------------\n";
  text += `*TOTAL: Rp ${order.total_amount.toLocaleString('id-ID')}*\n\n`;
  if (order.notes) text += `Catatan Tambahan: ${order.notes}\n\n`;
  text += "Mohon segera diproses ya dapur Waroeng Pedes Puooll! 🔥";

  return text;
}

export const api = {
  // Ambil daftar kategori (dengan fallback dummy data)
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { 
        signal: AbortSignal.timeout(3000) 
      });
      if (!res.ok) throw new Error('Bad response');
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        return data;
      }
      return { status: 'success', data: DUMMY_CATEGORIES, is_dummy: true };
    } catch (err) {
      console.warn('Backend server tidak merespons, menggunakan fallback data dummy kategori.');
      return { status: 'success', data: DUMMY_CATEGORIES, is_dummy: true };
    }
  },

  // Ambil menu dengan filter (dengan fallback dummy data)
  async getMenus(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/menus${query ? `?${query}` : ''}`;
      const res = await fetch(url, { 
        signal: AbortSignal.timeout(3000) 
      });
      if (!res.ok) throw new Error('Bad response');
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        return data;
      }
      const filtered = filterDummyMenus(params);
      return { status: 'success', count: filtered.length, data: filtered, is_dummy: true };
    } catch (err) {
      console.warn('Backend server tidak merespons, menggunakan fallback data dummy menu.');
      const filtered = filterDummyMenus(params);
      return { status: 'success', count: filtered.length, data: filtered, is_dummy: true };
    }
  },

  // Buat pesanan baru (dengan fallback pemesanan via WhatsApp langsung)
  async createOrder(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Server error');
      }
      return await res.json();
    } catch (err) {
      console.warn('Memproses pesanan via fallback lokal & WhatsApp:', err.message);

      let totalAmount = 0;
      const items = payload.items.map(it => {
        const menu = DUMMY_MENUS.find(m => m.id === it.menu_id) || { name: 'Menu Waroeng', price: 15000 };
        const price = menu.price;
        totalAmount += price * it.quantity;
        return {
          ...it,
          menu,
          price,
        };
      });

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderCode = `PUOOLL-${dateStr}-${rand}`;

      const mockOrder = {
        id: Date.now(),
        order_code: orderCode,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        order_type: payload.order_type,
        table_number: payload.table_number,
        delivery_address: payload.delivery_address,
        payment_method: payload.payment_method,
        payment_status: 'unpaid',
        order_status: 'pending',
        total_amount: totalAmount,
        notes: payload.notes,
        items: items,
        created_at: new Date().toISOString(),
      };

      // Simpan ke localStorage untuk rekap lokal
      try {
        const existingOrders = JSON.parse(localStorage.getItem('waroeng_local_orders') || '[]');
        existingOrders.unshift(mockOrder);
        localStorage.setItem('waroeng_local_orders', JSON.stringify(existingOrders));
      } catch (e) {
        console.error(e);
      }

      const waMessage = formatOfflineWhatsApp(mockOrder);
      const waUrl = `https://wa.me/${WAROENG_WA_PHONE}?text=${encodeURIComponent(waMessage)}`;

      return {
        status: 'success',
        message: 'Pesanan berhasil dibuat (Siap dikirim ke WhatsApp)!',
        data: {
          order: mockOrder,
          snap_token: `mock-snap-${orderCode}`,
          whatsapp_url: waUrl,
          whatsapp_message: waMessage,
        }
      };
    }
  },

  // Bayar pesanan (Anti-Double Pay Protected)
  async payOrder(orderId) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.message || 'Gagal memproses pembayaran');
        err.code = data.code;
        err.data = data.data;
        throw err;
      }
      return data;
    } catch (err) {
      if (err.code === 'ALREADY_PAID') throw err;
      return {
        status: 'success',
        message: 'Sesi simulasi pembayaran online siap.',
        data: {
          snap_token: `mock-snap-order-${orderId}`,
        }
      };
    }
  },

  // Cek status pesanan live
  async getOrderStatus(orderCode) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderCode}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('Order not found');
      return await res.json();
    } catch {
      // Cek dari localStorage
      const localOrders = JSON.parse(localStorage.getItem('waroeng_local_orders') || '[]');
      const found = localOrders.find(o => o.order_code === orderCode);
      return {
        status: 'success',
        data: found || null,
      };
    }
  },

  // Admin: Ambil semua pesanan
  async getAdminOrders(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/admin/orders${query ? `?${query}` : ''}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('Bad response');
      return await res.json();
    } catch {
      const localOrders = JSON.parse(localStorage.getItem('waroeng_local_orders') || '[]');
      return {
        status: 'success',
        data: {
          data: localOrders,
        }
      };
    }
  },

  // Admin: Tandai lunas di kasir
  async markCashierPaid(orderId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/cashier-pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Bad response');
      return await res.json();
    } catch {
      // Update local storage
      const localOrders = JSON.parse(localStorage.getItem('waroeng_local_orders') || '[]');
      const updated = localOrders.map(o => {
        if (o.id === orderId) {
          return { ...o, payment_status: 'paid', order_status: 'cooking' };
        }
        return o;
      });
      localStorage.setItem('waroeng_local_orders', JSON.stringify(updated));
      return { status: 'success', message: 'Ditandai lunas (Lokal)' };
    }
  },

  // Admin: Update status pesanan (cooking, ready, completed)
  async updateOrderStatus(orderId, orderStatus) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: orderStatus }),
      });
      if (!res.ok) throw new Error('Bad response');
      return await res.json();
    } catch {
      // Update local storage
      const localOrders = JSON.parse(localStorage.getItem('waroeng_local_orders') || '[]');
      const updated = localOrders.map(o => {
        if (o.id === orderId) {
          return { ...o, order_status: orderStatus };
        }
        return o;
      });
      localStorage.setItem('waroeng_local_orders', JSON.stringify(updated));
      return { status: 'success', message: 'Status diupdate (Lokal)' };
    }
  },
};
