"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/lib/products-placeholder";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  material?: string;
  price: number;
  priceFormatted: string;
  imageOff: string;
  imageOn?: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  totalWishlist: number;
  toggleWishlist: (product: Product | WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "illuminance_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  // Load dari localStorage saat mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Gagal membaca wishlist:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Simpan ke localStorage saat items berubah
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Gagal menyimpan wishlist:", e);
    }
  }, [items, isLoaded]);

  const isInWishlist = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  );

  const removeFromWishlist = useCallback(
    (id: string) => {
      setItems((prev) => {
        const target = prev.find((i) => i.id === id);
        if (target) {
          showToast({
            title: "Dihapus dari Wishlist",
            description: `${target.name} dihapus dari daftar favorit.`,
            type: "info",
          });
        }
        return prev.filter((item) => item.id !== id);
      });
    },
    [showToast]
  );

  const toggleWishlist = useCallback(
    (product: Product | WishlistItem) => {
      setItems((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          showToast({
            title: "Dihapus dari Wishlist",
            description: `${product.name} dihapus dari daftar favorit.`,
            type: "info",
          });
          return prev.filter((item) => item.id !== product.id);
        } else {
          showToast({
            title: "Disimpan ke Wishlist",
            description: `${product.name} ditambahkan ke koleksi favorit.`,
            type: "success",
          });
          const newItem: WishlistItem = {
            id: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            material: (product as Product).material,
            price: product.price,
            priceFormatted: product.priceFormatted,
            imageOff: product.imageOff,
            imageOn: product.imageOn,
          };
          return [newItem, ...prev];
        }
      });
    },
    [showToast]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalWishlist: items.length,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist harus digunakan di dalam WishlistProvider");
  }
  return context;
}
