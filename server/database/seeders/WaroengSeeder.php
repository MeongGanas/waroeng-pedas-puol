<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WaroengSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Ayam & Bebek Pedas',
                'slug' => 'ayam-bebek-pedas',
                'icon' => 'Flame',
                'sort_order' => 1,
                'menus' => [
                    [
                        'name' => 'Ayam Geprek Sambal Puooll',
                        'description' => 'Ayam crispy gurih renyah digeprek dengan sambal cabai rawit merah pedas membakar lidah.',
                        'price' => 22000,
                        'image_url' => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'max_spicy_level' => 5,
                    ],
                    [
                        'name' => 'Bebek Goreng Sambal Mercon',
                        'description' => 'Bebek ungkep bumbu rempah empuk, disajikan dengan siraman sambal mercon pedas gurih nagih.',
                        'price' => 35000,
                        'image_url' => 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'max_spicy_level' => 5,
                    ],
                    [
                        'name' => 'Ayam Bakar Taliwang Pedes',
                        'description' => 'Ayam bakar dengan bumbu khas Taliwang rempah terasi bakar dan cabai rawit khas Lombok.',
                        'price' => 25000,
                        'image_url' => 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'max_spicy_level' => 5,
                    ],
                ]
            ],
            [
                'name' => 'Sambal Bakar Cobek',
                'slug' => 'sambal-bakar-cobek',
                'icon' => 'Utensils',
                'sort_order' => 2,
                'menus' => [
                    [
                        'name' => 'Sambal Bakar Cumi Asin Petai',
                        'description' => 'Sambal dibakar mendidih langsung di atas cobek tanah liat dengan cumi asin gurih dan petai segar.',
                        'price' => 28000,
                        'image_url' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'max_spicy_level' => 5,
                    ],
                    [
                        'name' => 'Sambal Bawang Juara Cobek',
                        'description' => 'Sambal bawang ulek kasar disiram minyak panas gurih khas Jawa Timur.',
                        'price' => 8000,
                        'image_url' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'max_spicy_level' => 5,
                    ],
                ]
            ],
            [
                'name' => 'Mie & Nasi Pedas',
                'slug' => 'mie-nasi-pedas',
                'icon' => 'Bowl',
                'sort_order' => 3,
                'menus' => [
                    [
                        'name' => 'Mie Pedes Mampus Telur Kornet',
                        'description' => 'Mie goreng nyemek pedas bumbu cabai rawit spesial, topping telur mata sapi & kornet gurih.',
                        'price' => 19000,
                        'image_url' => 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'max_spicy_level' => 5,
                    ],
                    [
                        'name' => 'Nasi Gila Mercon Puooll',
                        'description' => 'Nasi putih hangat dengan tumisan bakso sapi, sosis ayam, dan telur bumbu mercon banjir cabai.',
                        'price' => 24000,
                        'image_url' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'max_spicy_level' => 5,
                    ],
                ]
            ],
            [
                'name' => 'Gorengan & Pelengkap',
                'slug' => 'gorengan-pelengkap',
                'icon' => 'Sparkles',
                'sort_order' => 4,
                'menus' => [
                    [
                        'name' => 'Kulit Ayam Crispy Pedas Gurih',
                        'description' => 'Kulit ayam goreng ekstra renyah ditaburi bumbu cabai bubuk daun jeruk gurih.',
                        'price' => 15000,
                        'image_url' => 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'max_spicy_level' => 3,
                    ],
                    [
                        'name' => 'Tempe Mendoan Rawit Kecap (4 pcs)',
                        'description' => 'Tempe mendoan lembut digoreng basah, dicocol dengan sambal kecap rawit pedas mantap.',
                        'price' => 12000,
                        'image_url' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'max_spicy_level' => 3,
                    ],
                    [
                        'name' => 'Nasi Putih Pulen',
                        'description' => 'Nasi putih wangi pulen hangat dengan taburan bawang merah goreng renyah.',
                        'price' => 5000,
                        'image_url' => 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                ]
            ],
            [
                'name' => 'Minuman Pereda Pedas',
                'slug' => 'minuman-pereda-pedas',
                'icon' => 'CupSoda',
                'sort_order' => 5,
                'menus' => [
                    [
                        'name' => 'Es Jeruk Kelapa Muda Puooll',
                        'description' => 'Perasan jeruk asli segar berpadu dengan kerokan kelapa muda asli. Dingin manis pereda pedas.',
                        'price' => 12000,
                        'image_url' => 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Teh Manis Melati Jumbo',
                        'description' => 'Es teh manis wangi melati khas Solo disajikan dalam gelas jumbo super dingin.',
                        'price' => 6000,
                        'image_url' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Cincau Susu Gula Aren',
                        'description' => 'Potongan cincau hitam kenyal dengan susu segar gurih dan pemanis gula aren alami.',
                        'price' => 14000,
                        'image_url' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                ]
            ]
        ];

        foreach ($categories as $catData) {
            $menus = $catData['menus'];
            unset($catData['menus']);
            
            $category = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );

            foreach ($menus as $menuData) {
                Menu::updateOrCreate(
                    ['slug' => Str::slug($menuData['name'])],
                    array_merge($menuData, [
                        'category_id' => $category->id,
                        'slug' => Str::slug($menuData['name']),
                        'is_available' => true,
                        'is_spicy_customizable' => $menuData['is_spicy_customizable'] ?? true,
                    ])
                );
            }
        }
    }
}

