/**
 * ILLUMINANCE — Data Produk
 * Foto produk lokal dari public/product_image (imageOff & imageOn)
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
  imageOff: string;  // foto produk mati
  imageOn: string;   // foto produk menyala
  galleryImages?: string[]; // foto galeri tambahan
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

export const products: Product[] = [
  {
    id: "1",
    slug: "lampu-meja-kuningan-arc",
    name: "Lampu Meja Kuningan Arc",
    category: "meja",
    material: "kuningan",
    lightColor: "warm-white",
    price: 1_250_000,
    priceFormatted: "Rp 1.250.000",
    imageOff: "/product_image/1 off.jpg",
    imageOn:  "/product_image/1 on.jpg",
    galleryImages: ["/product_image/1 on.jpg"],
    shortDescription: "Lampu meja elegan dengan rangka kuningan melengkung dan kap terarah. Sempurna untuk meja kerja atau nakas.",
    description: "Dibuat dari material kuningan solid berkualitas tinggi dengan sentuhan akhir brushed matte. Desain kurva lengkung (arc) yang anggun dipadukan dengan kap kerucut berengsel fleksibel, memungkinkan pengaturan sudut pencahayaan dengan presisi.",
    specs: {
      tinggi: "45 cm",
      diameter: "18 cm",
      daya: "Max 40W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kuningan solid, kabel tekstil hitam",
      kabelPanjang: "1.8 m",
    },
    variants: {
      finish: ["Kuningan Brushed", "Kuningan Poles"],
      tipBohlam: ["Edison E14", "LED Warm E14"],
    },
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "lampu-gantung-kaca-globe",
    name: "Lampu Gantung Kaca Globe",
    category: "gantung",
    material: "kaca",
    lightColor: "warm-white",
    price: 875_000,
    priceFormatted: "Rp 875.000",
    imageOff: "/product_image/2 off.jpg",
    imageOn:  "/product_image/2 on.jpg",
    galleryImages: ["/product_image/2 on.jpg"],
    shortDescription: "Bola kaca transparan dengan fitting kuningan klasik. Memancarkan cahaya hangat 360 derajat ke seluruh ruangan.",
    description: "Lampu gantung kaca tiup berbentuk bola bening dengan dudukan soket kuningan bertekstur knurled. Memamerkan keindahan filamen bohlam secara utuh dan menghadirkan ambience hangat yang mewah untuk ruang makan atau ruang keluarga.",
    specs: {
      diameter: "25 cm",
      daya: "Max 60W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kaca bening transparan, soket kuningan",
      kabelPanjang: "1.5 m (dapat disesuaikan)",
    },
    variants: {
      ukuran: ["Kecil (Ø20cm)", "Standar (Ø25cm)", "Besar (Ø30cm)"],
    },
    isFeatured: true,
  },
  {
    id: "3",
    slug: "lampu-lantai-kayu-minimal",
    name: "Lampu Lantai Kayu Tripod",
    category: "lantai",
    material: "kayu",
    lightColor: "warm-white",
    price: 2_100_000,
    priceFormatted: "Rp 2.100.000",
    imageOff: "/product_image/3 off.jpg",
    imageOn:  "/product_image/3 on.jpg",
    galleryImages: ["/product_image/3 on.jpg"],
    shortDescription: "Struktur tripod kayu solid dengan kap silinder linen natural. Menghadirkan ketenangan Skandinavia di sudut ruangan.",
    description: "Dirancang dengan konstruksi tripod berkaki kayu jati pilihan yang kokoh serta aksen fitting kuningan. Kap lampu berbahan kain linen bertekstur menyaring cahaya menjadi pendar lembut yang menenangkan.",
    specs: {
      tinggi: "155 cm",
      diameter: "38 cm",
      daya: "Max 60W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kayu solid natural, kap linen",
      kabelPanjang: "2.2 m (dengan saklar kaki)",
    },
    variants: {
      finish: ["Kayu Natural Oak", "Kayu Dark Walnut"],
      ukuran: ["Standar (155cm)"],
    },
    isFeatured: true,
  },
  {
    id: "4",
    slug: "lampu-dinding-hitam-matte-arm",
    name: "Lampu Dinding Hitam Matte Arm",
    category: "dinding",
    material: "hitam-matte",
    lightColor: "warm-white",
    price: 680_000,
    priceFormatted: "Rp 680.000",
    imageOff: "/product_image/4 off.jpg",
    imageOn:  "/product_image/4 on.jpg",
    galleryImages: ["/product_image/4 on.jpg"],
    shortDescription: "Lampu dinding berartikulasi ganda dengan lapisan hitam matte. Arah pencahayaan fleksibel untuk membaca dan aksen.",
    description: "Lampu dinding berkarakter arsitektural dengan dua sambungan engsel putar. Dibuat dari baja berkualitas dengan pelapis powder coat hitam matte halus, sangat ideal untuk area samping tempat tidur atau ruang kerja modern.",
    specs: {
      tinggi: "45 cm",
      diameter: "15 cm (kap)",
      daya: "Max 25W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Baja powder coat hitam matte",
      kabelPanjang: "1.8 m (dengan saklar)",
    },
    variants: {
      finish: ["Hitam Matte"],
      ukuran: ["Arm Standar (60cm)"],
    },
    isLowStock: true,
  },
  {
    id: "5",
    slug: "lampu-baca-kuningan-flex",
    name: "Lampu Baca Kuningan Arc",
    category: "baca",
    material: "kuningan",
    lightColor: "warm-white",
    price: 945_000,
    priceFormatted: "Rp 945.000",
    imageOff: "/product_image/5 off.jpg",
    imageOn:  "/product_image/5 on.jpg",
    galleryImages: ["/product_image/5 on.jpg"],
    shortDescription: "Lampu baca meja bergaya lengkung kuningan dengan kap terarah. Nyaman untuk membaca intensif dan belajar.",
    description: "Kombinasi estetika kurva ramping dan ketahanan kuningan asli. Dirancang khusus untuk memberikan fokus pencahayaan ke permukaan meja tanpa membuat mata lelah.",
    specs: {
      tinggi: "45 cm",
      diameter: "18 cm (alas)",
      daya: "Max 40W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kuningan solid, kabel tekstil hitam",
      kabelPanjang: "1.8 m",
    },
    variants: {
      finish: ["Kuningan Brushed", "Kuningan Antik"],
    },
    isFeatured: true,
  },
  {
    id: "6",
    slug: "lampu-gantung-rattan-cluster",
    name: "Lampu Gantung Rattan Cluster",
    category: "gantung",
    material: "kayu",
    lightColor: "warm-white",
    price: 1_450_000,
    priceFormatted: "Rp 1.450.000",
    imageOff: "/product_image/6 off.jpg",
    imageOn:  "/product_image/6 on.jpg",
    galleryImages: ["/product_image/6 on.jpg"],
    shortDescription: "Gugusan 3 kap lampu gantung anyaman rotan artisanal. Menghadirkan tekstur alami dan nuansa tropis.",
    description: "Dianyam tangan oleh pengrajin lokal dengan bahan rotan alami pilihan. Formasi gugus 3 tingkat menghasilkan pola bayangan artistik dan pencahayaan hangat berkarakter di atas meja makan atau void rumah.",
    specs: {
      diameter: "45 cm (cluster keseluruhan)",
      daya: "Max 3×40W",
      fitting: "3× E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Rotan alami, kanopi besi hitam",
      kabelPanjang: "1.5 m per drop",
    },
    variants: {
      ukuran: ["Cluster 3 Kap", "Cluster 5 Kap"],
    },
    isNew: true,
  },
  {
    id: "7",
    slug: "lampu-meja-kaca-frosted",
    name: "Lampu Meja Kaca Silinder",
    category: "meja",
    material: "kaca",
    lightColor: "warm-white",
    price: 760_000,
    priceFormatted: "Rp 760.000",
    imageOff: "/product_image/7 off.jpg",
    imageOn:  "/product_image/7 on.jpg",
    galleryImages: ["/product_image/7 on.jpg"],
    shortDescription: "Silinder kaca tekstur dengan dudukan kuningan mewah. Menampilkan kilau filamen bohlam yang teduh dan elegan.",
    description: "Mengusung konsep tabung kaca bertekstur difus yang dipadukan dengan alas kuningan solid presisi. Memberikan nuansa intim dan estetika kontemporer pada meja konsol, credenza, atau rak buku.",
    specs: {
      tinggi: "30 cm",
      diameter: "12 cm",
      daya: "Max 40W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kaca tekstur silinder, alas kuningan",
      kabelPanjang: "1.5 m",
    },
    variants: {
      finish: ["Kaca Tekstur Silinder"],
    },
  },
  {
    id: "8",
    slug: "lampu-dinding-kuningan-sconce",
    name: "Lampu Dinding Kuningan Sconce",
    category: "dinding",
    material: "kuningan",
    lightColor: "warm-white",
    price: 890_000,
    priceFormatted: "Rp 890.000",
    imageOff: "/product_image/8 off.jpg",
    imageOn:  "/product_image/8 on.jpg",
    galleryImages: ["/product_image/8 on.jpg"],
    shortDescription: "Sconce dinding vertikal berbalut kuningan poles dan silinder kaca bening. Aksen mewah untuk koridor dan kamar.",
    description: "Plat dinding persegi kuningan brushed dipadu lengan vertikal penopang silinder kaca bening. Desain timeless yang memancarkan kemewahan bersahaja untuk dinding koridor, tangga, maupun pilar ruangan.",
    specs: {
      tinggi: "38 cm",
      diameter: "12 cm (lebar plat)",
      daya: "Max 40W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Kuningan brushed, kaca bening silinder",
    },
    variants: {
      finish: ["Kuningan Natural", "Kuningan Antik"],
    },
    isFeatured: true,
  },
  {
    id: "9",
    slug: "lampu-lantai-hitam-tripod",
    name: "Lampu Lantai Hitam Tripod",
    category: "lantai",
    material: "hitam-matte",
    lightColor: "warm-white",
    price: 1_780_000,
    priceFormatted: "Rp 1.780.000",
    imageOff: "/product_image/9 off.jpg",
    imageOn:  "/product_image/9 on.jpg",
    galleryImages: ["/product_image/9 on.jpg"],
    shortDescription: "Tripod besi hitam dengan kap silinder hitam modern. Gaya industrial-minimalis yang tegas dan berani.",
    description: "Konstruksi kaki tripod baja ramping dengan finishing hitam matte anti gores. Dipadukan dengan kap silinder hitam yang menghasilkan pencahayaan beraksen dramatis ke arah langit-langit dan lantai.",
    specs: {
      tinggi: "155 cm",
      diameter: "35 cm (kap)",
      daya: "Max 60W",
      fitting: "E27",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Baja hitam matte, kap kain hitam",
      kabelPanjang: "2 m (dengan saklar injak)",
    },
    variants: {
      finish: ["Hitam Matte"],
      ukuran: ["Standar (155cm)"],
    },
  },
  {
    id: "10",
    slug: "lampu-baca-hitam-matte-clamp",
    name: "Lampu Baca Hitam Clamp",
    category: "baca",
    material: "hitam-matte",
    lightColor: "cool-white",
    price: 425_000,
    priceFormatted: "Rp 425.000",
    imageOff: "/product_image/10 off.jpg",
    imageOn:  "/product_image/10 on.jpg",
    galleryImages: ["/product_image/10 on.jpg"],
    shortDescription: "Lampu kerja berpenjepit meja dengan artikulasi presisi. Solusi hemat ruang untuk meja kerja dan workstation.",
    description: "Dilengkapi mekanisme clamp baja yang dapat dikunci kuat pada bibir meja kerja maupun rak. Engsel artikulasi multi-sudut memberikan fleksibilitas penuh untuk menyorot area dokumen atau layar kerja.",
    specs: {
      tinggi: "60 cm (maksimum)",
      daya: "Max 20W",
      fitting: "E14",
      sumberCahaya: "Tidak termasuk bohlam",
      material: "Baja powder coat hitam matte",
      kabelPanjang: "1.8 m",
    },
    variants: {
      finish: ["Hitam Matte"],
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
