"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-end pb-16 md:pb-24 overflow-hidden"
      aria-label="Hero Beranda"
    >
      {/* Background foto lifestyle — TODO: ganti dengan foto ruangan asli */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Overlay gradient — gelap di bawah, sedikit di atas */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, rgba(20,18,15,0.92) 0%, rgba(20,18,15,0.45) 45%, rgba(20,18,15,0.2) 100%)",
        }}
      />

      {/* il-glow di belakang area hero text */}
      <div
        className="il-glow"
        aria-hidden="true"
        style={{
          width: "800px",
          height: "600px",
          bottom: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Konten hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="max-w-[640px]">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-il-accent mb-6">
            Koleksi Terbaru
          </span>

          <h1 className="font-heading font-bold text-4xl md:text-6xl text-il-ink-on-dark leading-[1.08] tracking-[-0.02em] mb-6">
            Cahaya yang
            <br />
            menghidupkan
            <br />
            <span className="text-il-accent">ruangan Anda</span>
          </h1>

          <p className="font-body text-base md:text-lg text-il-ink-on-dark/70 leading-relaxed mb-8 max-w-[480px]">
            {/* TODO: Ganti dengan tagline / value proposition resmi brand Illuminance */}
            Temukan lampu yang bukan sekadar penerangan, tapi elemen desain yang mengubah suasana rumah Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/produk"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold hover:bg-il-accent-dark transition-colors duration-200"
            >
              Jelajahi Koleksi
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="#brand-story"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-il-ink-on-dark/30 text-il-ink-on-dark font-heading font-semibold hover:border-il-ink-on-dark/60 hover:bg-il-ink-on-dark/5 transition-colors duration-200"
            >
              Tentang Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
