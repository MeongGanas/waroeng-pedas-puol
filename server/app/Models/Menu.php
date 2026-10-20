<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'image_url',
        'is_spicy_customizable',
        'max_spicy_level',
        'is_best_seller',
        'is_available',
    ];

    protected $casts = [
        'price' => 'float',
        'is_spicy_customizable' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_available' => 'boolean',
        'max_spicy_level' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}

