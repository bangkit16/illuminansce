import { Suspense } from "react";
import Link from "next/link";
import { PendingPaymentClient } from "@/components/checkout/PendingPaymentClient";

export const metadata = {
  title: "Menunggu Pembayaran — Illuminance",
};

export default function PendingPaymentPage() {
  return (
    <div className="bg-il-light-bg min-h-dvh flex flex-col">
      {/* Header minimal */}
      <header className="bg-white border-b border-il-surface-2 h-16 flex items-center px-4 md:px-8">
        <Link
          href="/"
          className="font-heading font-semibold text-xl text-il-ink-on-light tracking-tight hover:text-il-accent transition-colors"
          aria-label="Illuminance — kembali ke beranda"
        >
          illuminance
        </Link>
        <div className="flex-1" />
        <nav aria-label="Langkah checkout" className="hidden sm:flex items-center gap-2 text-xs text-il-ink-on-light/40 font-body">
          <span>Checkout</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="text-il-accent font-medium">Pembayaran</span>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-il-accent border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <PendingPaymentClient />
        </Suspense>
      </main>

      {/* Footer minimal */}
      <footer className="bg-white border-t border-il-surface-2 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-il-ink-on-light/40">
            &copy; {new Date().getFullYear()} Illuminance. Hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
