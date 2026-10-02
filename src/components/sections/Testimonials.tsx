/**
 * Testimonials — PLACEHOLDER EKSPLISIT
 *
 * TODO: Semua data testimoni di komponen ini WAJIB diganti dengan ulasan
 * pelanggan NYATA yang telah memberikan izin ditampilkan.
 * JANGAN publish ke produksi dengan data dummy ini karena dapat
 * menyesatkan calon pembeli.
 */

// TODO: Ganti array testimonials dengan data asli dari pelanggan nyata
const TESTIMONIALS_PLACEHOLDER = [
  {
    id: "1",
    // TODO: Isi nama pelanggan nyata (dengan izin)
    name: "[Nama Pelanggan]",
    // TODO: Isi kota/profil pelanggan
    label: "[Kota, Profil]",
    // TODO: Isi kutipan ulasan nyata
    quote:
      "[PLACEHOLDER — Ganti dengan ulasan pelanggan nyata yang telah memberikan izin untuk ditampilkan. Jangan gunakan data ini di produksi.]",
    // TODO: Ganti dengan foto asli (dengan izin) atau hapus foto
    avatarUrl: null,
  },
  {
    id: "2",
    name: "[Nama Pelanggan]",
    label: "[Kota, Profil]",
    quote:
      "[PLACEHOLDER — Ganti dengan ulasan pelanggan nyata yang telah memberikan izin untuk ditampilkan.]",
    avatarUrl: null,
  },
  {
    id: "3",
    name: "[Nama Pelanggan]",
    label: "[Kota, Profil]",
    quote:
      "[PLACEHOLDER — Ganti dengan ulasan pelanggan nyata yang telah memberikan izin untuk ditampilkan.]",
    avatarUrl: null,
  },
] as const;

export function Testimonials() {
  return (
    <section className="bg-il-dark-surface py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading font-semibold text-3xl md:text-5xl text-il-ink-on-dark tracking-[-0.02em]">
            Apa kata pelanggan
          </h2>
          <p className="font-body text-il-ink-on-dark/50 mt-3 text-sm">
            {/* Catatan pengembang */}
            <span className="inline-block bg-il-danger/20 text-il-danger text-xs px-2 py-0.5 rounded mr-2 font-mono">TODO</span>
            Ganti dengan testimoni pelanggan nyata sebelum publish ke produksi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS_PLACEHOLDER.map((t) => (
            <div
              key={t.id}
              className="bg-il-dark-bg rounded-xl border border-il-dark-border p-6 flex flex-col gap-4"
            >
              {/* Quote marks */}
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
                <path
                  d="M0 22V13.2C0 9.2 1.6 5.8 4.8 3C8 0.2 11.6 -0.4 14 0.2L13 3.6C11.4 3.2 9.4 3.6 7.4 5.2C5.4 6.8 4.4 8.8 4.4 11.2H8V22H0ZM14 22V13.2C14 9.2 15.6 5.8 18.8 3C22 0.2 25.6 -0.4 28 0.2L27 3.6C25.4 3.2 23.4 3.6 21.4 5.2C19.4 6.8 18.4 8.8 18.4 11.2H22V22H14Z"
                  fill="rgba(227,163,77,0.3)"
                />
              </svg>

              <p className="font-body text-il-ink-on-dark/60 text-sm leading-relaxed italic">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-il-dark-border">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-il-dark-border flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="5" r="3" stroke="rgba(246,241,231,0.4)" strokeWidth="1.2"/>
                    <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="rgba(246,241,231,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-body font-medium text-sm text-il-ink-on-dark">{t.name}</div>
                  <div className="font-body text-xs text-il-ink-on-dark/40">{t.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
