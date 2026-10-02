import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/lib/products-placeholder";

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="bg-il-dark-surface py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <h2 className="font-heading font-semibold text-3xl md:text-5xl text-il-ink-on-dark tracking-[-0.02em]">
              Pilihan unggulan
            </h2>
            <p className="font-body text-il-ink-on-dark/60 mt-2 max-w-[400px]">
              Lampu-lampu terpilih yang paling diminati pelanggan kami.
            </p>
          </div>
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-sm font-semibold text-il-accent hover:text-il-ink-on-dark transition-colors duration-200 flex-shrink-0"
          >
            Lihat Semua Produk
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Grid — FeaturedProducts menggunakan ProductCard yang sama dengan /produk */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.slice(0, 4).map((product) => (
            // ProductCard di sini menggunakan light theme card
            // (putih di atas dark-surface memberikan kontras menarik)
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
