<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 2. Menus Table
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('image_url')->nullable();
            $table->boolean('is_spicy_customizable')->default(true);
            $table->integer('max_spicy_level')->default(6);
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        // 3. Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 50)->unique(); // e.g. PUOOLL-20261020-001
            $table->string('customer_name');
            $table->string('customer_phone', 30);
            $table->enum('order_type', ['dine_in', 'takeaway', 'delivery'])->default('dine_in');
            $table->string('table_number', 20)->nullable();
            $table->text('delivery_address')->nullable();
            $table->enum('payment_method', ['cashier', 'online'])->default('cashier');
            $table->enum('payment_status', ['unpaid', 'paid', 'expired', 'failed', 'cancelled'])->default('unpaid');
            $table->enum('order_status', ['pending', 'cooking', 'ready', 'completed', 'cancelled'])->default('pending');
            $table->decimal('total_amount', 12, 2);
            $table->text('notes')->nullable();
            
            // Online payment & Anti-Double Payment columns
            $table->string('snap_token', 255)->nullable();
            $table->string('payment_idempotency_key', 100)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // 4. Order Items Table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('menu_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->decimal('price', 12, 2);
            $table->integer('spicy_level')->default(0); // 0 to 5
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        // 5. Payment Logs Table (For Webhook Idempotency & Audit Trail)
        Schema::create('payment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('transaction_id')->nullable();
            $table->string('payment_type')->nullable(); // qris, gopay, bank_transfer, etc.
            $table->decimal('gross_amount', 12, 2);
            $table->string('transaction_status'); // capture, settlement, pending, deny, expire, cancel
            $table->json('raw_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_logs');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('categories');
    }
};

