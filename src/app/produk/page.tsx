import { Suspense } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { KatalogClient } from "@/components/product/KatalogClient";

export const metadata = {
  title: "Koleksi Lampu — Illuminance",
  description:
    "Jelajahi koleksi lampu premium Illuminance: Lampu Meja, Lampu Gantung, Lampu Lantai, Lampu Dinding, dan Lampu Baca.",
};

function FooterLight() {
  return (
    <footer className="bg-white border-t border-il-surface-2 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-body text-xs text-il-ink-on-light/40">
          &copy; {new Date().getFullYear()} Illuminance. Hak cipta dilindungi.
        </p>
        <div className="flex items-center gap-4">
          {["Transfer Bank", "QRIS", "E-wallet", "COD"].map((m) => (
            <span
              key={m}
              className="text-[10px] font-body text-il-ink-on-light/30 px-2 py-0.5 rounded border border-il-surface-2"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function ProdukPage() {
  return (
    <div className="bg-il-light-bg min-h-dvh flex flex-col">
      <Navbar variant="light" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-10 md:pb-14 flex-1 w-full">
        {/* Header halaman */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-il-ink-on-light tracking-[-0.02em]">
            Koleksi Lampu
          </h1>
          <p className="font-body text-il-ink-on-light/60 mt-2">
            Temukan lampu yang sempurna untuk setiap sudut rumah Anda.
          </p>
        </div>

        {/* KatalogClient butuh Suspense karena useSearchParams */}
        <Suspense
          fallback={
            <div className="h-64 flex items-center justify-center text-il-ink-on-light/40 font-body text-sm">
              Memuat produk...
            </div>
          }
        >
          <KatalogClient />
        </Suspense>
      </main>

      <FooterLight />
    </div>
  );
}
