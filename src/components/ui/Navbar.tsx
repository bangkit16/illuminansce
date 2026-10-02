"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CartDrawer } from "./CartDrawer";

type NavbarVariant = "dark" | "light";

type NavbarProps = {
  variant?: NavbarVariant;
};

export function Navbar({ variant = "dark" }: NavbarProps) {
  const { totalItems, openDrawer } = useCart();
  const { totalWishlist } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparan→solid saat scroll (hanya dark variant pada beranda)
  useEffect(() => {
    if (variant !== "dark") return;
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [variant]);

  const isDark = variant === "dark";

  const navBg = isDark
    ? scrolled
      ? "bg-il-dark-surface/95 backdrop-blur-md border-b border-il-dark-border"
      : "bg-transparent"
    : "bg-white/95 backdrop-blur-md border-b border-il-surface-2 shadow-xs";

  const textColor = isDark ? "text-il-ink-on-dark" : "text-il-ink-on-light";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${navBg}`}
        aria-label="Navigasi utama"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo wordmark */}
          {/* TODO: Ganti dengan logo asli ketika sudah tersedia */}
          <Link
            href="/"
            className={`font-heading font-semibold text-xl tracking-tight hover:opacity-80 transition-opacity ${textColor}`}
            aria-label="Illuminance — halaman beranda"
          >
            illuminance
          </Link>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`font-body text-sm hover:text-il-accent transition-colors ${textColor}`}
            >
              Beranda
            </Link>

            {/* Dropdown Produk */}
            <div className="relative group">
              <Link
                href="/produk"
                className={`font-body text-sm hover:text-il-accent transition-colors flex items-center gap-1 ${textColor}`}
              >
                Produk
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:rotate-180"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </Link>

              {/* Dropdown menu */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 p-1.5 ${
                  isDark
                    ? "bg-il-dark-surface border-il-dark-border text-il-ink-on-dark"
                    : "bg-white border-il-surface-2 text-il-ink-on-light"
                }`}
              >
                {[
                  { href: "/produk", label: "Semua Produk" },
                  { href: "/produk?kategori=meja", label: "Lampu Meja" },
                  { href: "/produk?kategori=gantung", label: "Lampu Gantung" },
                  { href: "/produk?kategori=lantai", label: "Lampu Lantai" },
                  { href: "/produk?kategori=dinding", label: "Lampu Dinding" },
                  { href: "/produk?kategori=baca", label: "Lampu Baca" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-sm rounded-lg hover:text-il-accent transition-colors ${
                      isDark
                        ? "text-il-ink-on-dark hover:bg-il-dark-bg"
                        : "text-il-ink-on-light hover:bg-il-light-bg"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/#brand-story"
              className={`font-body text-sm hover:text-il-accent transition-colors ${textColor}`}
            >
              Tentang
            </Link>
            <Link
              href="/#kontak"
              className={`font-body text-sm hover:text-il-accent transition-colors ${textColor}`}
            >
              Kontak
            </Link>
          </div>

          {/* Ikon kanan */}
          <div className="flex items-center gap-1.5">
            {/* Search: Klik langsung redirect ke halaman produk */}
            <Link
              href="/produk"
              aria-label="Cari produk di katalog"
              className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${textColor}`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label={`Koleksi wishlist — ${totalWishlist} lampu`}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${textColor}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={totalWishlist > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {totalWishlist > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-il-accent text-il-dark-bg text-[10px] font-bold flex items-center justify-center leading-none"
                >
                  {totalWishlist > 99 ? "99+" : totalWishlist}
                </span>
              )}
            </Link>

            {/* Akun Link */}
            <Link
              href="/profile"
              aria-label="Profil dan Akun Saya"
              className={`w-9 h-9 hidden md:flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${textColor}`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M2.5 16c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Link>

            {/* Keranjang */}
            <button
              onClick={openDrawer}
              aria-label={`Keranjang belanja — ${totalItems} item`}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ${textColor}`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M1 1h2.5l1.8 9h9.4l1.3-6H5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="7.5" cy="15.5" r="1" fill="currentColor" />
                <circle cx="13.5" cy="15.5" r="1" fill="currentColor" />
              </svg>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-il-accent text-il-dark-bg text-[10px] font-bold flex items-center justify-center leading-none"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className={`md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ${textColor}`}
            >
              <span
                className={`block h-[1.5px] bg-current rounded-full transition-all duration-200 ${
                  menuOpen ? "w-5 rotate-45 translate-y-[4px]" : "w-5"
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current rounded-full transition-all duration-200 ${
                  menuOpen ? "opacity-0 w-0" : "w-4"
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current rounded-full transition-all duration-200 ${
                  menuOpen ? "w-5 -rotate-45 -translate-y-[4px]" : "w-5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-y-auto transition-all duration-300 ${
            menuOpen ? "max-h-[calc(100dvh-4rem)]" : "max-h-0"
          }`}
          aria-hidden={!menuOpen}
        >
          <div
            className={`px-4 pb-5 pt-2 flex flex-col gap-1 border-t ${
              isDark
                ? "bg-il-dark-surface border-il-dark-border text-il-ink-on-dark"
                : "bg-white border-il-surface-2 text-il-ink-on-light"
            }`}
          >
            {[
              { href: "/", label: "Beranda" },
              { href: "/produk", label: "Semua Produk" },
              { href: "/produk?kategori=meja", label: "Lampu Meja" },
              { href: "/produk?kategori=gantung", label: "Lampu Gantung" },
              { href: "/produk?kategori=lantai", label: "Lampu Lantai" },
              { href: "/produk?kategori=dinding", label: "Lampu Dinding" },
              { href: "/produk?kategori=baca", label: "Lampu Baca" },
              { href: "/#brand-story", label: "Tentang Brand" },
              { href: "/#kontak", label: "Kontak" },
              { href: "/wishlist", label: `Wishlist Saya (${totalWishlist})` },
              { href: "/profile", label: "Profil Akun" },
              { href: "/admin", label: "Admin Dashboard" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 text-sm rounded-lg hover:text-il-accent transition-colors ${
                  isDark
                    ? "text-il-ink-on-dark hover:bg-il-dark-bg"
                    : "text-il-ink-on-light hover:bg-il-light-bg"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* CartDrawer selalu render agar animasi bisa berjalan */}
      <CartDrawer />
    </>
  );
}
