import Link from "next/link";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = {
  title: "Checkout — Illuminance",
};

export default function CheckoutPage() {
  return (
    // Light theme, minimal chrome — tanpa Navbar/Footer marketing lengkap
    <div className="bg-il-light-bg min-h-dvh flex flex-col">
      {/* Header minimal — hanya logo */}
      <header className="bg-white border-b border-il-surface-2 h-16 flex items-center px-4 md:px-8">
        {/* TODO: Ganti dengan logo asli */}
        <Link
          href="/"
          className="font-heading font-semibold text-xl text-il-ink-on-light tracking-tight hover:text-il-accent transition-colors"
          aria-label="Illuminance — kembali ke beranda"
        >
          illuminance
        </Link>
        <div className="flex-1" />
        {/* Breadcrumb checkout */}
        <nav aria-label="Langkah checkout" className="hidden sm:flex items-center gap-2 text-xs text-il-ink-on-light/40 font-body">
          <span>Keranjang</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="text-il-accent font-medium">Checkout</span>
        </nav>
      </header>

      {/* Konten form checkout */}
      <main className="flex-1">
        <CheckoutClient />
      </main>

      {/* Footer minimal checkout */}
      <footer className="bg-white border-t border-il-surface-2 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-il-ink-on-light/40">
            &copy; {new Date().getFullYear()} Illuminance. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-3">
            {/* TODO: Tambahkan link ke halaman Kebijakan Privasi dan Syarat Ketentuan yang asli */}
            <a href="#" className="font-body text-xs text-il-ink-on-light/40 hover:text-il-accent transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="font-body text-xs text-il-ink-on-light/40 hover:text-il-accent transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
