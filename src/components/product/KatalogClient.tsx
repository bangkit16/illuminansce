"use client";

/**
 * KatalogClient — logika filter + grid client-side untuk /produk
 * Dilengkapi Search Bar langsung di halaman produk
 * Mendukung pencarian teks (q), kategori, material, warna cahaya, rentang harga, dan sorting
 */

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, products, PRICE_MIN, PRICE_MAX } from "@/lib/products-placeholder";
import { getStoredProducts } from "@/lib/products-storage";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterPanel } from "@/components/product/FilterPanel";

const PAGE_SIZE = 8;

const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "harga-asc", label: "Harga Terendah" },
  { value: "harga-desc", label: "Harga Tertinggi" },
];

export function KatalogClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // URL State
  const searchQuery = searchParams.get("q") ?? "";
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setLocalSearch(searchQuery);
  }

  const activeCategories = searchParams.getAll("kategori");
  const activeMaterials = searchParams.getAll("material");
  const activeLightColors = searchParams.getAll("cahaya");
  const priceMin = Number(searchParams.get("hargaMin") ?? PRICE_MIN);
  const priceMax = Number(searchParams.get("hargaMax") ?? PRICE_MAX);
  const sort = searchParams.get("sort") ?? "terbaru";

  const handleSearchSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch.trim()) {
      params.set("q", localSearch.trim());
    } else {
      params.delete("q");
    }
    setPage(1);
    router.push(`/produk?${params.toString()}`, { scroll: false });
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    setPage(1);
    router.push(`/produk?${params.toString()}`, { scroll: false });
  };

  const [productList, setProductList] = useState<Product[]>(products);

  useEffect(() => {
    const syncProducts = () => {
      setProductList(getStoredProducts());
    };
    syncProducts();
    window.addEventListener("illuminance:products-updated", syncProducts);
    return () => {
      window.removeEventListener("illuminance:products-updated", syncProducts);
    };
  }, []);

  // Filter produk
  const filtered = useMemo(() => {
    let result = [...productList];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    if (activeCategories.length > 0) {
      result = result.filter((p) => activeCategories.includes(p.category));
    }
    if (activeMaterials.length > 0) {
      result = result.filter((p) => activeMaterials.includes(p.material));
    }
    if (activeLightColors.length > 0) {
      result = result.filter((p) => activeLightColors.includes(p.lightColor));
    }
    result = result.filter((p) => p.price >= priceMin && p.price <= priceMax);

    // Sort
    if (sort === "harga-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "harga-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [productList, searchQuery, activeCategories, activeMaterials, activeLightColors, priceMin, priceMax, sort]);

  const displayed = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < filtered.length;

  // Chip filter aktif
  const activeChips: { key: string; value: string; label: string }[] = [
    ...(searchQuery ? [{ key: "q", value: searchQuery, label: `Pencarian: "${searchQuery}"` }] : []),
    ...activeCategories.map((v) => ({ key: "kategori", value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })),
    ...activeMaterials.map((v) => ({ key: "material", value: v, label: v })),
    ...activeLightColors.map((v) => ({ key: "cahaya", value: v, label: v })),
  ];

  const removeChip = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "q") {
      params.delete("q");
      setLocalSearch("");
    } else {
      const current = params.getAll(key).filter((v) => v !== value);
      params.delete(key);
      current.forEach((v) => params.append(key, v));
    }
    setPage(1);
    router.push(`/produk?${params.toString()}`, { scroll: false });
  };

  const setSort = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", val);
    setPage(1);
    router.push(`/produk?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    router.push("/produk");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ─── SEARCH BAR DI HALAMAN PRODUK ─── */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
        <div className="relative flex items-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            className="absolute left-4 text-il-ink-on-light/40 pointer-events-none"
          >
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="search-input"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari lampu meja, gantung, kuningan, kayu..."
            className="w-full pl-11 pr-24 py-3 rounded-full bg-white border border-il-surface-2 text-sm text-il-ink-on-light placeholder:text-il-ink-on-light/40 shadow-xs outline-none focus:border-il-accent transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Hapus kata kunci pencarian"
              className="absolute right-16 text-il-ink-on-light/40 hover:text-il-ink-on-light p-1 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-2 rounded-full bg-il-accent text-il-dark-bg text-xs font-semibold hover:bg-il-accent-dark transition-colors cursor-pointer shadow-xs"
          >
            Cari
          </button>
        </div>
      </form>

      {/* Grid + Filter Layout */}
      <div className="flex gap-6 md:gap-8 w-full items-start">
        {/* FilterPanel — sidebar (desktop) / bottom-sheet (mobile) */}
        <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

        {/* Konten utama */}
        <div className="flex-1 min-w-0 w-full">
          {/* SortAndCount + tombol filter mobile */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Tombol filter mobile & tablet */}
              <button
                onClick={() => setIsFilterOpen(true)}
                aria-label="Buka panel filter"
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-il-surface-2 bg-white text-sm font-medium text-il-ink-on-light hover:border-il-accent transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filter
              </button>

              <p className="font-body text-sm text-il-ink-on-light/60">
                Menampilkan{" "}
                <span className="text-il-ink-on-light font-medium">{displayed.length}</span>
                {" "}dari{" "}
                <span className="text-il-ink-on-light font-medium">{filtered.length}</span>
                {" "}produk
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="font-body text-sm text-il-ink-on-light/60 hidden sm:inline">
                Urutkan:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="font-body text-sm border border-il-surface-2 rounded-full px-3.5 py-1.5 text-il-ink-on-light bg-white outline-none focus:border-il-accent transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chip filter aktif */}
          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {activeChips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.value}`}
                  onClick={() => removeChip(chip.key, chip.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-il-accent/10 border border-il-accent/30 text-il-accent text-xs font-medium hover:bg-il-accent/20 transition-colors cursor-pointer"
                  aria-label={`Hapus filter: ${chip.label}`}
                >
                  {chip.label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Grid produk */}
          {displayed.length === 0 ? (
            <div className="w-full py-20 text-center bg-white rounded-xl border border-il-surface-2 p-8 shadow-xs">
              <p className="font-body text-il-ink-on-light/50 mb-4">
                Tidak ada produk yang sesuai dengan filter atau kata kunci &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-sm font-semibold text-il-accent hover:underline cursor-pointer"
              >
                Reset semua filter &amp; pencarian
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {displayed.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-8 py-3 rounded-full border border-il-surface-2 bg-white text-il-ink-on-light font-heading font-semibold text-sm hover:border-il-accent hover:text-il-accent transition-colors cursor-pointer shadow-sm"
                  >
                    Muat Lebih Banyak
                    <span className="ml-2 text-il-ink-on-light/40 font-normal">
                      ({filtered.length - displayed.length} tersisa)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
