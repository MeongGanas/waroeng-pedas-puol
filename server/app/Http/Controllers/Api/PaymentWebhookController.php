<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Webhook Handler dari Midtrans (Idempotent: aman dipanggil berkali-kali)
     */
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();
        $orderCode = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;
        $paymentType = $payload['payment_type'] ?? null;
        $transactionId = $payload['transaction_id'] ?? null;

        if (!$orderCode) {
            return response()->json(['status' => 'error', 'message' => 'Missing order_id'], 400);
        }

        $serverKey = env('MIDTRANS_SERVER_KEY', '');

        // Verifikasi signature hanya jika server key asli terpasang
        if (!empty($serverKey) && !str_contains($serverKey, 'YOUR_SERVER_KEY')) {
            $expectedSignature = hash('sha512', $orderCode . $statusCode . $grossAmount . $serverKey);
            if ($signatureKey !== $expectedSignature) {
                Log::warning("Midtrans Invalid Signature for order: {$orderCode}");
                return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 403);
            }
        }

        return DB::transaction(function () use ($orderCode, $transactionStatus, $fraudStatus, $paymentType, $transactionId, $grossAmount, $payload) {
            $order = Order::where('order_code', $orderCode)->lockForUpdate()->first();

            if (!$order) {
                return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
            }

            // Catat log audit pembayaran
            PaymentLog::create([
                'order_id' => $order->id,
                'transaction_id' => $transactionId,
                'payment_type' => $paymentType,
                'gross_amount' => (float) $grossAmount,
                'transaction_status' => $transactionStatus,
                'raw_response' => $payload,
            ]);

            // Idempotency: Jika pesanan sudah Lunas, jangan proses ulang
            if ($order->payment_status === 'paid') {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Order already marked as paid (Idempotent response).'
                ]);
            }

            // Evaluasi status transaksi Midtrans
            if ($transactionStatus === 'capture') {
                if ($fraudStatus === 'accept') {
                    $order->update([
                        'payment_status' => 'paid',
                        'order_status' => 'cooking',
                        'paid_at' => Carbon::now(),
                    ]);
                }
            } elseif ($transactionStatus === 'settlement') {
                $order->update([
                    'payment_status' => 'paid',
                    'order_status' => 'cooking',
                    'paid_at' => Carbon::now(),
                ]);
            } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
                $order->update([
                    'payment_status' => $transactionStatus === 'expire' ? 'expired' : 'failed',
                ]);
            } elseif ($transactionStatus === 'pending') {
                $order->update([
                    'payment_status' => 'unpaid',
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Notification processed successfully.'
            ]);
        });
    }
}

