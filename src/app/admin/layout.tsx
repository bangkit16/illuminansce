import type { Metadata } from "next";
import { ReactNode } from "react";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Dashboard — Illuminance",
  description:
    "Panel kendali operasional, manajemen produk etalase, dan monitoring pesanan toko Illuminance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
