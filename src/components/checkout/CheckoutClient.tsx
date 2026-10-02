"use client";

/**
 * CheckoutClient — halaman checkout dengan minimal chrome
 * Form: Pengiriman → Metode Kirim → Metode Pembayaran
 * OrderSummary: sticky kanan desktop / collapsible atas mobile
 * Submit: tampilkan state "Pesanan Diterima" dummy (belum ada integrasi payment gateway)
 *
 * PENTING: Tidak ada koneksi payment gateway nyata di sini.
 * TODO: Integrasikan dengan payment gateway pilihan (Midtrans, Xendit, dll.) sebelum live.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { saveStoredOrder } from "@/lib/orders-storage";
import { Order } from "@/lib/orders-placeholder";

// TODO: Ganti dengan pilihan kurir asli dan estimasi ongkir dari API
const SHIPPING_OPTIONS = [
  { id: "reguler", label: "Reguler", desc: "[TODO: Estimasi] 3-5 hari kerja", price: 0, priceLabel: "Gratis" },
  { id: "express", label: "Express", desc: "[TODO: Estimasi] 1-2 hari kerja", price: 50000, priceLabel: "Rp 50.000" },
] as const;

const PAYMENT_METHODS = [
  { id: "midtrans", label: "Midtrans Payment Gateway (Otomatis)", icon: "⚡", desc: "Virtual Account (BCA, Mandiri, BRI, BNI), QRIS, GoPay" },
  { id: "transfer", label: "Transfer Bank Manual", icon: "🏦", desc: "Transfer ke rekening resmi Illuminance" },
  { id: "cod", label: "COD (Bayar di Tempat)", icon: "💵", desc: "Bayar tunai saat barang diterima" },
] as const;

type FormData = {
  nama: string;
  hp: string;
  alamat: string;
  kota: string;
  kodePos: string;
  catatan: string;
  shippingId: string;
  paymentId: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nama.trim()) errors.nama = "Nama lengkap wajib diisi.";
  if (!data.hp.trim()) errors.hp = "Nomor HP wajib diisi.";
  else if (!/^(\+62|62|0)[0-9]{8,13}$/.test(data.hp.replace(/\s/g, "")))
    errors.hp = "Masukkan nomor HP yang valid (mis. 08xxxxxxxxxx).";
  if (!data.alamat.trim()) errors.alamat = "Alamat lengkap wajib diisi.";
  if (!data.kota.trim()) errors.kota = "Kota wajib diisi.";
  if (!data.kodePos.trim()) errors.kodePos = "Kode pos wajib diisi.";
  else if (!/^\d{5}$/.test(data.kodePos)) errors.kodePos = "Kode pos harus 5 digit.";
  if (!data.shippingId) errors.shippingId = "Pilih metode pengiriman.";
  if (!data.paymentId) errors.paymentId = "Pilih metode pembayaran.";
  return errors;
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, subtotalFormatted, clearCart } = useCart();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [form, setForm] = useState<FormData>({
    nama: "",
    hp: "",
    alamat: "",
    kota: "",
    kodePos: "",
    catatan: "",
    shippingId: "reguler",
    paymentId: "midtrans",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const selectedShipping = SHIPPING_OPTIONS.find((o) => o.id === form.shippingId);

  const handleChange = (key: keyof FormData, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (touched[key]) {
      // Re-validate saat mengetik setelah pernah disentuh
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleBlur = (key: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validate({ ...form });
    if (errs[key]) setErrors((prev) => ({ ...prev, [key]: errs[key] }));
    else setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    if (Object.keys(errs).length > 0) return;

    const totalAmount = subtotal + (selectedShipping?.price ?? 0);
    const totalFormatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(totalAmount);

    const newOrderId = `#ILM-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const newOrder: Order = {
      id: newOrderId,
      customer: form.nama,
      email: `${form.nama.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: form.hp,
      address: form.alamat,
      city: form.kota,
      postalCode: form.kodePos,
      item: items.length > 0 ? items.map((i) => `${i.name} (x${i.qty})`).join(", ") : "Lampu Pesanan",
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        variant: i.variant,
        qty: i.qty,
        price: i.price,
        image: i.imageOff,
      })),
      total: totalFormatted,
      totalAmount: totalAmount,
      date: orderDate,
      status: "Menunggu Pembayaran",
      paymentMethod: PAYMENT_METHODS.find((p) => p.id === form.paymentId)?.label || form.paymentId,
      shippingMethod: selectedShipping?.label,
    };

    saveStoredOrder(newOrder);
    clearCart();
    router.push(`/checkout/bayar?orderId=${encodeURIComponent(newOrderId)}`);
  };

  const inputClass = (key: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border font-body text-sm text-il-ink-on-light placeholder-il-ink-on-light/30 outline-none transition-colors ${
      errors[key]
        ? "border-il-danger focus:border-il-danger bg-il-danger/5"
        : "border-il-surface-2 focus:border-il-accent bg-white"
    }`;

  const totalAmount = subtotal + (selectedShipping?.price ?? 0);
  const totalFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(totalAmount);

  // Order Summary Card
  const OrderSummaryCard = (
    <div className="bg-white rounded-xl border border-il-surface-2 p-5">
      <h2 className="font-heading font-semibold text-base text-il-ink-on-light mb-4">
        Ringkasan Pesanan
      </h2>

      {items.length === 0 ? (
        <p className="font-body text-sm text-il-ink-on-light/50">Keranjang kosong.</p>
      ) : (
        <ul className="flex flex-col gap-3 mb-4">
          {items.map((item) => (
            <li key={`${item.productId}__${item.variant ?? ""}`} className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-il-light-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageOff} alt={item.name} className="w-full h-full object-cover" loading="lazy"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-il-ink-on-light line-clamp-2">{item.name}</p>
                {item.variant && <p className="text-[10px] text-il-ink-on-light/40 mt-0.5">{item.variant}</p>}
                <p className="font-body text-xs text-il-ink-on-light/60 mt-0.5">x{item.qty}</p>
              </div>
              <span className="font-body font-medium text-xs text-il-ink-on-light flex-shrink-0">
                {item.priceFormatted}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-il-surface-2 pt-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-body text-il-ink-on-light/60">Subtotal</span>
          <span className="font-body font-medium text-il-ink-on-light">{subtotalFormatted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-body text-il-ink-on-light/60">Ongkos Kirim</span>
          <span className="font-body font-medium text-il-ink-on-light">
            {selectedShipping ? selectedShipping.priceLabel : "Pilih metode pengiriman"}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-il-surface-2 mt-1">
          <span className="font-heading text-il-ink-on-light">Total</span>
          <span className="font-heading text-il-ink-on-light">{totalFormatted}</span>
        </div>
      </div>

      {/* Kode promo */}
      <div className="mt-4">
        <label htmlFor="kode-promo" className="font-body text-xs text-il-ink-on-light/60 block mb-1.5">
          Kode Promo (opsional)
        </label>
        <div className="flex gap-2">
          <input
            id="kode-promo"
            type="text"
            placeholder="Masukkan kode"
            className="flex-1 px-3 py-2 rounded-lg border border-il-surface-2 text-xs font-body text-il-ink-on-light placeholder-il-ink-on-light/30 outline-none focus:border-il-accent transition-colors"
          />
          <button
            type="button"
            className="px-3 py-2 rounded-lg border border-il-surface-2 text-xs font-medium text-il-ink-on-light hover:border-il-accent transition-colors cursor-pointer"
          >
            {/* TODO: integrasikan validasi kode promo */}
            Pakai
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-16">
      {/* ─── RINGKASAN collapsible di atas (mobile & tablet) ─── */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          aria-controls="summary-mobile"
          className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-il-surface-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 2h2.5l1.8 8h8l1.2-5H5" stroke="#1C1A17" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="13.5" r="1" fill="#1C1A17"/>
              <circle cx="12" cy="13.5" r="1" fill="#1C1A17"/>
            </svg>
            <span className="font-body font-medium text-sm text-il-ink-on-light">
              {summaryOpen ? "Sembunyikan Ringkasan" : "Lihat Ringkasan Pesanan"}
            </span>
          </div>
          <span className="font-heading font-bold text-il-accent">{totalFormatted}</span>
        </button>
        <div
          id="summary-mobile"
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: summaryOpen ? "600px" : "0px" }}
        >
          <div className="pt-3">{OrderSummaryCard}</div>
        </div>
      </div>

      {/* ─── LAYOUT 2 KOLOM ─── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* FORM — kolom kiri */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 w-full max-w-2xl flex flex-col gap-8"
          aria-label="Form checkout"
        >
          {/* BAGIAN 1 — Informasi Pengiriman */}
          <section aria-labelledby="shipping-info-heading">
            <h2
              id="shipping-info-heading"
              className="font-heading font-semibold text-xl text-il-ink-on-light mb-5 flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-full bg-il-accent text-il-dark-bg text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
              Informasi Pengiriman
            </h2>

            <div className="bg-white rounded-xl border border-il-surface-2 p-5 flex flex-col gap-4">
              {/* Nama */}
              <div>
                <label htmlFor="nama" className="font-body font-medium text-sm text-il-ink-on-light block mb-1.5">
                  Nama Lengkap <span aria-hidden="true" className="text-il-danger">*</span>
                </label>
                <input
                  id="nama"
                  type="text"
                  autoComplete="name"
                  value={form.nama}
                  onChange={(e) => handleChange("nama", e.target.value)}
                  onBlur={() => handleBlur("nama")}
                  placeholder="Masukkan nama penerima"
                  aria-required="true"
                  aria-describedby={errors.nama ? "nama-error" : undefined}
                  aria-invalid={!!errors.nama}
                  className={inputClass("nama")}
                />
                {errors.nama && (
                  <p id="nama-error" role="alert" className="mt-1.5 text-xs text-il-danger">
                    {errors.nama}
                  </p>
                )}
              </div>

              {/* No HP */}
              <div>
                <label htmlFor="hp" className="font-body font-medium text-sm text-il-ink-on-light block mb-1.5">
                  Nomor HP / WhatsApp <span aria-hidden="true" className="text-il-danger">*</span>
                </label>
                <input
                  id="hp"
                  type="tel"
                  autoComplete="tel"
                  value={form.hp}
                  onChange={(e) => handleChange("hp", e.target.value)}
                  onBlur={() => handleBlur("hp")}
                  placeholder="08xxxxxxxxxx"
                  aria-required="true"
                  aria-describedby={errors.hp ? "hp-error" : undefined}
                  aria-invalid={!!errors.hp}
                  className={inputClass("hp")}
                />
                {errors.hp && (
                  <p id="hp-error" role="alert" className="mt-1.5 text-xs text-il-danger">
                    {errors.hp}
                  </p>
                )}
              </div>

              {/* Alamat */}
              <div>
                <label htmlFor="alamat" className="font-body font-medium text-sm text-il-ink-on-light block mb-1.5">
                  Alamat Lengkap <span aria-hidden="true" className="text-il-danger">*</span>
                </label>
                <textarea
                  id="alamat"
                  rows={3}
                  autoComplete="street-address"
                  value={form.alamat}
                  onChange={(e) => handleChange("alamat", e.target.value)}
                  onBlur={() => handleBlur("alamat")}
                  placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan"
                  aria-required="true"
                  aria-describedby={errors.alamat ? "alamat-error" : undefined}
                  aria-invalid={!!errors.alamat}
                  className={`${inputClass("alamat")} resize-none`}
                />
                {errors.alamat && (
                  <p id="alamat-error" role="alert" className="mt-1.5 text-xs text-il-danger">
                    {errors.alamat}
                  </p>
                )}
              </div>

              {/* Kota + Kode Pos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="kota" className="font-body font-medium text-sm text-il-ink-on-light block mb-1.5">
                    Kota / Kabupaten <span aria-hidden="true" className="text-il-danger">*</span>
                  </label>
                  <input
                    id="kota"
                    type="text"
                    autoComplete="address-level2"
                    value={form.kota}
                    onChange={(e) => handleChange("kota", e.target.value)}
                    onBlur={() => handleBlur("kota")}
                    placeholder="mis. Jakarta Selatan"
                    aria-required="true"
                    aria-describedby={errors.kota ? "kota-error" : undefined}
                    aria-invalid={!!errors.kota}
                    className={inputClass("kota")}
                  />
                  {errors.kota && (
                    <p id="kota-error" role="alert" className="mt-1.5 text-xs text-il-danger">
                      {errors.kota}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="kodePos" className="font-body font-medium text-sm text-il-ink-on-light block mb-1.5">
                    Kode Pos <span aria-hidden="true" className="text-il-danger">*</span>
                  </label>
                  <input
                    id="kodePos"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={form.kodePos}
                    onChange={(e) => handleChange("kodePos", e.target.value)}
                    onBlur={() => handleBlur("kodePos")}
                    placeholder="12345"
                    maxLength={5}
                    aria-required="true"
                    aria-describedby={errors.kodePos ? "kodePos-error" : undefined}
                    aria-invalid={!!errors.kodePos}
                    className={inputClass("kodePos")}
                  />
                  {errors.kodePos && (
                    <p id="kodePos-error" role="alert" className="mt-1.5 text-xs text-il-danger">
                      {errors.kodePos}
                    </p>
                  )}
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label htmlFor="catatan" className="font-body font-medium text-sm text-il-ink-on-light block mb-1.5">
                  Catatan untuk Kurir
                  <span className="text-il-ink-on-light/40 font-normal ml-1">(opsional)</span>
                </label>
                <input
                  id="catatan"
                  type="text"
                  value={form.catatan}
                  onChange={(e) => handleChange("catatan", e.target.value)}
                  placeholder="mis. Titip di satpam, jangan diketuk, dll."
                  className={inputClass("catatan")}
                />
              </div>
            </div>
          </section>

          {/* BAGIAN 2 — Metode Pengiriman */}
          <section aria-labelledby="shipping-method-heading">
            <h2
              id="shipping-method-heading"
              className="font-heading font-semibold text-xl text-il-ink-on-light mb-5 flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-full bg-il-accent text-il-dark-bg text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
              Metode Pengiriman
            </h2>

            <div className="bg-white rounded-xl border border-il-surface-2 p-5">
              {errors.shippingId && (
                <p role="alert" className="mb-3 text-xs text-il-danger">
                  {errors.shippingId}
                </p>
              )}
              <div className="flex flex-col gap-3" role="group" aria-labelledby="shipping-method-heading">
                {SHIPPING_OPTIONS.map((opt) => {
                  const isSelected = form.shippingId === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-il-accent bg-il-accent/5"
                          : "border-il-surface-2 hover:border-il-ink-on-light/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingId"
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => handleChange("shippingId", opt.id)}
                        onBlur={() => handleBlur("shippingId")}
                        className="accent-il-accent"
                        aria-describedby={`shipping-desc-${opt.id}`}
                      />
                      <div className="flex-1">
                        <p className="font-body font-medium text-sm text-il-ink-on-light">{opt.label}</p>
                        <p id={`shipping-desc-${opt.id}`} className="font-body text-xs text-il-ink-on-light/50 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                      <span className="font-heading font-semibold text-sm text-il-accent flex-shrink-0">
                        {opt.priceLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          {/* BAGIAN 3 — Metode Pembayaran */}
          <section aria-labelledby="payment-method-heading">
            <h2
              id="payment-method-heading"
              className="font-heading font-semibold text-xl text-il-ink-on-light mb-5 flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-full bg-il-accent text-il-dark-bg text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
              Metode Pembayaran
            </h2>

            <div className="bg-white rounded-xl border border-il-surface-2 p-5">
              {/* Catatan: tanpa logo payment gateway spesifik — belum ada integrasi nyata */}
              <p className="font-body text-xs text-il-ink-on-light/40 mb-4 italic">
                [TODO: Integrasikan dengan payment gateway sebelum live. Pilihan berikut adalah UI placeholder.]
              </p>

              {errors.paymentId && (
                <p role="alert" className="mb-3 text-xs text-il-danger">
                  {errors.paymentId}
                </p>
              )}
              <div className="flex flex-col gap-3" role="group" aria-labelledby="payment-method-heading">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = form.paymentId === pm.id;
                  return (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-il-accent bg-il-accent/5"
                          : "border-il-surface-2 hover:border-il-ink-on-light/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentId"
                        value={pm.id}
                        checked={isSelected}
                        onChange={() => handleChange("paymentId", pm.id)}
                        onBlur={() => handleBlur("paymentId")}
                        className="accent-il-accent"
                      />
                      <span className="text-xl" aria-hidden="true">{pm.icon}</span>
                      <div className="flex-1">
                        <p className="font-body font-medium text-sm text-il-ink-on-light">{pm.label}</p>
                        <p className="font-body text-xs text-il-ink-on-light/50 mt-0.5">{pm.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Tombol submit */}
          <div>
            {/* Trust signals kecil */}
            <div className="flex items-center gap-2 mb-4 text-xs text-il-ink-on-light/40">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1L2 3.5v4c0 2.5 2 4.5 5 5 3-0.5 5-2.5 5-5v-4L7 1z" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Transaksi aman. Data Anda tidak akan dibagikan ke pihak ketiga.
              {/* TODO: Tambahkan klaim sertifikasi SSL hanya jika sudah dipasang dan bisa diverifikasi */}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-il-accent text-il-dark-bg font-heading font-bold text-base hover:bg-il-accent-dark transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-il-accent focus-visible:ring-offset-2"
            >
              Buat Pesanan
            </button>
            <p className="font-body text-xs text-il-ink-on-light/40 text-center mt-3">
              Dengan membuat pesanan, Anda setuju dengan syarat dan ketentuan kami.
              {/* TODO: Tambahkan link ke halaman Syarat & Ketentuan yang asli */}
            </p>
          </div>
        </form>

        {/* ORDER SUMMARY — sticky kanan (desktop) */}
        <div className="hidden lg:block w-[360px] flex-shrink-0 sticky top-20 h-fit">
          {OrderSummaryCard}
        </div>
      </div>
    </div>
  );
}
