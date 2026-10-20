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
                'name' => 'Penyetan',
                'slug' => 'penyetan',
                'icon' => 'Flame',
                'sort_order' => 1,
                'menus' => [
                    [
                        'name' => 'Nasi Ayam Penyet',
                        'description' => 'Nasi putih hangat dengan ayam goreng gurih dipenyet di atas cobek sambal pilihan.',
                        'price' => 23000,
                        'image_url' => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Ayam Geprek',
                        'description' => 'Ayam crispy renyah digeprek hancur berpadu dengan sambal pedas nampol.',
                        'price' => 23000,
                        'image_url' => 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Siomay Penyet',
                        'description' => 'Siomay goreng kenyal gurih dipenyet dengan sambal khas Waroeng Pedes Puooll.',
                        'price' => 20000,
                        'image_url' => 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Kekian Penyet',
                        'description' => 'Kekian udang/ayam gurih lembut digoreng renyah dan dipenyet di cobek.',
                        'price' => 20000,
                        'image_url' => 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Tahu Bakso Penyet',
                        'description' => 'Tahu bakso isi daging sapi gurih tebal digoreng lalu dipenyet dengan sambal pedas mantap.',
                        'price' => 20000,
                        'image_url' => 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Tahu Tempe Penyet',
                        'description' => 'Penyetan hemat nikmat: perpaduan tahu dan tempe goreng renyah dengan sambal segar.',
                        'price' => 12000,
                        'image_url' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Bakwan Penyet',
                        'description' => 'Bakwan sayur / bakso goreng renyah dipenyet sambal cobek sedap.',
                        'price' => 23000,
                        'image_url' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Terong Penyet',
                        'description' => 'Terong ungu goreng manis lembut berpadu sempurna dengan pedasnya sambal ulek.',
                        'price' => 12000,
                        'image_url' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Telor / Crispy Penyet',
                        'description' => 'Telur dadar crispy mengembang gurih dipenyet di atas ulekan sambal.',
                        'price' => 12000,
                        'image_url' => 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Telor Kornet',
                        'description' => 'Nasi hangat disajikan dengan dadar telur campur kornet sapi gurih lezat.',
                        'price' => 15000,
                        'image_url' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Lele Penyet',
                        'description' => 'Ikan lele goreng kering renyah bumbu ketumbar dipenyet dengan sambal khas.',
                        'price' => 20000,
                        'image_url' => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Kulit Penyet',
                        'description' => 'Kulit ayam goreng super kriuk renyah dipadukan sambal pedas puooll.',
                        'price' => 17000,
                        'image_url' => 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                ]
            ],
            [
                'name' => 'Indomie',
                'slug' => 'indomie',
                'icon' => 'Bowl',
                'sort_order' => 2,
                'menus' => [
                    [
                        'name' => 'Indomie Rebus / Goreng',
                        'description' => 'Indomie original kenyal gurih, pilihan rebus atau goreng.',
                        'price' => 6000,
                        'image_url' => 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Indomie Telor',
                        'description' => 'Indomie hangat lezat disajikan dengan telur setengah matang atau ceplok matang.',
                        'price' => 10000,
                        'image_url' => 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Indomie Double Telor',
                        'description' => 'Porsi ekstra puas: Indomie dengan 2 butir telur nikmat.',
                        'price' => 16000,
                        'image_url' => 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Indomie Telor Kornet',
                        'description' => 'Menu warung legendaris: Indomie dengan telur dan tumisan kornet sapi gurih.',
                        'price' => 16000,
                        'image_url' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                ]
            ],
            [
                'name' => 'Rice Bowl',
                'slug' => 'rice-bowl',
                'icon' => 'Utensils',
                'sort_order' => 3,
                'menus' => [
                    [
                        'name' => 'Rice Bowl Saos Asam Manis',
                        'description' => 'Nasi mangkok dengan potongan ayam krispi disiram saos asam manis segar dengan bawang bombay.',
                        'price' => 18000,
                        'image_url' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Rice Bowl Saos Teriyaki',
                        'description' => 'Ayam krispi lezat berbalut saos teriyaki khas Jepang yang manis gurih legit.',
                        'price' => 18000,
                        'image_url' => 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Rice Bowl Saos Jamur',
                        'description' => 'Nasi hangat dengan topping daging ayam saos jamur kental yang gurih creamy.',
                        'price' => 18000,
                        'image_url' => 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                ]
            ],
            [
                'name' => 'Nasi Goreng + Capcay',
                'slug' => 'nasi-goreng-capcay',
                'icon' => 'Sparkles',
                'sort_order' => 4,
                'menus' => [
                    [
                        'name' => 'Nasgor Ayam',
                        'description' => 'Nasi goreng racikan bumbu khas warung dengan suwiran ayam gurih dan aroma smokey wajan.',
                        'price' => 15000,
                        'image_url' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasgor Ayam + Telor',
                        'description' => 'Nasi goreng ayam spesial dilengkapi telur mata sapi atau telur dadar hangat.',
                        'price' => 20000,
                        'image_url' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasgor Sosis',
                        'description' => 'Nasi goreng lezat dengan limpahan potongan sosis sapi gurih.',
                        'price' => 23000,
                        'image_url' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasgor Nuget',
                        'description' => 'Nasi goreng nikmat disajikan dengan potongan nuget ayam renyah.',
                        'price' => 23000,
                        'image_url' => 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                    [
                        'name' => 'Nasi Capcay',
                        'description' => 'Nasi putih dengan tumis aneka sayuran segar, bakso, dan kuah kental gurih bergizi.',
                        'price' => 27000,
                        'image_url' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => true,
                        'max_spicy_level' => 6,
                    ],
                ]
            ],
            [
                'name' => 'Minuman',
                'slug' => 'minuman',
                'icon' => 'CupSoda',
                'sort_order' => 5,
                'menus' => [
                    [
                        'name' => 'Es Teh Manis',
                        'description' => 'Es teh manis segar pelepas dahaga pedas. Pilihan ukuran Kecil (3K), Jumbo (5K), Super Jumbo (7K).',
                        'price' => 5000,
                        'image_url' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Teh Tawar',
                        'description' => 'Teh dingin tawar segar alami. Pilihan ukuran Kecil (2K), Jumbo (3K), Super Jumbo (5K).',
                        'price' => 3000,
                        'image_url' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Jeruk Manis',
                        'description' => 'Perasan jeruk asli segar manis dingin. Pilihan ukuran Kecil (6K), Jumbo (8K), Super Jumbo (10K).',
                        'price' => 8000,
                        'image_url' => 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Jeruk Nipis',
                        'description' => 'Jeruk nipis peras asam manis super segar penawar ampuh rasa pedas membakar.',
                        'price' => 8000,
                        'image_url' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Milo',
                        'description' => 'Cokelat Milo dingin kental dan manis creamy favorit semua kalangan. Pilihan K (8K), J (10K), SJ (12K).',
                        'price' => 10000,
                        'image_url' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Nutrisari',
                        'description' => 'Minuman sari buah jeruk dingin menyegarkan. Pilihan K (4K), J (6K), SJ (8K).',
                        'price' => 6000,
                        'image_url' => 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Cao',
                        'description' => 'Cincau hitam kenyal dingin dengan sirup manis segar. Pilihan K (4K), J (6K).',
                        'price' => 6000,
                        'image_url' => 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Sirup',
                        'description' => 'Es sirup manis segar pelepas dahaga. Pilihan K (3K), J (5K), SJ (7K).',
                        'price' => 5000,
                        'image_url' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => false,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Soda Gembira',
                        'description' => 'Minuman soda merah berpadu susu kental manis dingin yang bikin gembira.',
                        'price' => 12000,
                        'image_url' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
                        'is_best_seller' => true,
                        'is_spicy_customizable' => false,
                        'max_spicy_level' => 0,
                    ],
                    [
                        'name' => 'Es Mega Mendung',
                        'description' => 'Minuman cola dingin berpadu dengan susu kental manis gurih legit.',
                        'price' => 12000,
                        'image_url' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
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
