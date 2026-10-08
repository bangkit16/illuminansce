import type { Metadata } from "next";
import { WishlistClient } from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "Koleksi Wishlist — Illuminance",
  description:
    "Daftar lampu artisan yang Anda simpan untuk referensi atau pembelian nanti di Illuminance.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
