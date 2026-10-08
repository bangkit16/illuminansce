/**
 * ILLUMINANCE — Data Produk Placeholder
 *
 * TODO: Ganti seluruh data di file ini dengan produk asli dari database/CMS.
 * TODO: Ganti semua URL gambar dengan foto produk asli (2 foto per produk):
 *   - imageOff : foto produk dalam kondisi MATI / lampu padam
 *   - imageOn  : foto produk dalam kondisi MENYALA / lampu hidup
 *   Pastikan kedua foto punya framing & rasio yang sama agar crossfade mulus.
 *
 * Catatan: nama produk diberi label "(Contoh)" agar mudah diidentifikasi sebagai dummy.
 */

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "meja" | "gantung" | "lantai" | "dinding" | "baca";
  material: "kuningan" | "hitam-matte" | "kayu" | "kaca";
  lightColor: "warm-white" | "cool-white" | "dimmable";
  price: number; // dalam Rupiah
  priceFormatted: string;
  imageOff: string;  // foto produk mati — TODO: ganti dengan foto asli
  imageOn: string;   // foto produk menyala — TODO: ganti dengan foto asli
  galleryImages?: string[]; // foto galeri tambahan (detail sudut, tekstur, ruangan)
  shortDescription: string;
  description: string;
  specs: {
    tinggi?: string;
    diameter?: string;
    daya?: string;
    fitting?: string;
    sumberCahaya?: string;
    material?: string;
    kabelPanjang?: string;
  };
  variants: {
    finish?: string[];
    ukuran?: string[];
    tipBohlam?: string[];
  };
  isNew?: boolean;
  isLowStock?: boolean;
  isFeatured?: boolean;
};

