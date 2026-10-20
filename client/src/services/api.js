const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Ambil daftar kategori
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Gagal mengambil kategori');
    return res.json();
  },

  // Ambil menu dengan filter
  async getMenus(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/menus${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil katalog menu');
    return res.json();
  },

  // Buat pesanan baru
  async createOrder(payload) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal membuat pesanan');
    return data;
  },

  // Bayar pesanan (Anti-Double Pay Protected)
  async payOrder(orderId) {
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
  },

  // Cek status pesanan live
  async getOrderStatus(orderCode) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderCode}`);
    if (!res.ok) throw new Error('Gagal memuat status pesanan');
    return res.json();
  },

  // Admin: Ambil semua pesanan
  async getAdminOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/admin/orders${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Gagal mengambil daftar pesanan');
    return res.json();
  },

  // Admin: Tandai lunas di kasir
  async markCashierPaid(orderId) {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/cashier-pay`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menandai lunas');
    return data;
  },

  // Admin: Update status pesanan (cooking, ready, completed)
  async updateOrderStatus(orderId, orderStatus) {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: orderStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengubah status pesanan');
    return data;
  },
};

