"use client";

/**
 * DetailProdukClient — komponen interaktif halaman detail produk
 * Gallery LitStateImage, varian (swatch/pill), stepper qty, CTA, Tabs
 */

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { LitStateImage } from "@/components/ui/LitStateImage";
import type { Product } from "@/lib/products-placeholder";

type Props = { product: Product };

const TABS = ["Deskripsi", "Spesifikasi", "Pengiriman & Pengembalian"] as const;
type Tab = (typeof TABS)[number];

export function DetailProdukClient({ product }: Props) {
  const { addItem, openDrawer } = useCart();

  const [activeTab, setActiveTab] = useState<Tab>("Deskripsi");
  const [selectedFinish, setSelectedFinish] = useState(product.variants.finish?.[0] ?? null);
  const [selectedUkuran, setSelectedUkuran] = useState(product.variants.ukuran?.[0] ?? null);
  const [selectedBohlam, setSelectedBohlam] = useState(product.variants.tipBohlam?.[0] ?? null);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const [activeCustomImage, setActiveCustomImage] = useState<string | null>(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(product.id);

  const variantLabel = [selectedFinish, selectedUkuran, selectedBohlam]
    .filter(Boolean)
    .join(" | ") || undefined;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageOff: product.imageOff,
      price: product.price * qty,
      priceFormatted: formatRp(product.price * qty),
      variant: variantLabel,
    });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageOff: product.imageOff,
      price: product.price * qty,
      priceFormatted: formatRp(product.price * qty),
      variant: variantLabel,
    });
    window.location.href = "/checkout";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* ─── GALERI ─── */}
      <div className="flex flex-col gap-4">
        {/* Gambar utama */}
        {activeCustomImage ? (
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-il-light-bg border border-il-surface-2 w-full group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeCustomImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              onClick={() => setActiveCustomImage(null)}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-il-dark-bg/85 text-il-ink-on-dark backdrop-blur-xs hover:bg-il-dark-bg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>☀</span> Kembali ke Efek Padam/Menyala
            </button>
          </div>
        ) : (
          <LitStateImage
            imageOff={product.imageOff}
            imageOn={product.imageOn}
            alt={product.name}
            triggerMode="both"
            aspectClass="aspect-[4/5]"
            showToggleButton={true}
            className="w-full"
          />
        )}

        {/* Strip thumbnail */}
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Thumbnail galeri produk">
          <button
            onClick={() => setActiveCustomImage(null)}
            aria-label={`Foto utama padam & menyala — ${product.name}`}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 focus:outline-none cursor-pointer transition-all ${
              activeCustomImage === null
                ? "border-il-accent shadow-xs scale-102"
                : "border-transparent hover:border-il-accent/50 opacity-80 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageOff}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>

          {product.galleryImages?.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCustomImage(imgUrl)}
              aria-label={`Foto tambahan ${idx + 1} — ${product.name}`}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 focus:outline-none cursor-pointer transition-all ${
                activeCustomImage === imgUrl
                  ? "border-il-accent shadow-xs scale-102"
                  : "border-transparent hover:border-il-accent/50 opacity-80 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ─── INFO ─── */}
      <div className="flex flex-col gap-5">
        {/* Kategori */}
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-il-accent">
          {product.category === "meja" && "Lampu Meja"}
          {product.category === "gantung" && "Lampu Gantung"}
          {product.category === "lantai" && "Lampu Lantai"}
          {product.category === "dinding" && "Lampu Dinding"}
          {product.category === "baca" && "Lampu Baca"}
        </span>

        <h1 className="font-heading font-bold text-3xl md:text-4xl text-il-ink-on-light tracking-[-0.02em] leading-[1.1]">
          {product.name}
        </h1>

        <div className="font-heading font-bold text-2xl text-il-ink-on-light">
          {product.priceFormatted}
        </div>

        <p className="font-body text-sm text-il-ink-on-light/70 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Badges stok */}
        <div className="flex items-center gap-2">
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-il-accent/10 text-il-accent border border-il-accent/20">
              Baru
            </span>
          )}
          {product.isLowStock && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-il-danger/10 text-il-danger border border-il-danger/20">
              Stok Terbatas
            </span>
          )}
        </div>

        <hr className="border-il-surface-2" />

        {/* Varian Finish */}
        {product.variants.finish && (
          <div>
            <p className="font-body font-medium text-sm text-il-ink-on-light mb-2">
              Finish:{" "}
              <span className="font-normal text-il-ink-on-light/60">{selectedFinish}</span>
            </p>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Pilih finish">
              {product.variants.finish.map((f) => {
                const isActive = selectedFinish === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFinish(f)}
                    aria-pressed={isActive}
                    aria-label={`Finish: ${f}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isActive
                        ? "border-il-accent bg-il-accent/10 text-il-accent"
                        : "border-il-surface-2 text-il-ink-on-light/70 hover:border-il-ink-on-light/40"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Varian Ukuran */}
        {product.variants.ukuran && (
          <div>
            <p className="font-body font-medium text-sm text-il-ink-on-light mb-2">
              Ukuran:{" "}
              <span className="font-normal text-il-ink-on-light/60">{selectedUkuran}</span>
            </p>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Pilih ukuran">
              {product.variants.ukuran.map((u) => {
                const isActive = selectedUkuran === u;
                return (
                  <button
                    key={u}
                    onClick={() => setSelectedUkuran(u)}
                    aria-pressed={isActive}
                    aria-label={`Ukuran: ${u}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isActive
                        ? "border-il-accent bg-il-accent/10 text-il-accent"
                        : "border-il-surface-2 text-il-ink-on-light/70 hover:border-il-ink-on-light/40"
                    }`}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Varian Tip Bohlam */}
        {product.variants.tipBohlam && (
          <div>
            <p className="font-body font-medium text-sm text-il-ink-on-light mb-2">
              Tipe Bohlam:{" "}
              <span className="font-normal text-il-ink-on-light/60">{selectedBohlam}</span>
            </p>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Pilih tipe bohlam">
              {product.variants.tipBohlam.map((b) => {
                const isActive = selectedBohlam === b;
                return (
                  <button
                    key={b}
                    onClick={() => setSelectedBohlam(b)}
                    aria-pressed={isActive}
                    aria-label={`Tipe bohlam: ${b}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isActive
                        ? "border-il-accent bg-il-accent/10 text-il-accent"
                        : "border-il-surface-2 text-il-ink-on-light/70 hover:border-il-ink-on-light/40"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stepper qty */}
        <div className="flex items-center gap-4">
          <label className="font-body font-medium text-sm text-il-ink-on-light">Jumlah:</label>
          <div className="flex items-center border border-il-surface-2 rounded-full overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Kurangi jumlah"
              disabled={qty <= 1}
              className="w-9 h-9 flex items-center justify-center text-il-ink-on-light hover:bg-il-light-bg transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              <svg width="12" height="2" viewBox="0 0 12 2" aria-hidden="true">
                <rect width="12" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <span
              className="px-3 text-sm font-medium text-il-ink-on-light min-w-[32px] text-center"
              aria-label={`Jumlah: ${qty}`}
              aria-live="polite"
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              aria-label="Tambah jumlah"
              className="w-9 h-9 flex items-center justify-center text-il-ink-on-light hover:bg-il-light-bg transition-colors cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-1">
            <button
              onClick={handleAddToCart}
              aria-label="Tambah ke keranjang belanja"
              className="flex-1 py-3.5 px-4 rounded-full border-2 border-il-accent text-il-accent font-heading font-semibold hover:bg-il-accent hover:text-il-dark-bg transition-all duration-200 cursor-pointer text-xs sm:text-sm text-center"
            >
              {addedMsg ? "Ditambahkan!" : "Tambah ke Keranjang"}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label={isFav ? "Hapus dari wishlist" : "Simpan ke wishlist"}
              title={isFav ? "Hapus dari wishlist" : "Simpan ke wishlist"}
              className={`w-12 sm:w-14 h-12 sm:h-auto rounded-full flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                isFav
                  ? "bg-il-accent text-il-dark-bg border-il-accent"
                  : "border-il-surface-2 text-il-ink-on-light/60 hover:text-il-accent hover:border-il-accent"
              }`}
            >
              <svg
                width="20"
                height="20"
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
          </div>
          <button
            onClick={handleBuyNow}
            aria-label="Beli sekarang — langsung ke checkout"
            className="w-full sm:flex-1 py-3.5 px-4 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold hover:bg-il-accent-dark transition-colors duration-200 cursor-pointer text-xs sm:text-sm text-center"
          >
            Beli Sekarang
          </button>
        </div>

        {/* Trust signal kecil */}
        <div className="flex items-center gap-2 text-xs text-il-ink-on-light/40">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1L2 4v4c0 2.76 2.24 4.5 5 5 2.76-.5 5-2.24 5-5V4L7 1z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4.5 7l1.5 1.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Garansi resmi 1 tahun & pengemasan kayu aman.
        </div>

        {/* ─── TABS ─── */}
        <div className="mt-2">
          {/* Tab navigation */}
          <div className="flex border-b border-il-surface-2" role="tablist" aria-label="Informasi produk">
            {TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`tab-panel-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "border-il-accent text-il-accent font-semibold"
                    : "border-transparent text-il-ink-on-light/50 hover:text-il-ink-on-light"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="pt-5">
            {/* Deskripsi */}
            <div
              id="tab-panel-Deskripsi"
              role="tabpanel"
              aria-labelledby="tab-Deskripsi"
              hidden={activeTab !== "Deskripsi"}
            >
              <p className="font-body text-sm text-il-ink-on-light/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Spesifikasi */}
            <div
              id="tab-panel-Spesifikasi"
              role="tabpanel"
              aria-labelledby="tab-Spesifikasi"
              hidden={activeTab !== "Spesifikasi"}
            >
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="border-b border-il-surface-2 pb-2">
                    <dt className="font-body text-xs text-il-ink-on-light/40 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="font-body text-sm text-il-ink-on-light font-medium mt-0.5">
                      {val}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Pengiriman & Pengembalian */}
            <div
              id="tab-panel-Pengiriman-Pengembalian"
              role="tabpanel"
              aria-labelledby="tab-Pengiriman"
              hidden={activeTab !== "Pengiriman & Pengembalian"}
            >
              <div className="font-body text-sm text-il-ink-on-light/70 leading-relaxed space-y-3">
                <p>
                  <strong className="text-il-ink-on-light font-semibold">Pengiriman</strong>
                  <br />
                  Dikirim menggunakan peti kayu berstandar ekspedisi untuk menjamin keamanan lampu sampai di tujuan.
                </p>
                <p>
                  <strong className="text-il-ink-on-light font-semibold">Pengembalian Barang</strong>
                  <br />
                  Garansi retur dan penggantian baru dalam 7 hari jika barang cacat atau mengalami kerusakan saat pengiriman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRp(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
