import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Lampu Baru — Admin Illuminance",
  description: "Form pendaftaran produk lampu baru ke katalog Illuminance.",
};

export default function TambahProdukPage() {
  return <ProductForm />;
}
