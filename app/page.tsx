"use client";
import { useState, useEffect } from "react";

const PRODUCTS = [
  { id: 1, name: "Premium Coffee Bean", price: 1, img: "☕", desc: "Biji kopi pilihan kualitas ekspor." },
  { id: 2, name: "Sweet Bubble Gum", price: 2, img: "🍬", desc: "Permen karet manis tahan lama." },
  { id: 3, name: "Golden Crisp Snack", price: 3, img: "🍘", desc: "Kerupuk renyah gurih tiada duanya." },
];

export default function StorePage() {
  const [cart, setCart] = useState<{id: number, name: string, price: number, quantity: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah hydration error pada Next.js
  useEffect(() => setMounted(true), []);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, totalAmount }),
      });
      const data = await res.json();
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        alert("Xendit Error: " + data.error);
      }
    } catch (err) {
      alert("Koneksi gagal. Pastikan API Route sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FATAH.STORE
          </h1>
          <div className="relative p-2 bg-slate-100 rounded-full">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Section Produk (Kiri) */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Katalog Produk</h2>
              <p className="text-slate-500 mt-1">Pilih barang impianmu dengan harga mulai dari Rp 1.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="group bg-white border border-slate-200 p-2 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300">
                  <div className="bg-slate-50 rounded-[1.5rem] py-12 flex justify-center text-7xl group-hover:scale-105 transition-transform duration-300">
                    {p.img}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{p.name}</h3>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                        Rp {p.price}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-6">{p.desc}</p>
                    <button 
                      onClick={() => addToCart(p)}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 active:scale-95 transition-all"
                    >
                      Tambah ke Keranjang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Ringkasan (Kanan) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 sticky top-28 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                Ringkasan Belanja
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 opacity-20">🛍️</div>
                  <p className="text-slate-400">Wah, keranjangmu masih kosong nih.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center group">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl">
                            {PRODUCTS.find(pr => pr.id === item.id)?.img}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.quantity} Unit • Rp {item.price}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-6 space-y-3">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>Rp {totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Pajak (0%)</span>
                      <span>Rp 0</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 text-2xl font-black text-slate-900">
                      <span>Total</span>
                      <span className="text-blue-600">Rp {totalAmount}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Memproses...
                      </>
                    ) : (
                      "Checkout via Xendit"
                    )}
                  </button>
                  <p className="text-[10px] text-center mt-4 text-slate-400 uppercase tracking-widest font-bold">
                    Secure 256-bit SSL Payment
                  </p>
                </>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}