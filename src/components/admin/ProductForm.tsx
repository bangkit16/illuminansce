"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, categories, materials, lightColors } from "@/lib/products-placeholder";
import { saveStoredProduct, deleteStoredProduct, formatRupiah } from "@/lib/products-storage";
import { useToast } from "@/context/ToastContext";

interface ProductFormProps {
  initialProduct?: Product;
  isEdit?: boolean;
}

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File harus berupa gambar (JPG, PNG, WebP)"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Gagal membaca berkas gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file dari disk"));
    reader.readAsDataURL(file);
  });
}

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [id] = useState(initialProduct?.id || "");
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [isSlugCustom, setIsSlugCustom] = useState(Boolean(initialProduct?.slug));
  const [category, setCategory] = useState<Product["category"]>(
    initialProduct?.category || "meja"
  );
  const [material, setMaterial] = useState<Product["material"]>(
    initialProduct?.material || "kuningan"
  );
  const [lightColor, setLightColor] = useState<Product["lightColor"]>(
    initialProduct?.lightColor || "warm-white"
  );
  const [price, setPrice] = useState<number>(initialProduct?.price || 1250000);
  const [imageOff, setImageOff] = useState(
    initialProduct?.imageOff || "/product_image/1 off.jpg"
  );
  const [imageOn, setImageOn] = useState(
    initialProduct?.imageOn || "/product_image/1 on.jpg"
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialProduct?.galleryImages || []
  );
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [galleryUploadMode, setGalleryUploadMode] = useState<"file" | "url">("file");
  const [isProcessingGallery, setIsProcessingGallery] = useState(false);
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ""
  );
  const [description, setDescription] = useState(initialProduct?.description || "");

  // Specs
  const [tinggi, setTinggi] = useState(initialProduct?.specs?.tinggi || "");
  const [diameter, setDiameter] = useState(initialProduct?.specs?.diameter || "");
  const [daya, setDaya] = useState(initialProduct?.specs?.daya || "Max 40W");
  const [fitting, setFitting] = useState(initialProduct?.specs?.fitting || "E27");
  const [sumberCahaya, setSumberCahaya] = useState(
    initialProduct?.specs?.sumberCahaya || "Tidak termasuk bohlam"
  );
  const [specsMaterial, setSpecsMaterial] = useState(
    initialProduct?.specs?.material || ""
  );
  const [kabelPanjang, setKabelPanjang] = useState(
    initialProduct?.specs?.kabelPanjang || "1.8 m"
  );

  // Variants (comma separated string)
  const [finishVariant, setFinishVariant] = useState(
    initialProduct?.variants?.finish?.join(", ") || ""
  );
  const [ukuranVariant, setUkuranVariant] = useState(
    initialProduct?.variants?.ukuran?.join(", ") || ""
  );
  const [tipBohlamVariant, setTipBohlamVariant] = useState(
    initialProduct?.variants?.tipBohlam?.join(", ") || ""
  );

  // Flags
  const [isNew, setIsNew] = useState(initialProduct?.isNew ?? true);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [isLowStock, setIsLowStock] = useState(initialProduct?.isLowStock ?? false);

  // Preview state: off / on toggle
  const [previewLit, setPreviewLit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Upload modes & processing states
  const [uploadModeOff, setUploadModeOff] = useState<"file" | "url">("file");
  const [uploadModeOn, setUploadModeOn] = useState<"file" | "url">("file");
  const [isProcessingOff, setIsProcessingOff] = useState(false);
  const [isProcessingOn, setIsProcessingOn] = useState(false);

  const handleFileUpload = async (file: File, target: "off" | "on") => {
    try {
      if (target === "off") setIsProcessingOff(true);
      else setIsProcessingOn(true);

      const compressed = await compressImageFile(file);
      if (target === "off") {
        setImageOff(compressed);
      } else {
        setImageOn(compressed);
      }
      showToast({
        title: "Foto Berhasil Dimuat",
        description: `Foto kondisi ${target === "off" ? "lampu padam (OFF)" : "lampu menyala (ON)"} siap disimpan.`,
        type: "success",
      });
    } catch (err: unknown) {
      showToast({
        title: "Gagal Mengunggah",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat memproses gambar.",
        type: "warning",
      });
    } finally {
      if (target === "off") setIsProcessingOff(false);
      else setIsProcessingOn(false);
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingGallery(true);
    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const comp = await compressImageFile(file);
          compressedList.push(comp);
        }
      }
      setGalleryImages((prev) => [...prev, ...compressedList]);
      showToast({
        title: "Foto Galeri Ditambahkan",
        description: `${compressedList.length} foto tambahan berhasil dimuat.`,
        type: "success",
      });
    } catch (err: unknown) {
      showToast({
        title: "Gagal Mengunggah",
        description: err instanceof Error ? err.message : "Gagal memproses berkas galeri.",
        type: "warning",
      });
    } finally {
      setIsProcessingGallery(false);
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setGalleryImages((prev) => [...prev, galleryUrlInput.trim()]);
    setGalleryUrlInput("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-generate slug from name if not manually modified
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugCustom) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast({
        title: "Validasi Gagal",
        description: "Nama produk wajib diisi.",
        type: "warning",
      });
      return;
    }

    if (!slug.trim()) {
      showToast({
        title: "Validasi Gagal",
        description: "Slug URL wajib diisi.",
        type: "warning",
      });
      return;
    }

    if (price <= 0) {
      showToast({
        title: "Validasi Gagal",
        description: "Harga produk harus lebih besar dari 0.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    const parseComma = (str: string) =>
      str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const productId = id || `prod_${Date.now()}`;

    const productPayload: Product = {
      id: productId,
      slug: slug.trim(),
      name: name.trim(),
      category,
      material,
      lightColor,
      price: Number(price),
      priceFormatted: formatRupiah(Number(price)),
      imageOff: imageOff.trim(),
      imageOn: imageOn.trim(),
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      specs: {
        tinggi: tinggi.trim() || undefined,
        diameter: diameter.trim() || undefined,
        daya: daya.trim() || undefined,
        fitting: fitting.trim() || undefined,
        sumberCahaya: sumberCahaya.trim() || undefined,
        material: specsMaterial.trim() || undefined,
        kabelPanjang: kabelPanjang.trim() || undefined,
      },
      variants: {
        finish: parseComma(finishVariant).length ? parseComma(finishVariant) : undefined,
        ukuran: parseComma(ukuranVariant).length ? parseComma(ukuranVariant) : undefined,
        tipBohlam: parseComma(tipBohlamVariant).length
          ? parseComma(tipBohlamVariant)
          : undefined,
      },
      isNew,
      isFeatured,
      isLowStock,
    };

    saveStoredProduct(productPayload);

    showToast({
      title: isEdit ? "Produk Berhasil Diperbarui" : "Produk Baru Ditambahkan",
      description: `${name} telah tersimpan di katalog etalase Illuminance.`,
      type: "success",
    });

    // Kembali ke admin halaman kelola produk
    setTimeout(() => {
      router.push("/admin/produk");
    }, 400);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = () => {
    deleteStoredProduct(id);
    showToast({
      title: "Produk Dihapus",
      description: `Produk ${name} telah dihapus dari sistem.`,
      type: "info",
    });
    router.push("/admin/produk");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ─── Breadcrumb & Top Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-il-surface-2">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs text-il-ink-on-light/50 font-body">
            <Link href="/admin" className="hover:text-il-accent transition-colors">
              Admin
            </Link>
            <span>/</span>
            <Link
              href="/admin/produk"
              className="hover:text-il-accent transition-colors"
            >
              Kelola Produk
            </Link>
            <span>/</span>
            <span className="text-il-ink-on-light font-medium">
              {isEdit ? "Edit Lampu" : "Tambah Lampu Baru"}
            </span>
          </nav>
          <h1 className="font-heading font-bold text-2xl text-il-ink-on-light tracking-tight">
            {isEdit ? `Edit Produk: ${initialProduct?.name}` : "Tambah Lampu Baru"}
          </h1>
          <p className="text-xs text-il-ink-on-light/60">
            {isEdit
              ? "Perbarui spesifikasi, foto dual lit-state, atau harga produk."
              : "Lengkapi formulir di bawah untuk mendaftarkan lampu ke dalam katalog Illuminance."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/produk"
            className="px-4 py-2 rounded-xl border border-il-surface-2 bg-white text-xs font-semibold text-il-ink-on-light/80 hover:text-il-ink-on-light hover:border-il-accent transition-colors cursor-pointer"
          >
            &larr; Kembali
          </Link>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl border border-il-danger/30 bg-il-danger/10 text-xs font-semibold text-il-danger hover:bg-il-danger/20 transition-colors cursor-pointer"
            >
              Hapus Produk
            </button>
          )}
        </div>
      </div>

      {/* ─── FORM + LIVE PREVIEW GRID ─── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Informasi Utama */}
          <div className="bg-white border border-il-surface-2 rounded-2xl p-6 shadow-xs space-y-5">
            <h2 className="font-heading font-semibold text-base text-il-ink-on-light border-b border-il-surface-2 pb-3">
              1. Informasi Utama
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Produk */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-il-ink-on-light mb-1.5">
                  Nama Produk <span className="text-il-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Lampu Meja Aruna Kuningan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light placeholder:text-il-ink-on-light/40 outline-none focus:border-il-accent"
                />
              </div>

              {/* Slug URL */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-il-ink-on-light">
                    Slug URL <span className="text-il-danger">*</span>
                  </label>
                  <span className="text-[11px] text-il-ink-on-light/50 font-mono">
                    /produk/{slug || "slug-produk"}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setIsSlugCustom(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="lampu-meja-aruna-kuningan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs font-mono text-il-ink-on-light placeholder:text-il-ink-on-light/40 outline-none focus:border-il-accent"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-il-ink-on-light mb-1.5">
                  Kategori Lampu
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Product["category"])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="block text-xs font-semibold text-il-ink-on-light mb-1.5">
                  Material Utama
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as Product["material"])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent cursor-pointer"
                >
                  {materials.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warna Cahaya */}
              <div>
                <label className="block text-xs font-semibold text-il-ink-on-light mb-1.5">
                  Warna Cahaya
                </label>
                <select
                  value={lightColor}
                  onChange={(e) =>
                    setLightColor(e.target.value as Product["lightColor"])
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent cursor-pointer"
                >
                  {lightColors.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Harga */}
              <div>
                <label className="block text-xs font-semibold text-il-ink-on-light mb-1.5">
                  Harga Satuan (Rp) <span className="text-il-danger">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-il-ink-on-light/50">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs font-semibold text-il-ink-on-light outline-none focus:border-il-accent"
                  />
                </div>
                <p className="text-[11px] text-il-accent font-medium mt-1">
                  Format: {formatRupiah(price || 0)}
                </p>
              </div>
            </div>

            {/* Badges / Status Flags */}
            <div className="pt-2 border-t border-il-surface-2/60">
              <label className="block text-xs font-semibold text-il-ink-on-light mb-2">
                Status Etalase
              </label>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="rounded text-il-accent focus:ring-0 accent-il-accent"
                  />
                  <span>Produk Baru (Badge &quot;Baru&quot;)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-il-accent focus:ring-0 accent-il-accent"
                  />
                  <span>Koleksi Unggulan (Tampil di Beranda)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isLowStock}
                    onChange={(e) => setIsLowStock(e.target.checked)}
                    className="rounded text-il-accent focus:ring-0 accent-il-accent"
                  />
                  <span>Stok Menipis (Badge &quot;Stok Terbatas&quot;)</span>
                </label>
              </div>
            </div>
          </div>

          {/* 2. Foto Produk (Dual Lit-State) */}
          <div className="bg-white border border-il-surface-2 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="font-heading font-semibold text-base text-il-ink-on-light">
                2. Foto Dual Lit-State (Khas Illuminance)
              </h2>
              <p className="text-xs text-il-ink-on-light/60 mt-0.5">
                Unggah berkas foto langsung dari komputer/HP atau gunakan tautan URL gambar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Foto Padam (OFF) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-il-ink-on-light">
                    Foto Lampu Padam (OFF) <span className="text-il-danger">*</span>
                  </label>
                  <div className="flex items-center text-[10px] bg-il-light-bg rounded-lg p-0.5 border border-il-surface-2">
                    <button
                      type="button"
                      onClick={() => setUploadModeOff("file")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        uploadModeOff === "file"
                          ? "bg-white text-il-ink-on-light font-semibold shadow-2xs"
                          : "text-il-ink-on-light/50 hover:text-il-ink-on-light"
                      }`}
                    >
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadModeOff("url")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        uploadModeOff === "url"
                          ? "bg-white text-il-ink-on-light font-semibold shadow-2xs"
                          : "text-il-ink-on-light/50 hover:text-il-ink-on-light"
                      }`}
                    >
                      Input URL
                    </button>
                  </div>
                </div>

                {uploadModeOff === "file" ? (
                  <div className="relative border-2 border-dashed border-il-surface-2 hover:border-il-accent rounded-2xl p-4 transition-colors bg-il-light-bg/50 text-center">
                    {imageOff ? (
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/5 border border-il-surface-2 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageOff}
                            alt="Foto Padam"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-semibold text-il-ink-on-light truncate">
                            Foto Padam Terpasang
                          </p>
                          <label className="inline-block mt-1 text-[11px] text-il-accent hover:underline font-semibold cursor-pointer">
                            Ganti Berkas
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "off");
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-3">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-il-ink-on-light/40"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="text-xs font-semibold text-il-ink-on-light">
                          {isProcessingOff ? "Memproses gambar..." : "Pilih foto dari perangkat"}
                        </span>
                        <span className="text-[10px] text-il-ink-on-light/50">
                          JPG, PNG, atau WebP
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "off");
                          }}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    required
                    value={imageOff}
                    onChange={(e) => setImageOff(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs font-mono text-il-ink-on-light outline-none focus:border-il-accent"
                  />
                )}
              </div>

              {/* Foto Menyala (ON) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-il-ink-on-light">
                    Foto Lampu Menyala (ON) <span className="text-il-danger">*</span>
                  </label>
                  <div className="flex items-center text-[10px] bg-il-light-bg rounded-lg p-0.5 border border-il-surface-2">
                    <button
                      type="button"
                      onClick={() => setUploadModeOn("file")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        uploadModeOn === "file"
                          ? "bg-white text-il-ink-on-light font-semibold shadow-2xs"
                          : "text-il-ink-on-light/50 hover:text-il-ink-on-light"
                      }`}
                    >
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadModeOn("url")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        uploadModeOn === "url"
                          ? "bg-white text-il-ink-on-light font-semibold shadow-2xs"
                          : "text-il-ink-on-light/50 hover:text-il-ink-on-light"
                      }`}
                    >
                      Input URL
                    </button>
                  </div>
                </div>

                {uploadModeOn === "file" ? (
                  <div className="relative border-2 border-dashed border-il-surface-2 hover:border-il-accent rounded-2xl p-4 transition-colors bg-il-light-bg/50 text-center">
                    {imageOn ? (
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/5 border border-il-surface-2 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageOn}
                            alt="Foto Menyala"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-semibold text-il-ink-on-light truncate">
                            Foto Menyala Terpasang
                          </p>
                          <label className="inline-block mt-1 text-[11px] text-il-accent hover:underline font-semibold cursor-pointer">
                            Ganti Berkas
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "on");
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-3">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-il-ink-on-light/40"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="text-xs font-semibold text-il-ink-on-light">
                          {isProcessingOn ? "Memproses gambar..." : "Pilih foto dari perangkat"}
                        </span>
                        <span className="text-[10px] text-il-ink-on-light/50">
                          JPG, PNG, atau WebP
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "on");
                          }}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    required
                    value={imageOn}
                    onChange={(e) => setImageOn(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs font-mono text-il-ink-on-light outline-none focus:border-il-accent"
                  />
                )}
              </div>

              {/* Foto Tambahan (Galeri Produk) */}
              <div className="md:col-span-2 pt-4 border-t border-il-surface-2 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-il-ink-on-light block">
                      Foto Galeri Tambahan (Detail Sudut &amp; Suasana Ruangan)
                    </label>
                    <span className="text-[11px] text-il-ink-on-light/50">
                      Tersimpan {galleryImages.length} foto galeri tambahan
                    </span>
                  </div>
                  <div className="flex items-center text-[10px] bg-il-light-bg rounded-lg p-0.5 border border-il-surface-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode("file")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        galleryUploadMode === "file"
                          ? "bg-white text-il-ink-on-light font-semibold shadow-2xs"
                          : "text-il-ink-on-light/50 hover:text-il-ink-on-light"
                      }`}
                    >
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode("url")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        galleryUploadMode === "url"
                          ? "bg-white text-il-ink-on-light font-semibold shadow-2xs"
                          : "text-il-ink-on-light/50 hover:text-il-ink-on-light"
                      }`}
                    >
                      Input URL
                    </button>
                  </div>
                </div>

                {galleryUploadMode === "file" ? (
                  <div className="border-2 border-dashed border-il-surface-2 hover:border-il-accent rounded-2xl p-4 transition-colors bg-il-light-bg/50 text-center">
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-3">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-il-ink-on-light/40"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span className="text-xs font-semibold text-il-ink-on-light">
                        {isProcessingGallery ? "Memproses gambar..." : "+ Unggah Foto Tambahan (Bisa banyak)"}
                      </span>
                      <span className="text-[10px] text-il-ink-on-light/50">
                        Pilih satu atau beberapa berkas gambar sekaligus
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleGalleryUpload(e.target.files)}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      placeholder="https://example.com/foto-detail.jpg"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs font-mono text-il-ink-on-light outline-none focus:border-il-accent"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-4 py-2.5 rounded-xl bg-il-accent text-il-dark-bg font-semibold text-xs hover:bg-il-accent-dark transition-colors cursor-pointer"
                    >
                      + Tambah
                    </button>
                  </div>
                )}

                {/* Thumbnails galeri yang sudah diunggah */}
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden bg-il-light-bg border border-il-surface-2 group shadow-2xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Foto Tambahan ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          title="Hapus foto ini"
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-il-danger text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Deskripsi Produk */}
          <div className="bg-white border border-il-surface-2 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-semibold text-base text-il-ink-on-light border-b border-il-surface-2 pb-3">
              3. Deskripsi Produk
            </h2>

            <div>
              <label className="block text-xs font-semibold text-il-ink-on-light mb-1.5">
                Deskripsi Singkat (Tampil di kartu &amp; katalog)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Rangkuman 1-2 kalimat estetika dan fungsi lampu..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-il-ink-on-light mb-1.5">
                Deskripsi Lengkap (Tampil di halaman detail)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uraikan filosofi desain, keunggulan material artisan, atau saran penataan ruangan..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
              />
            </div>
          </div>

          {/* 4. Spesifikasi Teknis */}
          <div className="bg-white border border-il-surface-2 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-semibold text-base text-il-ink-on-light border-b border-il-surface-2 pb-3">
              4. Spesifikasi Teknis (Opsional)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Tinggi
                </label>
                <input
                  type="text"
                  value={tinggi}
                  onChange={(e) => setTinggi(e.target.value)}
                  placeholder="e.g. 45 cm"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Diameter
                </label>
                <input
                  type="text"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder="e.g. 20 cm"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Daya Maksimal
                </label>
                <input
                  type="text"
                  value={daya}
                  onChange={(e) => setDaya(e.target.value)}
                  placeholder="e.g. Max 40W"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Fitting Bohlam
                </label>
                <input
                  type="text"
                  value={fitting}
                  onChange={(e) => setFitting(e.target.value)}
                  placeholder="e.g. E14 / E27"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Panjang Kabel
                </label>
                <input
                  type="text"
                  value={kabelPanjang}
                  onChange={(e) => setKabelPanjang(e.target.value)}
                  placeholder="e.g. 1.8 m"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Sumber Cahaya
                </label>
                <input
                  type="text"
                  value={sumberCahaya}
                  onChange={(e) => setSumberCahaya(e.target.value)}
                  placeholder="Termasuk / Tidak termasuk"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                Keterangan Material Rinci
              </label>
              <input
                type="text"
                value={specsMaterial}
                onChange={(e) => setSpecsMaterial(e.target.value)}
                placeholder="e.g. Kuningan poles, kabel tekstil kepang"
                className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
              />
            </div>
          </div>

          {/* 5. Varian Produk */}
          <div className="bg-white border border-il-surface-2 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="font-heading font-semibold text-base text-il-ink-on-light">
                5. Varian Produk (Pisahkan dengan tanda koma)
              </h2>
              <p className="text-xs text-il-ink-on-light/60 mt-0.5">
                Contoh: &quot;Kuningan Matte, Kuningan Antik&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Varian Finish / Finishing
                </label>
                <input
                  type="text"
                  value={finishVariant}
                  onChange={(e) => setFinishVariant(e.target.value)}
                  placeholder="Matte, Poles, Antik"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Varian Ukuran
                </label>
                <input
                  type="text"
                  value={ukuranVariant}
                  onChange={(e) => setUkuranVariant(e.target.value)}
                  placeholder="Kecil, Standar, Besar"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-il-ink-on-light mb-1">
                  Varian Bohlam
                </label>
                <input
                  type="text"
                  value={tipBohlamVariant}
                  onChange={(e) => setTipBohlamVariant(e.target.value)}
                  placeholder="LED E27, Edison Filamen"
                  className="w-full px-3 py-2 rounded-xl bg-il-light-bg border border-il-surface-2 text-xs text-il-ink-on-light outline-none focus:border-il-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Preview & Submit Actions */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white border border-il-surface-2 rounded-2xl p-6 shadow-xs space-y-4 sticky top-6">
            <h3 className="font-heading font-semibold text-sm text-il-ink-on-light border-b border-il-surface-2 pb-2">
              Konfirmasi &amp; Simpan
            </h3>

            <div className="space-y-2 text-xs text-il-ink-on-light/70">
              <div className="flex justify-between py-1 border-b border-il-surface-2/60">
                <span>Status ID:</span>
                <span className="font-mono font-semibold">{id || "(Baru)"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-il-surface-2/60">
                <span>Kategori:</span>
                <span className="capitalize font-semibold text-il-accent">{category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-il-surface-2/60">
                <span>Harga:</span>
                <span className="font-semibold text-il-ink-on-light">
                  {formatRupiah(price || 0)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-xs hover:bg-il-accent-dark transition-all cursor-pointer shadow-xs disabled:opacity-50 text-center"
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : isEdit
                  ? "Perbarui Produk"
                  : "Simpan & Publikasikan"}
              </button>

              <Link
                href="/admin/produk"
                className="w-full py-2.5 rounded-full border border-il-surface-2 bg-transparent text-xs font-semibold text-il-ink-on-light/70 hover:text-il-ink-on-light text-center transition-colors"
              >
                Batal
              </Link>
            </div>

            {/* Live Lit-State Preview Box */}
            <div className="mt-6 pt-5 border-t border-il-surface-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-il-ink-on-light">
                  Pratinjau Kartu Produk
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewLit(!previewLit)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                    previewLit
                      ? "bg-il-accent text-il-dark-bg border-il-accent"
                      : "bg-il-light-bg text-il-ink-on-light/70 border-il-surface-2"
                  }`}
                >
                  {previewLit ? "☀ Menyala (ON)" : "○ Padam (OFF)"}
                </button>
              </div>

              {/* Mock Product Card */}
              <div className="bg-il-light-bg border border-il-surface-2 rounded-2xl overflow-hidden shadow-2xs">
                <div className="aspect-4/3 relative overflow-hidden bg-black/5 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewLit ? imageOn : imageOff}
                    alt={name || "Preview"}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80";
                    }}
                  />
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {isNew && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-il-accent text-il-dark-bg">
                        Baru
                      </span>
                    )}
                    {isLowStock && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-il-danger text-white">
                        Stok Terbatas
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-il-accent">
                    {category} &bull; {material}
                  </span>
                  <h4 className="font-heading font-semibold text-xs text-il-ink-on-light truncate">
                    {name || "Nama Lampu Illuminance"}
                  </h4>
                  <p className="font-heading font-bold text-xs text-il-accent">
                    {formatRupiah(price || 0)}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-il-ink-on-light/40 text-center">
                Klik tombol &quot;Menyala&quot; di atas untuk menguji crossfade foto lampu.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* ─── MODAL KONFIRMASI HAPUS ─── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-il-surface-2 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-il-danger">
              <div className="w-10 h-10 rounded-full bg-il-danger/10 flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base text-il-ink-on-light">
                  Hapus Produk?
                </h3>
                <p className="text-xs text-il-ink-on-light/60">Tindakan tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-xs text-il-ink-on-light/70 leading-relaxed">
              Lampu{" "}
              <span className="font-semibold text-il-ink-on-light">
                &quot;{name}&quot;
              </span>{" "}
              akan dihapus secara permanen dari katalog dan etalase toko Illuminance.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-il-surface-2 text-xs font-semibold text-il-ink-on-light/70 hover:bg-il-light-bg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-il-danger text-white text-xs font-semibold hover:bg-il-danger/90 transition-colors cursor-pointer shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
