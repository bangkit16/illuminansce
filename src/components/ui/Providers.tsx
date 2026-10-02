"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import type { ReactNode } from "react";

/**
 * Provider wrapper — harus 'use client' karena Context butuh React context.
 * ToastProvider membungkus CartProvider dan WishlistProvider agar notifikasi toast tersedia di mana saja.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
