<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'customer_name',
        'customer_phone',
        'order_type',
        'table_number',
        'delivery_address',
        'payment_method',
        'payment_status',
        'order_status',
        'total_amount',
        'notes',
        'snap_token',
        'payment_idempotency_key',
        'paid_at',
    ];

    protected $casts = [
        'total_amount' => 'float',
        'paid_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function paymentLogs(): HasMany
    {
        return $this->hasMany(PaymentLog::class);
    }
}