// TODO: Semua URL picsum di bawah adalah placeholder.
// Ganti dengan CDN/storage URL foto produk asli setelah pemotretan selesai.
export const products: Product[] = [
  {
    id: "1",
    slug: "lampu-meja-kuningan-arc",
    name: "Lampu Meja Kuningan Arc (Contoh)",
    category: "meja",
    material: "kuningan",
    lightColor: "warm-white",
    price: 1_250_000,
    priceFormatted: "Rp 1.250.000",
    imageOff: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80",
    shortDescription: "Lampu meja elegan dengan rangka kuningan dan kepala lentur. Cocok untuk meja kerja atau nakas.",
    description: "TODO: Isi deskripsi produk asli di sini. Ceritakan keunggulan material, proses pembuatan, atau filosofi desain.",
    specs: {
      tinggi: "45 cm",
      diameter: "18 cm",
      daya: "Max 40W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kuningan, kabel tekstil",
      kabelPanjang: "1.8 m",
    },
    variants: {
      finish: ["Kuningan Matte", "Kuningan Poles"],
      tipBohlam: ["Edison E14", "LED E14"],
    },
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "lampu-gantung-kaca-globe",
    name: "Lampu Gantung Kaca Globe (Contoh)",
    category: "gantung",
    material: "kaca",
    lightColor: "dimmable",
    price: 875_000,
    priceFormatted: "Rp 875.000",
    imageOff: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    shortDescription: "Bola kaca bening dengan filamen dekoratif. Memancarkan cahaya hangat ke seluruh ruangan.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      diameter: "25 cm",
      daya: "Max 60W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kaca bening, tali tambang",
      kabelPanjang: "1.5 m (dapat diperpanjang)",
    },
    variants: {
      ukuran: ["Kecil (Ø20cm)", "Standar (Ø25cm)", "Besar (Ø30cm)"],
    },
    isFeatured: true,
  },
  {
    id: "3",
    slug: "lampu-lantai-kayu-minimal",
    name: "Lampu Lantai Kayu Minimal (Contoh)",
    category: "lantai",
    material: "kayu",
    lightColor: "warm-white",
    price: 2_100_000,
    priceFormatted: "Rp 2.100.000",
    imageOff: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    shortDescription: "Kaki kayu jati dengan abajur linen natural. Menghadirkan kehangatan Skandinavia di sudut ruangan.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      tinggi: "160 cm",
      diameter: "35 cm",
      daya: "Max 60W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kayu jati, abajur linen",
      kabelPanjang: "2 m",
    },
    variants: {
      finish: ["Kayu Natural", "Kayu Eboni"],
      ukuran: ["Standar", "Slim"],
    },
    isFeatured: true,
  },
  {
    id: "4",
    slug: "lampu-dinding-hitam-matte-arm",
    name: "Lampu Dinding Hitam Matte Arm (Contoh)",
    category: "dinding",
    material: "hitam-matte",
    lightColor: "cool-white",
    price: 680_000,
    priceFormatted: "Rp 680.000",
    imageOff: "https://images.unsplash.com/photo-1573755069541-4b0a9e4e4b38?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1565537222133-f82ff0aaee77?w=600&q=80",
    shortDescription: "Arm lamp hitam matte modern untuk dinding. Sudut dapat diputar 180°.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      daya: "Max 20W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Besi powder coat hitam",
    },
    variants: {
      finish: ["Hitam Matte"],
      ukuran: ["Arm Pendek (25cm)", "Arm Panjang (40cm)"],
    },
    isLowStock: true,
  },
  {
    id: "5",
    slug: "lampu-baca-kuningan-flex",
    name: "Lampu Baca Kuningan Flex (Contoh)",
    category: "baca",
    material: "kuningan",
    lightColor: "dimmable",
    price: 945_000,
    priceFormatted: "Rp 945.000",
    imageOff: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80",
    shortDescription: "Leher fleksibel kuningan 360°. Intensitas cahaya dapat diatur via dimmer terintegrasi.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      tinggi: "40 cm",
      daya: "5W LED termasuk",
      fitting: "Integrated LED",
      sumberCahaya: "LED termasuk",
      material: "Kuningan, alas besi",
    },
    variants: {
      finish: ["Kuningan Antik", "Kuningan Matte"],
    },
    isFeatured: true,
  },
  {
    id: "6",
    slug: "lampu-gantung-rattan-cluster",
    name: "Lampu Gantung Rattan Cluster (Contoh)",
    category: "gantung",
    material: "kayu",
    lightColor: "warm-white",
    price: 1_450_000,
    priceFormatted: "Rp 1.450.000",
    imageOff: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=600&q=80",
    shortDescription: "Cluster 3 bohlam dengan roset rattan anyaman tangan. Nuansa tropis dan artistik.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      diameter: "40 cm (cluster)",
      daya: "Max 3×40W",
      fitting: "3× E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Rattan, kabel tekstil",
      kabelPanjang: "1.5 m per drop",
    },
    variants: {
      ukuran: ["Cluster 3", "Cluster 5"],
    },
    isNew: true,
  },
  {
    id: "7",
    slug: "lampu-meja-kaca-frosted",
    name: "Lampu Meja Kaca Frosted (Contoh)",
    category: "meja",
    material: "kaca",
    lightColor: "warm-white",
    price: 760_000,
    priceFormatted: "Rp 760.000",
    imageOff: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1560448075-bb485b067938?w=600&q=80",
    shortDescription: "Badan kaca frosted memancarkan cahaya difus lembut. Minimalis dan elegan.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      tinggi: "38 cm",
      diameter: "20 cm",
      daya: "Max 40W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kaca frosted, alas marmer",
    },
    variants: {
      finish: ["Kaca Bening", "Kaca Frosted"],
    },
  },
  {
    id: "8",
    slug: "lampu-dinding-kuningan-sconce",
    name: "Lampu Dinding Kuningan Sconce (Contoh)",
    category: "dinding",
    material: "kuningan",
    lightColor: "warm-white",
    price: 890_000,
    priceFormatted: "Rp 890.000",
    imageOff: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    shortDescription: "Wall sconce kuningan klasik modern. Cocok untuk lorong, kamar tidur, atau ruang tamu.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      daya: "Max 40W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kuningan poles",
    },
    variants: {
      finish: ["Kuningan Natural", "Kuningan Antik"],
    },
    isFeatured: true,
  },
  {
    id: "9",
    slug: "lampu-lantai-hitam-tripod",
    name: "Lampu Lantai Hitam Tripod (Contoh)",
    category: "lantai",
    material: "hitam-matte",
    lightColor: "cool-white",
    price: 1_780_000,
    priceFormatted: "Rp 1.780.000",
    imageOff: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    shortDescription: "Tripod besi hitam dengan abajur silindris. Gaya industrial-modern yang tegas.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      tinggi: "155 cm",
      diameter: "30 cm",
      daya: "Max 60W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Besi hitam matte, abajur kain",
    },
    variants: {
      finish: ["Hitam Matte"],
      ukuran: ["Standar", "Tinggi (175cm)"],
    },
  },
  {
    id: "10",
    slug: "lampu-baca-hitam-matte-clamp",
    name: "Lampu Baca Hitam Clamp (Contoh)",
    category: "baca",
    material: "hitam-matte",
    lightColor: "cool-white",
    price: 425_000,
    priceFormatted: "Rp 425.000",
    imageOff: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    imageOn:  "https://images.unsplash.com/photo-1470506926202-05d3fca84c9a?w=600&q=80",
    shortDescription: "Lampu baca dengan klem praktis. Hemat ruang, ideal untuk meja kecil atau headboard.",
    description: "TODO: Isi deskripsi produk asli di sini.",
    specs: {
      tinggi: "30 cm",
      daya: "Max 15W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Besi hitam matte",
    },
    variants: {
      finish: ["Hitam Matte", "Putih"],
    },
    isNew: true,
    isLowStock: true,
  },
];

export const categories = [
  { value: "meja",   label: "Lampu Meja" },
  { value: "gantung",label: "Lampu Gantung" },
  { value: "lantai", label: "Lampu Lantai" },
  { value: "dinding",label: "Lampu Dinding" },
  { value: "baca",   label: "Lampu Baca" },
] as const;

export function getCategoryLabel(category: string): string {
  const found = categories.find((c) => c.value === category);
  return found ? found.label : category;
}

export const materials = [
  { value: "kuningan",    label: "Kuningan" },
  { value: "hitam-matte", label: "Hitam Matte" },
  { value: "kayu",        label: "Kayu" },
  { value: "kaca",        label: "Kaca" },
] as const;

export const lightColors = [
  { value: "warm-white", label: "Warm White" },
  { value: "cool-white", label: "Cool White" },
  { value: "dimmable",   label: "Dimmable" },
] as const;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getRelatedProducts(current: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, limit);
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 3_000_000;
