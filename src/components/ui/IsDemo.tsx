"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEMO_ROUTES = [
  {
    category: "Halaman Publik & Toko",
    items: [
      { name: "Beranda / Home", path: "/", desc: "Landing page & etalase utama" },
      { name: "Katalog Produk", path: "/produk", desc: "Filter kategori, material & harga" },
      {
        name: "Detail Produk (Contoh)",
        path: "/produk/lampu-meja-kuningan-arc",
        desc: "Halaman detail spesifikasi & add to cart",
      },
      { name: "Wishlist", path: "/wishlist", desc: "Daftar produk disimpan" },
    ],
  },
  {
    category: "Transaksi & Checkout",
    items: [
      { name: "Checkout & Keranjang", path: "/checkout", desc: "Form pemesanan & kurir" },
      { name: "Instruksi Pembayaran", path: "/checkout/bayar", desc: "Instruksi VA / QRIS / Mock" },
      { name: "Status Sukses", path: "/checkout/sukses", desc: "Nota & rincian pesanan" },
    ],
  },
  {
    category: "Akun & Autentikasi",
    items: [
      { name: "Login Pelanggan", path: "/login", desc: "Halaman masuk akun" },
      { name: "Profil Pengguna", path: "/profile", desc: "Data diri & riwayat belanja" },
    ],
  },
  {
    category: "Admin Panel",
    items: [
      { name: "Dashboard Admin", path: "/admin", desc: "Ringkasan metrik & penjualan" },
      { name: "Kelola Produk", path: "/admin/produk", desc: "Tabel stok & harga produk" },
      { name: "Tambah Produk", path: "/admin/produk/tambah", desc: "Form input lampu baru" },
      {
        name: "Edit Produk (ID: 1)",
        path: "/admin/produk/1/edit",
        desc: "Form ubah data produk",
      },
      { name: "Daftar Pesanan", path: "/admin/pesanan", desc: "Status & update pengiriman" },
    ],
  },
];

export function IsDemo() {
  const isDemoActive =
    process.env.NEXT_PUBLIC_IS_DEMO === "true" ||
    process.env.NEXT_PUBLIC_IS_DEMO === "1";

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isDemoActive) return null;

  return (
    <>
      {/* Tulisan besar DEMO yang tembus pandang & pointer-events-none */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center select-none overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center -rotate-12 border-8 border-dashed border-red-500/15 rounded-3xl p-6 sm:p-12">
          <span className="font-mono text-[18vw] leading-none font-black tracking-widest text-red-500/5 select-none">
            DEMO
          </span>
          <span className="text-sm sm:text-lg font-semibold tracking-[0.3em] uppercase text-red-500/10 mt-2">
            Mode Pratinjau
          </span>
        </div>
      </div>

      {/* Floating Trigger Tab di Kiri */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Buka Menu Demo & Navigasi Halaman"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-neutral-900 text-amber-400 hover:bg-black border-y border-r border-amber-500/40 px-2.5 py-4 rounded-r-xl shadow-xl flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
      >
        <svg
          className="w-4 h-4 text-amber-400 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="[writing-mode:vertical-rl] text-xs font-bold tracking-widest uppercase">
          DEMO NAV
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Sheet / Drawer dari Kiri ke Kanan */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Demo Semua Halaman"
        className="fixed inset-y-0 left-0 z-50 w-full max-w-sm sm:max-w-md bg-white text-neutral-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out border-r border-neutral-200"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase bg-amber-400 text-neutral-950 rounded">
              DEMO
            </span>
            <h2 className="font-semibold text-base tracking-tight">
              Navigasi Halaman
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Info strip */}
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
          <span>Halaman saat ini:</span>
          <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded font-semibold text-amber-950">
            {pathname}
          </code>
        </div>

        {/* Content Link List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {DEMO_ROUTES.map((section) => (
            <div key={section.category} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {section.category}
              </h3>
              <div className="space-y-1.5">
                {section.items.map((route) => {
                  const isActive = pathname === route.path;
                  return (
                    <Link
                      key={route.path}
                      href={route.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-start justify-between p-2.5 rounded-lg border transition-all ${
                        isActive
                          ? "bg-amber-500/10 border-amber-500/40 text-neutral-950"
                          : "bg-neutral-50/60 hover:bg-neutral-100 border-neutral-200/70 text-neutral-800"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-sm font-medium leading-snug ${
                              isActive ? "font-semibold text-amber-900" : ""
                            }`}
                          >
                            {route.name}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {route.desc}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 bg-white border border-neutral-200 px-1.5 py-0.5 rounded shrink-0 group-hover:border-neutral-300">
                        {route.path}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Drawer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-500 flex items-center justify-end">
          {/* <span>Aktif via env <code className="font-mono font-semibold">IS_DEMO</code></span> */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-neutral-700 hover:underline font-medium"
          >
            Tutup
          </button>
        </div>
      </aside>
    </>
  );
}
