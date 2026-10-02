"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product, products } from "@/lib/products-placeholder";
import { getStoredProductById } from "@/lib/products-storage";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProdukClientProps {
  id: string;
}

export function EditProdukClient({ id }: EditProdukClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cari dari storage terlebih dahulu, lalu fallback ke dummy products
    const stored = getStoredProductById(id);
    if (stored) {
      setProduct(stored);
    } else {
      const fallback = products.find((p) => p.id === id);
      if (fallback) {
        setProduct(fallback);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs text-il-ink-on-light/50 font-medium animate-pulse">
          Memuat spesifikasi produk...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-il-surface-2 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-il-danger/10 text-il-danger flex items-center justify-center font-bold text-lg">
          !
        </div>
        <h2 className="font-heading font-semibold text-lg text-il-ink-on-light">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-xs text-il-ink-on-light/60">
          Produk dengan ID <span className="font-mono font-semibold">#{id}</span> tidak
          ditemukan dalam database atau telah dihapus.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/produk"
            className="inline-block px-4 py-2 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-xs hover:bg-il-accent-dark transition-colors"
          >
            Kembali ke Kelola Produk
          </Link>
        </div>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEdit={true} />;
}
