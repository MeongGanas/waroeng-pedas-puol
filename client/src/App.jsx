import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import CategoryFilter from "./components/CategoryFilter";
import MenuCard from "./components/MenuCard";
import MenuCustomModal from "./components/MenuCustomModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrderSuccessModal from "./components/OrderSuccessModal";
import OrderHistoryModal from "./components/OrderHistoryModal";
import AdminPanel from "./components/AdminPanel";
import { CartProvider, useCart } from "./context/CartContext";
import { api } from "./services/api";
import { DUMMY_CATEGORIES, DUMMY_MENUS } from "./data/dummyData";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";

function MainApp() {
    const { totalItemsCount, totalAmount } = useCart();

    // Inisialisasi awal langsung dengan data dummy agar UI tidak kosong saat server belum siap
    const [categories, setCategories] = useState(DUMMY_CATEGORIES);
    const [menus, setMenus] = useState(DUMMY_MENUS);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // UI state modals
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [orderSuccessData, setOrderSuccessData] = useState(null);
    const [isAdminView, setIsAdminView] = useState(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.has("admin") || params.has("kasir");
        } catch {
            return false;
        }
    });

    // Sinkronisasi tema otomatis dengan preferensi tema device (Light / Dark mode)
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const updateTheme = (e) => {
            if (e.matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        updateTheme(mediaQuery);
        mediaQuery.addEventListener("change", updateTheme);
        return () => mediaQuery.removeEventListener("change", updateTheme);
    }, []);

    // Load Categories & Menus (sync dari server jika tersedia)
    const loadData = async () => {
        try {
            const [catRes, menuRes] = await Promise.all([
                api.getCategories(),
                api.getMenus({ category: activeCategory, search: searchQuery }),
            ]);
            if (catRes?.data && catRes.data.length > 0) {
                setCategories(catRes.data);
            }
            if (menuRes?.data) {
                setMenus(menuRes.data);
            }
        } catch (err) {
            console.warn(
                "Gagal sinkronisasi data server, tetap memakai data dummy:",
                err,
            );
        }
    };

    useEffect(() => {
        loadData();
    }, [activeCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-stone-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col pb-24 sm:pb-12 transition-colors duration-200">
            {/* Top Navbar */}
            <Navbar 
                onOpenCart={() => setIsCartOpen(true)} 
                onOpenHistory={() => setIsHistoryOpen(true)} 
            />

            <main className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">
                {isAdminView ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-2xl text-xs shadow-sm">
                            <span className="text-amber-500 dark:text-amber-400 font-semibold">
                                👨‍🍳 Mode Monitor Kasir & Dapur Aktif
                            </span>
                            <button
                                onClick={() => setIsAdminView(false)}
                                className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline font-medium"
                            >
                                ← Kembali ke Menu Pelanggan
                            </button>
                        </div>
                        <AdminPanel />
                    </div>
                ) : (
                    <>
                        {/* Category and Search Filter */}
                        <CategoryFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            onSelectCategory={setActiveCategory}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        {/* Menu Catalog Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900 dark:text-white flex items-center gap-2">
                                    <span>🌶️</span>
                                    <span>
                                        {activeCategory
                                            ? categories.find(
                                                  (c) =>
                                                      c.slug === activeCategory,
                                              )?.name || "Daftar Menu"
                                            : "Koleksi Menu Spesial"}
                                    </span>
                                </h3>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
                                    {menus.length} hidangan tersedia
                                </span>
                            </div>

                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
                                    <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-2" />
                                    <p className="text-xs">
                                        Menyiapkan hidangan pedas lezat...
                                    </p>
                                </div>
                            ) : menus.length === 0 ? (
                                <div className="py-16 text-center bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
                                    <span className="text-3xl block mb-2">
                                        🔍
                                    </span>
                                    <p className="font-bold text-neutral-800 dark:text-neutral-300 text-sm">
                                        Menu Tidak Ditemukan
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Coba kata kunci pencarian lain atau
                                        pilih kategori Semua Menu.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                                    {menus.map((menu) => (
                                        <MenuCard
                                            key={menu.id}
                                            menu={menu}
                                            onSelect={(m) => setSelectedMenu(m)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Floating Mobile Sticky Cart Bar */}
            {!isAdminView &&
                totalItemsCount > 0 &&
                !isCartOpen &&
                !isCheckoutOpen && (
                    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto sm:hidden animate-slide-up">
                        <div
                            onClick={() => setIsCartOpen(true)}
                            className="bg-red-600 rounded-2xl p-3.5 flex items-center justify-between shadow-2xl shadow-red-700/30 cursor-pointer text-white"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center font-extrabold text-sm">
                                    {totalItemsCount}
                                </div>
                                <div>
                                    <p className="text-[11px] text-red-100 font-medium">
                                        Total Pesanan
                                    </p>
                                    <p className="font-extrabold text-sm">
                                        Rp {totalAmount.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 font-bold text-xs bg-black/20 hover:bg-black/30 px-3 py-2 rounded-xl transition-colors">
                                <span>Buka Keranjang</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                )}

            {/* Modals & Drawers */}
            {selectedMenu && (
                <MenuCustomModal
                    key={selectedMenu.id}
                    menu={selectedMenu}
                    onClose={() => setSelectedMenu(null)}
                />
            )}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onOrderSuccess={(orderData) => setOrderSuccessData(orderData)}
            />

            <OrderSuccessModal
                orderData={orderSuccessData}
                onClose={() => setOrderSuccessData(null)}
                onOpenHistory={() => setIsHistoryOpen(true)}
            />

            <OrderHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />

            {/* Footer */}
            <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 py-6 text-center text-xs text-neutral-500 transition-colors duration-200">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-left">
                        <p className="font-bold text-neutral-800 dark:text-neutral-300">
                            Waroeng Pedes Puooll
                        </p>
                        <p className="text-[11px] text-neutral-500">
                            WA: 0852-3069-7857 • IG: @waroengpedespuooll •
                            TikTok: @pedes_pooll
                        </p>
                    </div>
                    <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-neutral-600 dark:text-neutral-400 font-medium text-[11px]">
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="text-neutral-800 dark:text-neutral-300 hover:text-red-600 dark:hover:text-white transition-colors underline"
                        >
                            Riwayat Pesanan
                        </button>
                        <span>•</span>
                        <span>Buka: 10:00 - 22:00 WIB</span>
                        <button
                            onClick={() => setIsAdminView(!isAdminView)}
                            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                        >
                            {isAdminView ? "Lihat Menu" : "Akses Kasir"}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <CartProvider>
            <MainApp />
        </CartProvider>
    );
}
