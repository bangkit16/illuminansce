import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { ProductCard } from "@/components/product/ProductCard";
import { DetailProdukClient } from "@/components/product/DetailProdukClient";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products-placeholder";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params untuk semua slug produk
export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan — Illuminance" };
  return {
    title: `${product.name} — Illuminance`,
    description: product.shortDescription,
  };
}

export default async function DetailProdukPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <div className="bg-il-light-bg min-h-dvh flex flex-col">
      <Navbar variant="light" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-10 md:pb-14 flex-1">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-il-ink-on-light/40 font-body">
            <li>
              <Link href="/" className="hover:text-il-accent transition-colors">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/produk" className="hover:text-il-accent transition-colors">
                Produk
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-il-ink-on-light truncate max-w-[200px]" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Konten detail — interaktif dipisah ke Client Component */}
        <DetailProdukClient product={product} />

        {/* Produk Serupa */}
        {related.length > 0 && (
          <section className="mt-20 md:mt-28" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="font-heading font-semibold text-2xl md:text-3xl text-il-ink-on-light tracking-[-0.02em] mb-8"
            >
              Produk Serupa
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer minimal light */}
      <footer className="bg-white border-t border-il-surface-2 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-il-ink-on-light/40">
            &copy; {new Date().getFullYear()} Illuminance. Hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
