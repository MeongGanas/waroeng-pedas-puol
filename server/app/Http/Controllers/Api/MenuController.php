<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Mengambil daftar kategori beserta jumlah menu aktif
     */
    public function categories(): JsonResponse
    {
        $categories = Category::withCount(['menus' => function ($query) {
            $query->where('is_available', true);
        }])->orderBy('sort_order')->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    /**
     * Mengambil katalog menu dengan filter kategori, pencarian, dan status aktif
     */
    public function index(Request $request): JsonResponse
    {
        $query = Menu::with('category')->where('is_available', true);

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->query('category'));
            });
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('best_seller')) {
            $query->where('is_best_seller', true);
        }

        $menus = $query->orderBy('category_id')->orderBy('id')->get();

        return response()->json([
            'status' => 'success',
            'count' => $menus->count(),
            'data' => $menus
        ]);
    }

    /**
     * Mengambil satu menu spesifik
     */
    public function show(int $id): JsonResponse
    {
        $menu = Menu::with('category')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $menu
        ]);
    }
}

