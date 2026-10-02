"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products, Product } from "@/lib/products-placeholder";
import {
  getStoredProducts,
  deleteStoredProduct,
  toggleStoredProductStock,
} from "@/lib/products-storage";
import { useToast } from "@/context/ToastContext";

export default function AdminProdukPage() {
  const { showToast } = useToast();
  const [productList, setProductList] = useState<Product[]>(products);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  useEffect(() => {
    const loadProducts = () => {
      setProductList(getStoredProducts());
    };
    loadProducts();

    window.addEventListener("illuminance:products-updated", loadProducts);
    return () => {
      window.removeEventListener("illuminance:products-updated", loadProducts);
    };
  }, []);

  const handleToggleProductStock = (productId: string) => {
    const updatedStatus = toggleStoredProductStock(productId);
    if (updatedStatus !== null) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isLowStock: updatedStatus } : p
        )
      );
      showToast({
        title: "Status Stok Diubah",
        description: `Stok lampu kini ${updatedStatus ? "ditandai menipis" : "tersedia"}.`,
        type: "info",
      });
    }
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Hapus produk "${productName}" dari katalog?`)) {
      deleteStoredProduct(productId);
      setProductList((prev) => prev.filter((p) => p.id !== productId));
      showToast({
        title: "Produk Dihapus",
        description: `${productName} telah dihapus dari etalase.`,
        type: "info",
      });
    }
  };

  const filteredProducts = productList.filter((p) => {
    const matchCat =
      productCategoryFilter === "all" || p.category === productCategoryFilter;
    const matchSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.material.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-white border border-il-surface-2 rounded-2xl p-5 md:p-6 shadow-xs space-y-6">
      {/* Header Kelola Produk */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-semibold text-lg text-il-ink-on-light">
            Katalog Lampu &amp; Ketersediaan Stok
          </h2>
          <p className="text-xs text-il-ink-on-light/50 mt-0.5">
            Total {productList.length} produk terdaftar dalam etalase toko
          </p>
        </div>
        <Link
          href="/admin/produk/tambah"
          className="px-4 py-2.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-xs hover:bg-il-accent-dark transition-colors self-start sm:self-auto cursor-pointer shadow-xs inline-flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah Lampu Baru</span>
        </Link>
      </div>

      {/* Filter & Search Bar Produk */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Cari nama atau material lampu..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light placeholder:text-il-ink-on-light/40 outline-none focus:border-il-accent"
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-il-ink-on-light/40"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-il-ink-on-light/50">Kategori:</label>
          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none cursor-pointer focus:border-il-accent"
          >
            <option value="all">Semua Kategori</option>
            <option value="meja">Lampu Meja</option>
            <option value="gantung">Lampu Gantung</option>
            <option value="lantai">Lampu Lantai</option>
            <option value="dinding">Lampu Dinding</option>
            <option value="baca">Lampu Baca</option>
          </select>
        </div>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-il-light-bg/70 border border-il-surface-2 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-2xs group hover:border-il-accent/40 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-il-surface-2 shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageOff}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                {p.isFeatured && (
                  <span
                    className="absolute top-1 left-1 w-2 h-2 rounded-full bg-il-accent ring-2 ring-white"
                    title="Produk Unggulan"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-semibold text-il-accent">
                    {p.category}
                  </span>
                  {p.isNew && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-il-accent/15 text-il-accent font-semibold">
                      Baru
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-xs text-il-ink-on-light truncate mt-0.5">
                  {p.name}
                </h3>
                <p className="text-[11px] font-heading font-bold text-il-accent mt-0.5">
                  {p.priceFormatted}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-il-surface-2/60">
              <button
                onClick={() => handleToggleProductStock(p.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                  p.isLowStock
                    ? "bg-il-danger/10 text-il-danger border-il-danger/30 hover:bg-il-danger/20"
                    : "bg-il-success/10 text-il-success border-il-success/30 hover:bg-il-success/20"
                }`}
              >
                {p.isLowStock ? "Stok Menipis" : "Tersedia"}
              </button>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/produk/${p.id}/edit`}
                  className="px-2.5 py-1 rounded-lg bg-white border border-il-surface-2 text-[11px] font-medium text-il-ink-on-light hover:border-il-accent hover:text-il-accent transition-colors cursor-pointer"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteProduct(p.id, p.name)}
                  className="p-1 rounded-lg text-il-ink-on-light/40 hover:text-il-danger hover:bg-il-danger/10 transition-colors cursor-pointer"
                  title="Hapus Produk"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-xs text-il-ink-on-light/50">
          Tidak ada produk yang cocok dengan pencarian &quot;{productSearch}&quot;.
        </div>
      )}
    </div>
  );
}
