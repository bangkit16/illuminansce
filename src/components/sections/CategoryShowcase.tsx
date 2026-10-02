import Link from "next/link";

const categories = [
  {
    slug: "meja",
    label: "Lampu Meja",
    description: "Aksen & fungsional",
    // TODO: Ganti dengan foto kategori asli
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  },
  {
    slug: "gantung",
    label: "Lampu Gantung",
    description: "Titik fokus ruangan",
    image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&q=80",
  },
  {
    slug: "lantai",
    label: "Lampu Lantai",
    description: "Kehangatan di sudut",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  },
  {
    slug: "dinding",
    label: "Lampu Dinding",
    description: "Sentuhan arsitektur",
    image: "https://images.unsplash.com/photo-1573755069541-4b0a9e4e4b38?w=800&q=80",
  },
];

export function CategoryShowcase() {
  return (
    <section className="bg-il-dark-bg py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-14">
          <h2 className="font-heading font-semibold text-3xl md:text-5xl text-il-ink-on-dark tracking-[-0.02em]">
            Temukan koleksi
            <br />
            yang tepat untuk Anda
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/produk?kategori=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-il-accent"
              aria-label={`Lihat koleksi ${cat.label}`}
            >
              {/* Foto */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(to top, rgba(20,18,15,0.85) 0%, rgba(20,18,15,0.2) 60%, transparent 100%)",
                }}
              />

              {/* il-glow saat hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 80%, rgba(227,163,77,0.15) 0%, transparent 65%)",
                }}
              />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-body text-xs text-il-ink-on-dark/60 mb-0.5">
                  {cat.description}
                </p>
                <h3 className="font-heading font-semibold text-base text-il-ink-on-dark group-hover:text-il-accent transition-colors duration-200">
                  {cat.label}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs text-il-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                  Lihat koleksi
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
