"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { getStoredProducts } from "@/lib/products-storage";
import { INITIAL_ORDERS } from "@/lib/orders-placeholder";

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [productCount, setProductCount] = useState(10);
  const [pendingOrdersCount] = useState(
    INITIAL_ORDERS.filter((o) => o.status === "Diproses").length
  );
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  // Verifikasi otorisasi admin di client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("illuminance_user");
      let isAdmin = false;
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.role === "admin") isAdmin = true;
        } catch {}
      }
      if (!isAdmin) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setIsAuthorized((prev) => (prev ? prev : true));
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    const updateCount = () => {
      setProductCount(getStoredProducts().length);
    };
    updateCount();
    window.addEventListener("illuminance:products-updated", updateCount);
    return () => {
      window.removeEventListener("illuminance:products-updated", updateCount);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("illuminance_user");
      document.cookie = "illuminance_role=; path=/; max-age=0; SameSite=Lax";
    }
    showToast({
      title: "Sesi Admin Berakhir",
      description: "Anda telah keluar dari dashboard admin.",
      type: "info",
    });
    router.push("/login");
  };

  const isDashboard = pathname === "/admin";
  const isProduk = pathname.startsWith("/admin/produk");
  const isPesanan = pathname.startsWith("/admin/pesanan");

  const getPageTitle = () => {
    if (pathname === "/admin") return "Ringkasan Operasional";
    if (pathname === "/admin/produk/tambah") return "Tambah Lampu Baru";
    if (pathname.includes("/admin/produk/") && pathname.endsWith("/edit")) return "Edit Spesifikasi Lampu";
    if (isProduk) return "Manajemen Katalog Lampu";
    if (isPesanan) return "Pengelolaan Pesanan";
    return "Admin Dashboard";
  };

  return (
    <div className="min-h-dvh bg-il-light-bg text-il-ink-on-light flex flex-col md:flex-row">
      {/* ─── SIDEBAR (DESKTOP) ─── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-il-surface-2 flex-col justify-between shrink-0 sticky top-0 h-screen z-20">
        <div>
          {/* Brand header */}
          <div className="h-16 px-6 border-b border-il-surface-2 flex items-center justify-between">
            <Link
              href="/"
              className="font-heading font-bold text-xl tracking-tight text-il-ink-on-light hover:text-il-accent transition-colors"
            >
              illuminance
            </Link>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-il-accent text-il-dark-bg uppercase tracking-wider">
              Admin
            </span>
          </div>

          {/* Navigation Menus */}
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-il-ink-on-light/40 px-3 py-2">
              Menu Utama
            </div>

            {/* 1. Dashboard */}
            <Link
              href="/admin"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isDashboard
                  ? "bg-il-accent text-il-dark-bg font-semibold shadow-xs"
                  : "text-il-ink-on-light/70 hover:bg-il-light-bg hover:text-il-ink-on-light"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                <span>Dashboard</span>
              </div>
            </Link>

            {/* 2. Kelola Produk */}
            <Link
              href="/admin/produk"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isProduk
                  ? "bg-il-accent text-il-dark-bg font-semibold shadow-xs"
                  : "text-il-ink-on-light/70 hover:bg-il-light-bg hover:text-il-ink-on-light"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span>Kelola Produk</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isProduk
                    ? "bg-il-dark-bg/20 text-il-dark-bg font-bold"
                    : "bg-il-surface-2 text-il-ink-on-light/70"
                }`}
              >
                {productCount}
              </span>
            </Link>

            {/* 3. Kelola Pesanan */}
            <Link
              href="/admin/pesanan"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isPesanan
                  ? "bg-il-accent text-il-dark-bg font-semibold shadow-xs"
                  : "text-il-ink-on-light/70 hover:bg-il-light-bg hover:text-il-ink-on-light"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Kelola Pesanan</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPesanan
                      ? "bg-il-dark-bg text-il-accent"
                      : "bg-il-accent/15 text-il-accent border border-il-accent/30"
                  }`}
                >
                  {pendingOrdersCount} Baru
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-il-surface-2 space-y-3">
          <Link
            href="/produk"
            className="flex items-center gap-2 text-xs text-il-ink-on-light/60 hover:text-il-accent transition-colors px-2 py-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Kunjungi Toko</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-il-surface-2/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-il-accent/15 border border-il-accent/30 text-il-accent font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-il-ink-on-light truncate">Admin Pusat</p>
                <p className="text-[10px] text-il-ink-on-light/50 truncate">admin@illuminance.id</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="text-il-ink-on-light/40 hover:text-il-danger p-1 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE NAVBAR & DRAWER ─── */}
      <div className="md:hidden bg-white border-b border-il-surface-2 px-4 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Buka menu navigasi admin"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-il-surface-2 text-il-ink-on-light cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link href="/" className="font-heading font-bold text-lg text-il-ink-on-light">
            illuminance
          </Link>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-il-accent text-il-dark-bg uppercase">
            Admin
          </span>
        </div>

        <Link
          href="/produk"
          className="text-xs text-il-ink-on-light/60 hover:text-il-accent font-medium"
        >
          Lihat Toko
        </Link>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-2xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-il-surface-2">
            <div>
              <span className="font-heading font-bold text-xl text-il-ink-on-light">
                illuminance
              </span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-il-accent text-il-dark-bg uppercase">
                Admin
              </span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="text-il-ink-on-light/40 hover:text-il-ink-on-light"
            >
              &times;
            </button>
          </div>

          <div className="space-y-1">
            <Link
              href="/admin"
              onClick={() => setMobileSidebarOpen(false)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium ${
                isDashboard ? "bg-il-accent text-il-dark-bg font-semibold" : "text-il-ink-on-light/70"
              }`}
            >
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/produk"
              onClick={() => setMobileSidebarOpen(false)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium ${
                isProduk ? "bg-il-accent text-il-dark-bg font-semibold" : "text-il-ink-on-light/70"
              }`}
            >
              <span>Kelola Produk</span>
              <span className="text-[10px]">{productCount}</span>
            </Link>

            <Link
              href="/admin/pesanan"
              onClick={() => setMobileSidebarOpen(false)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium ${
                isPesanan ? "bg-il-accent text-il-dark-bg font-semibold" : "text-il-ink-on-light/70"
              }`}
            >
              <span>Kelola Pesanan</span>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-il-accent/20 text-il-dark-bg font-bold">
                  {pendingOrdersCount} Baru
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-il-surface-2">
          <button
            onClick={handleLogout}
            className="w-full py-2 text-center text-xs font-semibold text-il-danger border border-il-danger/30 rounded-xl hover:bg-il-danger/10 transition-colors"
          >
            Keluar dari Admin
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Desktop) */}
        <header className="hidden md:flex h-16 bg-white border-b border-il-surface-2 px-8 items-center justify-between sticky top-0 z-10 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-lg text-il-ink-on-light capitalize">
              {getPageTitle()}
            </h1>
            <span className="text-xs text-il-ink-on-light/40">&bull;</span>
            <span
              className="text-xs text-il-ink-on-light/50 font-mono"
              suppressHydrationWarning
            >
              {currentDate}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                showToast({
                  title: "Sinkronisasi Realtime",
                  description: "Data transaksi dan etalase toko diperbarui.",
                  type: "success",
                })
              }
              className="px-3.5 py-1.5 rounded-full border border-il-surface-2 text-xs font-semibold text-il-ink-on-light/70 hover:text-il-ink-on-light hover:border-il-accent transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>Refresh Data</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 md:p-8 flex-1">
          {isAuthorized ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-il-ink-on-light/40">
              <div className="w-6 h-6 border-2 border-il-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Memeriksa hak akses admin...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
