"use client";

/**
 * CartContext — Global state keranjang belanja
 * Konsisten antara Navbar (badge), /produk, /produk/[slug], CartDrawer, dan /checkout
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useToast } from "@/context/ToastContext";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageOff: string;
  variant?: string; // mis. "Kuningan Matte | E14"
  price: number;
  priceFormatted: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
};

type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "qty"> }
  | { type: "REMOVE"; productId: string; variant?: string }
  | { type: "SET_QTY"; productId: string; variant?: string; qty: number }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const key = `${action.item.productId}__${action.item.variant ?? ""}`;
      const existing = state.items.find(
        (i) =>
          `${i.productId}__${i.variant ?? ""}` === key
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            `${i.productId}__${i.variant ?? ""}` === key
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, qty: 1 }],
      };
    }

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            !(
              i.productId === action.productId &&
              (i.variant ?? "") === (action.variant ?? "")
            )
        ),
      };

    case "SET_QTY": {
      if (action.qty < 1) {
        return {
          ...state,
          items: state.items.filter(
            (i) =>
              !(
                i.productId === action.productId &&
                (i.variant ?? "") === (action.variant ?? "")
              )
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId &&
          (i.variant ?? "") === (action.variant ?? "")
            ? { ...i, qty: action.qty }
            : i
        ),
      };
    }

    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };
    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  subtotalFormatted: string;
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (productId: string, variant?: string) => void;
  setQty: (productId: string, variant: string | undefined, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isDrawerOpen: false,
  });

  const addItem = useCallback(
    (item: Omit<CartItem, "qty">) => {
      dispatch({ type: "ADD", item });
      showToast({
        title: "Ditambahkan ke Keranjang",
        description: item.name + (item.variant ? ` (${item.variant})` : ""),
        image: item.imageOff,
        actionLabel: "Lihat Keranjang",
        onAction: () => dispatch({ type: "OPEN_DRAWER" }),
      });
    },
    [showToast]
  );

  const removeItem = useCallback((productId: string, variant?: string) => {
    dispatch({ type: "REMOVE", productId, variant });
  }, []);

  const setQty = useCallback(
    (productId: string, variant: string | undefined, qty: number) => {
      dispatch({ type: "SET_QTY", productId, variant, qty });
    },
    []
  );

  const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const totalItems = useMemo(
    () => state.items.reduce((s, i) => s + i.qty, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((s, i) => s + i.price * i.qty, 0),
    [state.items]
  );

  const subtotalFormatted = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(subtotal),
    [subtotal]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalItems,
      subtotal,
      subtotalFormatted,
      isDrawerOpen: state.isDrawerOpen,
      addItem,
      removeItem,
      setQty,
      openDrawer,
      closeDrawer,
      clearCart,
    }),
    [
      state.items,
      state.isDrawerOpen,
      totalItems,
      subtotal,
      subtotalFormatted,
      addItem,
      removeItem,
      setQty,
      openDrawer,
      closeDrawer,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
