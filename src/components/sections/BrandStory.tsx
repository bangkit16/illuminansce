export function BrandStory() {
  return (
    <section id="brand-story" className="bg-il-dark-bg py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Foto editorial */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
              {/* TODO: Ganti dengan foto editorial brand asli */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80"
                alt="Filosofi desain Illuminance — cahaya yang menghidupkan ruang"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* il-glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse at 40% 60%, rgba(227,163,77,0.15) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Accent detail */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border border-il-dark-border bg-il-dark-surface hidden md:flex items-center justify-center">
              <span className="font-heading font-bold text-il-accent text-2xl leading-none">il</span>
            </div>
          </div>

          {/* Teks naratif */}
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-il-accent mb-6">
              Tentang Illuminance
            </span>

            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-il-ink-on-dark tracking-[-0.02em] leading-[1.15] mb-6">
              {/* TODO: Ganti dengan headline brand story asli */}
              Kami percaya cahaya adalah bahasa desain yang paling universal
            </h2>

            <div className="font-body text-base text-il-ink-on-dark/70 leading-relaxed space-y-4">
              {/* TODO: Ganti seluruh teks di bawah dengan cerita/filosofi brand Illuminance yang sebenarnya */}
              <p>
                <em>[PLACEHOLDER — isi dengan cerita brand asli]</em> Illuminance lahir dari keyakinan sederhana: setiap ruangan memiliki potensi untuk menjadi lebih hidup, dan cahaya adalah kuncinya.
              </p>
              <p>
                <em>[PLACEHOLDER]</em> Kami mengkurasi lampu-lampu dari pengrajin dan desainer yang memahami bahwa sebuah lampu bukan sekadar sumber penerangan, melainkan titik fokus yang membentuk atmosfer dan cerita sebuah ruangan.
              </p>
              <p>
                <em>[PLACEHOLDER]</em> Setiap produk dipilih dengan standar kualitas material, ketahanan, dan estetika yang tidak berkompromi.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              {[
                // TODO: Ganti dengan angka/pencapaian nyata brand
                { value: "?+", label: "Produk Terkurasi" },
                { value: "?+", label: "Pelanggan Puas" },
                { value: "?+", label: "Kota Pengiriman" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading font-bold text-2xl text-il-accent">{stat.value}</div>
                  <div className="font-body text-xs text-il-ink-on-dark/50 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
