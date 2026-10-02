import { EditProdukClient } from "@/components/admin/EditProdukClient";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Produk #${id} — Admin Illuminance`,
  };
}

export default async function EditProdukPage({ params }: Props) {
  const { id } = await params;
  return <EditProdukClient id={id} />;
}
