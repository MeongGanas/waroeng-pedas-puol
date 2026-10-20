<?php

use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentWebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Info API
Route::get('/ping', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Waroeng Pedes Puooll API Online',
        'timestamp' => now()->toIso8601String()
    ]);
});

// Katalog Menu & Kategori
Route::get('/categories', [MenuController::class, 'categories']);
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/{id}', [MenuController::class, 'show']);

// Pemesanan & Pembayaran Pelanggan
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/orders/{id}/pay', [OrderController::class, 'pay']); // Proteksi Anti-Double Pay
Route::get('/orders/{orderCode}', [OrderController::class, 'show']);

// Webhook Payment Gateway (Midtrans Notification)
Route::post('/payment/notification', [PaymentWebhookController::class, 'handle']);

// Dashboard Kasir & Dapur
Route::prefix('admin')->group(function () {
    Route::get('/orders', [OrderController::class, 'adminOrders']);
    Route::patch('/orders/{id}/cashier-pay', [OrderController::class, 'markCashierPaid']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
