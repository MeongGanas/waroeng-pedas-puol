<?php

namespace App\Services;

use App\Models\Order;
use Exception;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransPaymentService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key', env('MIDTRANS_SERVER_KEY', ''));
        Config::$isProduction = (bool) config('services.midtrans.is_production', env('MIDTRANS_IS_PRODUCTION', false));
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    /**
     * Cek status transaksi langsung ke server Midtrans (Pre-Check Anti-Double Pay)
     */
    public function checkTransactionStatus(string $orderCode): ?array
    {
        try {
            if (empty(Config::$serverKey) || str_contains(Config::$serverKey, 'YOUR_SERVER_KEY')) {
                return null;
            }
            $status = Transaction::status($orderCode);
            return (array) $status;
        } catch (Exception $e) {
            Log::info("Midtrans status check for {$orderCode}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Batalkan transaksi di Midtrans jika expired atau diganti invoice baru
     */
    public function cancelTransaction(string $orderCode): bool
    {
        try {
            if (empty(Config::$serverKey) || str_contains(Config::$serverKey, 'YOUR_SERVER_KEY')) {
                return false;
            }
            Transaction::cancel($orderCode);
            return true;
        } catch (Exception $e) {
            Log::warning("Failed to cancel Midtrans transaction {$orderCode}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Generate Snap Token untuk pembayaran di website
     */
    public function createSnapToken(Order $order): ?string
    {
        // Jika server key masih placeholder / belum diisi user, sediakan mock snap token untuk simulasi dev
        if (empty(Config::$serverKey) || str_contains(Config::$serverKey, 'YOUR_SERVER_KEY')) {
            return 'mock-snap-token-' . $order->order_code . '-' . time();
        }

        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'id' => (string) $item->menu_id,
                'price' => (int) round($item->price),
                'quantity' => (int) $item->quantity,
                'name' => mb_substr($item->menu ? $item->menu->name : 'Menu Waroeng', 0, 50),
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => $order->order_code,
                'gross_amount' => (int) round($order->total_amount),
            ],
            'customer_details' => [
                'first_name' => $order->customer_name,
                'phone' => $order->customer_phone,
            ],
            'item_details' => $items,
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return $snapToken;
        } catch (Exception $e) {
            Log::error("Midtrans Snap Error for {$order->order_code}: " . $e->getMessage());
            throw new Exception("Gagal membuat sesi pembayaran: " . $e->getMessage());
        }
    }
}

