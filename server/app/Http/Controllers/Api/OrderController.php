<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\MidtransPaymentService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected MidtransPaymentService $paymentService;

    public function __construct(MidtransPaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Membuat pesanan baru (Dine-in / Takeaway / Delivery)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:25',
            'order_type' => 'required|in:dine_in,takeaway,delivery',
            'table_number' => 'nullable|string|max:20|required_if:order_type,dine_in',
            'delivery_address' => 'nullable|string|max:500|required_if:order_type,delivery',
            'payment_method' => 'required|in:cashier,online',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.spicy_level' => 'nullable|integer|min:0|max:5',
            'items.*.notes' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {
            // Hitung harga asli dari database (mencegah manipulasi harga dari client)
            $menuIds = collect($validated['items'])->pluck('menu_id');
            $menus = Menu::whereIn('id', $menuIds)->get()->keyBy('id');

            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($validated['items'] as $item) {
                $menu = $menus->get($item['menu_id']);
                if (!$menu || !$menu->is_available) {
                    throw new Exception("Menu '{$menu->name}' saat ini tidak tersedia.");
                }

                $subtotal = $menu->price * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItemsData[] = [
                    'menu_id' => $menu->id,
                    'quantity' => $item['quantity'],
                    'price' => $menu->price,
                    'spicy_level' => $menu->is_spicy_customizable ? ($item['spicy_level'] ?? 0) : 0,
                    'notes' => $item['notes'] ?? null,
                ];
            }

            // Generate unique Order Code
            $today = Carbon::now()->format('Ymd');
            $randomStr = strtoupper(Str::random(4));
            $orderCode = "PUOOLL-{$today}-{$randomStr}";

            $order = Order::create([
                'order_code' => $orderCode,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'order_type' => $validated['order_type'],
                'table_number' => $validated['table_number'] ?? null,
                'delivery_address' => $validated['delivery_address'] ?? null,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'unpaid',
                'order_status' => 'pending',
                'total_amount' => $totalAmount,
                'notes' => $validated['notes'] ?? null,
                'payment_idempotency_key' => Str::uuid()->toString(),
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // Jika pilih bayar online di website, generate Snap Token
            $snapToken = null;
            if ($order->payment_method === 'online') {
                $order->load('items.menu');
                $snapToken = $this->paymentService->createSnapToken($order);
                $order->update(['snap_token' => $snapToken]);
            }

            $order->load('items.menu');

            // Format WhatsApp Link
            $waMessage = $this->formatWhatsAppMessage($order);
            $waroengPhone = env('WAROENG_WA_PHONE', '6281234567890');
            $waUrl = "https://wa.me/{$waroengPhone}?text=" . rawurlencode($waMessage);

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan berhasil dibuat!',
                'data' => [
                    'order' => $order,
                    'snap_token' => $snapToken,
                    'whatsapp_url' => $waUrl,
                    'whatsapp_message' => $waMessage,
                ]
            ], 201);
        });
    }

    /**
     * Fitur Proteksi Anti-Double Payment saat pelanggan klik bayar di web
     */
    public function pay(Request $request, int $id): JsonResponse
    {
        return DB::transaction(function () use ($id) {
            // Lock order row dengan pessimistic lock
            $order = Order::where('id', $id)->lockForUpdate()->firstOrFail();

            // 1. Guard jika pesanan sudah berstatus lunas
            if ($order->payment_status === 'paid') {
                return response()->json([
                    'status' => 'error',
                    'code' => 'ALREADY_PAID',
                    'message' => 'Pesanan ini sudah berhasil dibayar sebelumnya. Menolak transaksi ganda.',
                    'data' => $order
                ], 409);
            }

            // 2. Pre-Check status transaksi ke Midtrans jika sebelumnya pernah mencoba bayar
            $remoteStatus = $this->paymentService->checkTransactionStatus($order->order_code);
            if ($remoteStatus) {
                $trxStatus = $remoteStatus['transaction_status'] ?? '';
                if (in_array($trxStatus, ['settlement', 'capture'])) {
                    $order->update([
                        'payment_status' => 'paid',
                        'order_status' => 'cooking',
                        'paid_at' => Carbon::now(),
                    ]);

                    return response()->json([
                        'status' => 'success',
                        'message' => 'Pembayaran Anda sudah berhasil diverifikasi di server Payment Gateway.',
                        'data' => $order
                    ]);
                }
            }

            // 3. Jika belum lunas, buat / refresh Snap Token baru
            $order->load('items.menu');
            $snapToken = $this->paymentService->createSnapToken($order);
            $order->update(['snap_token' => $snapToken]);

            return response()->json([
                'status' => 'success',
                'message' => 'Sesi pembayaran siap.',
                'data' => [
                    'order' => $order,
                    'snap_token' => $snapToken
                ]
            ]);
        });
    }

    /**
     * Cek status pesanan live dari frontend
     */
    public function show(string $orderCode): JsonResponse
    {
        $order = Order::with(['items.menu', 'paymentLogs'])
            ->where('order_code', $orderCode)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }

    /**
     * List pesanan untuk kasir & dapur
     */
    public function adminOrders(Request $request): JsonResponse
    {
        $query = Order::with('items.menu')->latest();

        if ($request->filled('status')) {
            $query->where('order_status', $request->query('status'));
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->query('payment_status'));
        }

        $orders = $query->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * Kasir menandai pesanan lunas tunai (Bayar di Kasir)
     */
    public function markCashierPaid(int $id): JsonResponse
    {
        return DB::transaction(function () use ($id) {
            $order = Order::where('id', $id)->lockForUpdate()->firstOrFail();

            if ($order->payment_status === 'paid') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pesanan ini sudah lunas.',
                ], 400);
            }

            $order->update([
                'payment_status' => 'paid',
                'order_status' => $order->order_status === 'pending' ? 'cooking' : $order->order_status,
                'paid_at' => Carbon::now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan berhasil ditandai Lunas di Kasir.',
                'data' => $order
            ]);
        });
    }

    /**
     * Dapur mengupdate status proses memasak / pesanan selesai
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'order_status' => 'required|in:pending,cooking,ready,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['order_status' => $validated['order_status']]);

        return response()->json([
            'status' => 'success',
            'message' => "Status pesanan diubah menjadi: {$validated['order_status']}",
            'data' => $order
        ]);
    }

    /**
     * Helper pemformat pesan struk pesanan ke WhatsApp
     */
    private function formatWhatsAppMessage(Order $order): string
    {
        $typeLabel = match ($order->order_type) {
            'dine_in' => "Makan di Tempat (Meja: {$order->table_number})",
            'takeaway' => "Bawa Pulang (Takeaway / Ambil Sendiri)",
            'delivery' => "Kirim ke Alamat ({$order->delivery_address})",
        };

        $payLabel = $order->payment_method === 'online'
            ? ($order->payment_status === 'paid' ? 'LUNAS (Bayar di Web)' : 'Online (Menunggu Pembayaran)')
            : 'Bayar Tunai di Kasir';

        $text = "🌶️ *PESANAN BARU - WAROENG PEDES PUOOLL* 🌶️\n\n";
        $text .= "Kode Pesanan: *#{$order->order_code}*\n";
        $text .= "Nama Pemesan: {$order->customer_name}\n";
        $text .= "No. WhatsApp: {$order->customer_phone}\n";
        $text .= "Tipe Pesanan: {$typeLabel}\n";
        $text .= "Metode Bayar: {$payLabel}\n";
        $text .= "--------------------------------------\n";

        foreach ($order->items as $item) {
            $menuName = $item->menu ? $item->menu->name : 'Item';
            $spicyText = $item->spicy_level > 0 ? " (Level {$item->spicy_level})" : "";
            $subtotalFormatted = number_format($item->price * $item->quantity, 0, ',', '.');
            
            $text .= "• {$item->quantity}x {$menuName}{$spicyText} = Rp {$subtotalFormatted}\n";
            if (!empty($item->notes)) {
                $text .= "  _Catatan: {$item->notes}_\n";
            }
        }

        $totalFormatted = number_format($order->total_amount, 0, ',', '.');
        $text .= "--------------------------------------\n";
        $text .= "*TOTAL: Rp {$totalFormatted}*\n\n";

        if (!empty($order->notes)) {
            $text .= "Catatan Tambahan: {$order->notes}\n\n";
        }

        $text .= "Mohon segera diproses ya dapur Waroeng Pedes Puooll! 🔥";

        return $text;
    }
}

