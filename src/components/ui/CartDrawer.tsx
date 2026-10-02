"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function CartDrawer() {
  const { items, totalItems, subtotalFormatted, isDrawerOpen, closeDrawer, removeItem, setQty } =
    useCart();

  // Tutup drawer saat klik backdrop
  const backdropRef = useRef<HTMLDivElement>(null);

  // Trap focus & escape key
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isDrawerOpen, closeDrawer]);

  // Cegah scroll body saat drawer buka
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={closeDrawer}
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isDrawerOpen ? 1 : 0, pointerEvents: isDrawerOpen ? "auto" : "none" }}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white flex flex-col shadow-2xl transition-transform duration-300"
        style={{ transform: isDrawerOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-il-surface-2">
          <h2 className="font-heading font-semibold text-lg text-il-ink-on-light">
            Keranjang{" "}
            {totalItems > 0 && (
              <span className="text-il-accent">({totalItems})</span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Tutup keranjang"
            className="w-8 h-8 flex items-center justify-center rounded-full text-il-ink-on-light hover:bg-il-light-bg transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-il-light-bg flex items-center justify-center">
                {/* Ikon keranjang kosong */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#E3A34D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="#E3A34D" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="#E3A34D" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="font-body text-il-ink-on-light/60 text-sm">
                Keranjang Anda masih kosong
              </p>
              <Link
                href="/produk"
                onClick={closeDrawer}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-il-accent text-il-dark-bg font-semibold text-sm hover:bg-il-accent-dark transition-colors"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4" aria-label="Item keranjang">
              {items.map((item) => (
                <li
                  key={`${item.productId}__${item.variant ?? ""}`}
                  className="flex gap-3"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-il-light-bg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageOff}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <Link
                      href={`/produk/${item.slug}`}
                      onClick={closeDrawer}
                      className="font-body font-medium text-sm text-il-ink-on-light truncate hover:text-il-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <span className="text-xs text-il-ink-on-light/50">{item.variant}</span>
                    )}
                    <span className="font-heading font-bold text-sm text-il-accent">
                      {item.priceFormatted}
                    </span>

                    {/* Qty stepper + hapus */}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center border border-il-surface-2 rounded-full overflow-hidden">
                        <button
                          onClick={() => setQty(item.productId, item.variant, item.qty - 1)}
                          aria-label="Kurangi jumlah"
                          className="w-7 h-7 flex items-center justify-center text-il-ink-on-light hover:bg-il-light-bg transition-colors cursor-pointer"
                        >
                          <svg width="10" height="2" viewBox="0 0 10 2" aria-hidden="true"><rect width="10" height="2" rx="1" fill="currentColor"/></svg>
                        </button>
                        <span className="px-2 text-sm font-medium text-il-ink-on-light min-w-[24px] text-center" aria-label={`Jumlah: ${item.qty}`}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.productId, item.variant, item.qty + 1)}
                          aria-label="Tambah jumlah"
                          className="w-7 h-7 flex items-center justify-center text-il-ink-on-light hover:bg-il-light-bg transition-colors cursor-pointer"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variant)}
                        aria-label={`Hapus ${item.name} dari keranjang`}
                        className="text-xs text-il-ink-on-light/40 hover:text-il-danger transition-colors cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — hanya tampil kalau ada item */}
        {items.length > 0 && (
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-il-surface-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-il-ink-on-light/70">Subtotal</span>
              <span className="font-heading font-bold text-base text-il-ink-on-light">
                {subtotalFormatted}
              </span>
            </div>
            <p className="text-xs text-il-ink-on-light/40">
              Ongkir dihitung di halaman checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="w-full text-center py-3.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold hover:bg-il-accent-dark transition-colors"
            >
              Checkout
            </Link>
            <button
              onClick={closeDrawer}
              className="w-full text-center py-2.5 rounded-full border border-il-surface-2 text-il-ink-on-light/70 text-sm hover:border-il-ink-on-light/30 transition-colors cursor-pointer"
            >
              Lanjut Belanja
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
