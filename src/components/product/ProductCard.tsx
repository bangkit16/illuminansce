"use client";

import Link from "next/link";
import { LitStateImage } from "@/components/ui/LitStateImage";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { type Product, getCategoryLabel } from "@/lib/products-placeholder";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Jangan navigate ke halaman detail
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageOff: product.imageOff,
      price: product.price,
      priceFormatted: product.priceFormatted,
      variant: undefined,
    });
    openDrawer();
  };

  return (
    <article className="group relative bg-white rounded-xl border border-il-surface-2 overflow-hidden hover:-translate-y-1 transition-transform duration-200 hover:shadow-md">
      {/* Gambar dengan LitStateImage — fitur utama brand */}
      <div className="relative">
        <Link
          href={`/produk/${product.slug}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-il-accent"
        >
          <LitStateImage
            imageOff={product.imageOff}
            imageOn={product.imageOn}
            alt={product.name}
            triggerMode="hover"
            aspectClass="aspect-[3/4]"
            className="w-full"
          />
        </Link>

        {/* Badge */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] bg-il-dark-bg/90 text-il-ink-on-dark">
              Baru
            </span>
          )}
          {product.isLowStock && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] bg-il-danger/90 text-white">
              Stok Terbatas
            </span>
          )}
        </div>

        {/* Wishlist toggle button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isFav ? `Hapus ${product.name} dari wishlist` : `Simpan ${product.name} ke wishlist`}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 cursor-pointer ${
            isFav
              ? "bg-il-accent text-il-dark-bg shadow-sm"
              : "bg-white/85 hover:bg-white text-il-ink-on-light/60 hover:text-il-accent shadow-2xs backdrop-blur-xs"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={isFav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick add desktop — muncul saat hover */}
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Tambah ${product.name} ke keranjang`}
          className="hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 rounded-full bg-il-dark-bg/90 text-il-ink-on-dark text-xs font-semibold backdrop-blur-sm hover:bg-il-dark-bg cursor-pointer z-10"
        >
          + Keranjang
        </button>
      </div>

      {/* Info produk */}
      <div className="p-3 sm:p-4">
        {/* Kategori */}
        <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-il-ink-on-light/40 mb-1">
          {getCategoryLabel(product.category)}
        </span>

        <Link
          href={`/produk/${product.slug}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-il-accent rounded"
        >
          <h3 className="font-heading font-semibold text-xs sm:text-base text-il-ink-on-light leading-snug group-hover:text-il-accent transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2 pt-0.5">
          <p className="font-heading font-bold text-xs sm:text-base text-il-accent truncate">
            {product.priceFormatted}
          </p>
          {/* Quick add mobile — tombol sentuh tanpa perlu hover */}
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="md:hidden w-7 h-7 rounded-full bg-il-accent/15 hover:bg-il-accent text-il-accent hover:text-il-dark-bg flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M8 2.5v11M2.5 8h11" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
