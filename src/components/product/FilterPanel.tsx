"use client";

/**
 * FilterPanel — sidebar desktop / bottom-sheet mobile
 * Background putih & warna slider selaras dengan tema katalog
 * UX Slider & Filter Harga intuitif dengan Preset tombol cepat & Slider terkontrol
 * State tersimpan di URL query string
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  categories,
  materials,
  lightColors,
  PRICE_MIN,
  PRICE_MAX,
} from "@/lib/products-placeholder";

type FilterPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PRICE_PRESETS = [
  { label: "Semua", min: PRICE_MIN, max: PRICE_MAX },
  { label: "< 1 Juta", min: PRICE_MIN, max: 1_000_000 },
  { label: "1 - 2 Juta", min: 1_000_000, max: 2_000_000 },
  { label: "2 - 3 Juta", min: 2_000_000, max: 3_000_000 },
  { label: "> 3 Juta", min: 3_000_000, max: PRICE_MAX },
];

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Baca state filter dari URL
  const activeCategories = searchParams.getAll("kategori");
  const activeMaterials = searchParams.getAll("material");
  const activeLightColors = searchParams.getAll("cahaya");
  const priceMin = Number(searchParams.get("hargaMin") ?? PRICE_MIN);
  const priceMax = Number(searchParams.get("hargaMax") ?? PRICE_MAX);

  const updateParam = useCallback(
    (key: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(key);
      if (checked) {
        if (!current.includes(value)) params.append(key, value);
      } else {
        params.delete(key);
        current.filter((v) => v !== value).forEach((v) => params.append(key, v));
      }
      router.push(`/produk?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const updatePriceRange = useCallback(
    (min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min <= PRICE_MIN) params.delete("hargaMin");
      else params.set("hargaMin", String(min));

      if (max >= PRICE_MAX) params.delete("hargaMax");
      else params.set("hargaMax", String(max));

      router.push(`/produk?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const resetAll = useCallback(() => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    const q = searchParams.get("q");
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);
    router.push(`/produk?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeMaterials.length > 0 ||
    activeLightColors.length > 0 ||
    priceMin > PRICE_MIN ||
    priceMax < PRICE_MAX;

  const formatShortPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const panelContent = (
    <div className="flex flex-col gap-6">
      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetAll}
          className="self-start text-xs font-semibold text-il-danger hover:text-il-danger/80 transition-colors cursor-pointer"
        >
          Reset Semua Filter &times;
        </button>
      )}

      {/* Kategori */}
      <fieldset>
        <legend className="font-body font-semibold text-sm text-il-ink-on-light mb-3 flex items-center justify-between">
          <span>Kategori</span>
          {activeCategories.length > 0 && (
            <span className="text-[10px] text-il-accent px-1.5 py-0.5 rounded bg-il-accent/15 font-semibold">
              {activeCategories.length}
            </span>
          )}
        </legend>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const checked = activeCategories.includes(cat.value);
            return (
              <label
                key={cat.value}
                className="flex items-center gap-2.5 cursor-pointer group select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateParam("kategori", cat.value, e.target.checked)}
                  className="w-4 h-4 rounded border-il-surface-2 accent-il-accent cursor-pointer"
                  aria-label={`Filter kategori: ${cat.label}`}
                />
                <span
                  className={`font-body text-sm transition-colors ${
                    checked
                      ? "text-il-accent font-semibold"
                      : "text-il-ink-on-light/70 group-hover:text-il-ink-on-light"
                  }`}
                >
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="h-px bg-il-surface-2" />

      {/* Rentang Harga - Redesigned UX & Harmonious Colors */}
      <fieldset>
        <legend className="font-body font-semibold text-sm text-il-ink-on-light mb-3">
          Rentang Harga
        </legend>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-1.5 mb-3.5">
          {PRICE_PRESETS.map((p) => {
            const isPresetActive = priceMin === p.min && priceMax === p.max;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => updatePriceRange(p.min, p.max)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                  isPresetActive
                    ? "bg-il-accent/15 border-il-accent text-il-accent font-semibold"
                    : "bg-white border-il-surface-2 text-il-ink-on-light/70 hover:border-il-accent/50 hover:text-il-ink-on-light"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Slider Card Container with Soft Background */}
        <div className="p-3.5 rounded-xl bg-il-light-bg border border-il-surface-2 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-il-ink-on-light/50 font-medium">Batas Maksimum</span>
            <span className="font-semibold text-il-accent font-heading text-sm">
              {formatShortPrice(priceMax)}
            </span>
          </div>

          <input
            id="price-range-slider"
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50_000}
            value={priceMax}
            onChange={(e) => updatePriceRange(priceMin, Number(e.target.value))}
            className="w-full accent-il-accent cursor-pointer h-2 bg-il-surface-2 rounded-lg"
            aria-label="Filter batas harga maksimum"
          />

          <div className="flex justify-between text-[11px] text-il-ink-on-light/40 font-mono">
            <span>{formatShortPrice(PRICE_MIN)}</span>
            <span>{formatShortPrice(PRICE_MAX)}</span>
          </div>
        </div>
      </fieldset>

      <div className="h-px bg-il-surface-2" />

      {/* Material */}
      <fieldset>
        <legend className="font-body font-semibold text-sm text-il-ink-on-light mb-3 flex items-center justify-between">
          <span>Material / Finish</span>
          {activeMaterials.length > 0 && (
            <span className="text-[10px] text-il-accent px-1.5 py-0.5 rounded bg-il-accent/15 font-semibold">
              {activeMaterials.length}
            </span>
          )}
        </legend>
        <div className="flex flex-col gap-2">
          {materials.map((mat) => {
            const checked = activeMaterials.includes(mat.value);
            return (
              <label
                key={mat.value}
                className="flex items-center gap-2.5 cursor-pointer group select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateParam("material", mat.value, e.target.checked)}
                  className="w-4 h-4 rounded border-il-surface-2 accent-il-accent cursor-pointer"
                  aria-label={`Filter material: ${mat.label}`}
                />
                <span
                  className={`font-body text-sm transition-colors ${
                    checked
                      ? "text-il-accent font-semibold"
                      : "text-il-ink-on-light/70 group-hover:text-il-ink-on-light"
                  }`}
                >
                  {mat.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="h-px bg-il-surface-2" />

      {/* Warna Cahaya */}
      <fieldset>
        <legend className="font-body font-semibold text-sm text-il-ink-on-light mb-3 flex items-center justify-between">
          <span>Warna Cahaya</span>
          {activeLightColors.length > 0 && (
            <span className="text-[10px] text-il-accent px-1.5 py-0.5 rounded bg-il-accent/15 font-semibold">
              {activeLightColors.length}
            </span>
          )}
        </legend>
        <div className="flex flex-col gap-2">
          {lightColors.map((lc) => {
            const checked = activeLightColors.includes(lc.value);
            return (
              <label
                key={lc.value}
                className="flex items-center gap-2.5 cursor-pointer group select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateParam("cahaya", lc.value, e.target.checked)}
                  className="w-4 h-4 rounded border-il-surface-2 accent-il-accent cursor-pointer"
                  aria-label={`Filter warna cahaya: ${lc.label}`}
                />
                <span
                  className={`font-body text-sm transition-colors ${
                    checked
                      ? "text-il-accent font-semibold"
                      : "text-il-ink-on-light/70 group-hover:text-il-ink-on-light"
                  }`}
                >
                  {lc.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block w-60 shrink-0 sticky top-24 h-fit"
        aria-label="Panel filter produk"
      >
        <div className="bg-white rounded-xl border border-il-surface-2 p-5 shadow-sm">
          <h2 className="font-heading font-semibold text-base text-il-ink-on-light mb-5 flex items-center justify-between">
            <span>Filter</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-il-accent">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </h2>
          {panelContent}
        </div>
      </aside>

      {/* Mobile & Tablet bottom-sheet */}
      <>
        {/* Backdrop */}
        <div
          onClick={onClose}
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        />

        {/* Sheet */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter produk"
          className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl sm:rounded-t-3xl transition-transform duration-300 max-h-[85dvh] sm:max-w-lg sm:mx-auto sm:rounded-2xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 overflow-y-auto"
          style={{ transform: isOpen ? "translateY(0)" : "translateY(100%)" }}
        >
          <div className="sticky top-0 bg-white flex items-center justify-between px-5 pt-5 pb-4 border-b border-il-surface-2 z-10">
            <h2 className="font-heading font-semibold text-base text-il-ink-on-light">Filter</h2>
            <button
              onClick={onClose}
              aria-label="Tutup filter"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-il-light-bg text-il-ink-on-light transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="px-5 py-5">{panelContent}</div>
          <div className="sticky bottom-0 bg-white px-5 pt-3 pb-6 border-t border-il-surface-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold hover:bg-il-accent-dark transition-colors cursor-pointer"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </>
    </>
  );
}
