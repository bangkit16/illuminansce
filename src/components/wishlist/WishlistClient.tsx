"use client";

import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { FooterDark } from "@/components/sections/FooterDark";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export function WishlistClient() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem, openDrawer } = useCart();

  const handleAddToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      imageOff: item.imageOff,
      price: item.price,
      priceFormatted: item.priceFormatted,
      variant: undefined,
    });
    openDrawer();
  };

  return (
    <div className="bg-il-light-bg min-h-dvh flex flex-col">
      <Navbar variant="light" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-16 flex-1 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-il-ink-on-light/40 font-body">
            <li>
              <Link href="/" className="hover:text-il-accent transition-colors">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-il-ink-on-light font-medium">Wishlist</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-il-surface-2 mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-il-ink-on-light tracking-tight">
              Koleksi Wishlist
            </h1>
            <p className="text-xs md:text-sm text-il-ink-on-light/60 mt-1">
              Daftar lampu artisan yang Anda simpan untuk referensi atau pembelian nanti.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-il-ink-on-light/50 font-medium">
                {items.length} lampu disimpan
              </span>
              <button
                onClick={clearWishlist}
                className="text-xs text-il-danger hover:underline cursor-pointer font-medium"
              >
                Kosongkan Wishlist
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-il-surface-2 max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-il-light-bg border border-il-surface-2 flex items-center justify-center text-il-ink-on-light/40">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="font-heading font-semibold text-lg text-il-ink-on-light">
              Belum Ada Lampu di Wishlist
            </h2>
            <p className="text-xs text-il-ink-on-light/60 max-w-xs mx-auto leading-relaxed">
              Jelajahi etalase Illuminance dan tekan ikon hati pada lampu yang Anda sukai untuk menyimpannya di sini.
            </p>
            <div className="pt-2">
              <Link
                href="/produk"
                className="inline-block px-6 py-3 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-xs hover:bg-il-accent-dark transition-colors shadow-xs"
              >
                Eksplorasi Katalog Lampu &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-il-surface-2 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 bg-il-light-bg overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageOff}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      title="Hapus dari Wishlist"
                      className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-il-danger flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-110"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 space-y-0.5 sm:space-y-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-il-accent">
                      {item.category}
                    </span>
                    <Link
                      href={`/produk/${item.slug}`}
                      className="block font-heading font-semibold text-xs sm:text-sm text-il-ink-on-light hover:text-il-accent transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="font-heading font-bold text-xs sm:text-sm text-il-accent pt-0.5">
                      {item.priceFormatted}
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 pt-0 flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 py-2 sm:py-2.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-[10px] sm:text-xs hover:bg-il-accent-dark transition-colors cursor-pointer text-center"
                  >
                    + Keranjang
                  </button>
                  <Link
                    href={`/produk/${item.slug}`}
                    className="hidden sm:inline-block px-3 py-2.5 rounded-full border border-il-surface-2 text-xs font-medium text-il-ink-on-light hover:border-il-accent transition-colors"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <FooterDark />
    </div>
  );
}
