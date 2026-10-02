import Link from "next/link";

export function FooterDark() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="kontak" className="bg-il-dark-surface border-t border-il-dark-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand blurb */}
          <div className="col-span-2 md:col-span-1">
            {/* TODO: Ganti dengan logo asli */}
            <Link href="/" className="font-heading font-semibold text-xl text-il-ink-on-dark tracking-tight hover:text-il-accent transition-colors">
              illuminance
            </Link>
            <p className="font-body text-sm text-il-ink-on-dark/50 mt-3 leading-relaxed max-w-[220px]">
              {/* TODO: Ganti dengan tagline/deskripsi singkat brand asli */}
              [PLACEHOLDER — Deskripsi singkat brand Illuminance]
            </p>
            {/* TODO: Tambahkan ikon sosial media yang relevan dengan akun asli */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                aria-label="Instagram Illuminance (TODO: ganti dengan URL asli)"
                className="w-8 h-8 rounded-full border border-il-dark-border flex items-center justify-center text-il-ink-on-dark/50 hover:text-il-accent hover:border-il-accent transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="10.5" cy="3.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="TikTok Illuminance (TODO: ganti dengan URL asli)"
                className="w-8 h-8 rounded-full border border-il-dark-border flex items-center justify-center text-il-ink-on-dark/50 hover:text-il-accent hover:border-il-accent transition-colors"
              >
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <path d="M8 1c0 2 1.5 3 3 3v2.5C9.5 6.5 8 5.5 8 5.5V9.5C8 12 6 14 4 14S0 12 0 9.5 2 5 4 5c.5 0 1 .1 1.5.3V8c-.5-.2-1-.3-1.5-.3C2.7 7.7 2 8.5 2 9.5S2.7 11.3 4 11.3 6 10.5 6 9.5V1h2z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom Belanja */}
          <div>
            <h3 className="font-body font-semibold text-sm text-il-ink-on-dark mb-4">Belanja</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/produk", label: "Semua Produk" },
                { href: "/produk?kategori=meja", label: "Lampu Meja" },
                { href: "/produk?kategori=gantung", label: "Lampu Gantung" },
                { href: "/produk?kategori=lantai", label: "Lampu Lantai" },
                { href: "/produk?kategori=dinding", label: "Lampu Dinding" },
                { href: "/produk?kategori=baca", label: "Lampu Baca" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-il-ink-on-dark/50 hover:text-il-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Bantuan */}
          <div>
            <h3 className="font-body font-semibold text-sm text-il-ink-on-dark mb-4">Bantuan</h3>
            <ul className="space-y-2.5">
              {[
                // TODO: Ganti href dengan halaman atau URL WhatsApp asli
                { href: "#", label: "FAQ" },
                { href: "#", label: "Kebijakan Pengiriman" },
                { href: "#", label: "Kebijakan Pengembalian" },
                { href: "#", label: "Cara Pembayaran" },
                { href: "#", label: "Panduan Pemasangan" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-il-ink-on-dark/50 hover:text-il-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div>
            <h3 className="font-body font-semibold text-sm text-il-ink-on-dark mb-4">Kontak</h3>
            <ul className="space-y-2.5">
              {/* TODO: Ganti semua data kontak di bawah dengan informasi nyata */}
              <li className="font-body text-sm text-il-ink-on-dark/50">
                <span className="block text-il-ink-on-dark/30 text-xs mb-0.5">Email</span>
                [TODO: email@illuminance.id]
              </li>
              <li className="font-body text-sm text-il-ink-on-dark/50">
                <span className="block text-il-ink-on-dark/30 text-xs mb-0.5">WhatsApp</span>
                [TODO: +62 xxx xxxx xxxx]
              </li>
              <li className="font-body text-sm text-il-ink-on-dark/50">
                <span className="block text-il-ink-on-dark/30 text-xs mb-0.5">Jam Layanan</span>
                [TODO: Senin-Sabtu, jam?]
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-il-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-il-ink-on-dark/30">
            {/* TODO: Perbarui nama legal perusahaan */}
            &copy; {currentYear} Illuminance. Hak cipta dilindungi.
          </p>

          {/* Metode pembayaran — ikon generik, tanpa logo gateway spesifik */}
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-il-ink-on-dark/30 mr-1">Pembayaran:</span>
            {["Transfer Bank", "QRIS", "E-wallet"].map((method) => (
              <span
                key={method}
                className="text-[10px] font-body text-il-ink-on-dark/40 px-2 py-0.5 rounded border border-il-dark-border"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
