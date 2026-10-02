"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order } from "@/lib/orders-placeholder";
import { getStoredOrderById, updateOrderStatus } from "@/lib/orders-storage";
import { IS_MIDTRANS_ENABLED } from "@/lib/midtrans";
import { useToast } from "@/context/ToastContext";

export function PendingPaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const orderId = searchParams.get("orderId") || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const found = getStoredOrderById(orderId);
    if (found) {
      setOrder(found);
    }
    setLoading(false);
  }, [orderId]);

  const handleSimulatePaymentSuccess = () => {
    if (!order) return;
    updateOrderStatus(order.id, "Diproses");
    showToast({
      title: "Pembayaran Berhasil Dikonfirmasi",
      description: `Pesanan ${order.id} telah lunas dan siap diproses.`,
      type: "success",
    });
    router.push(`/checkout/sukses?orderId=${encodeURIComponent(order.id)}`);
  };

  const handleCancelOrder = () => {
    if (!order) return;
    if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      updateOrderStatus(order.id, "Batal");
      showToast({
        title: "Pesanan Dibatalkan",
        description: `Pesanan ${order.id} telah dibatalkan.`,
        type: "error",
      });
      router.push("/produk");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-il-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h1 className="font-heading font-bold text-2xl text-il-ink-on-light mb-2">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="font-body text-sm text-il-ink-on-light/60 mb-6">
          Nomor pesanan tidak valid atau telah kedaluwarsa.
        </p>
        <Link
          href="/produk"
          className="inline-flex px-6 py-2.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-sm hover:bg-il-accent-dark transition-colors"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // Jika sudah lunas, langsung beri navigasi ke halaman sukses
  if (order.status !== "Menunggu Pembayaran") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-il-success/15 text-il-success flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-heading font-bold text-2xl text-il-ink-on-light mb-2">
          Pesanan Ini Sudah Selesai Dibayar
        </h1>
        <p className="font-body text-sm text-il-ink-on-light/60 mb-6">
          Status pesanan Anda saat ini adalah <strong className="text-il-accent">{order.status}</strong>.
        </p>
        <Link
          href={`/checkout/sukses?orderId=${encodeURIComponent(order.id)}`}
          className="inline-flex px-6 py-2.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-sm hover:bg-il-accent-dark transition-colors"
        >
          Lihat Bukti Pembelian
        </Link>
      </div>
    );
  }

  const dummyVaNumber = "88019" + order.id.replace(/[^0-9]/g, "").padStart(8, "2401");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
      {/* ─── BANNER DEBUG & TOGGLE STATUS MIDTRANS ─── */}
      <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/40 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-il-dark-bg font-mono font-bold text-xs">
              DEBUG / SIMULASI MODE
            </span>
            <h3 className="font-heading font-bold text-base text-il-ink-on-light mt-1.5">
              Midtrans Gateway Status:{" "}
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-il-surface-2">
                USE_MIDTRANS={IS_MIDTRANS_ENABLED ? "true" : "false"}
              </span>
            </h3>
            <p className="font-body text-xs text-il-ink-on-light/70 mt-1 max-w-xl">
              Integrasi Midtrans sedang dalam mode simulasi. Gunakan tombol di bawah ini untuk mensimulasikan kejadian ketika pembeli telah menyelesaikan pembayaran.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSimulatePaymentSuccess}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-il-success text-white font-heading font-bold text-sm shadow-sm hover:bg-il-success/90 transition-transform active:scale-95 cursor-pointer flex-shrink-0 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            User Selesai Membayar
          </button>
        </div>
      </div>

      {/* ─── STATUS CARD MENUNGGU PEMBAYARAN ─── */}
      <div className="bg-white border border-il-surface-2 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-il-surface-2 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-il-accent" />
            </span>
            <div>
              <p className="font-body text-xs text-il-ink-on-light/50 font-medium">Status Pesanan</p>
              <h2 className="font-heading font-bold text-lg text-il-ink-on-light">
                Menunggu Pembayaran
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="font-body text-xs text-il-ink-on-light/50">ID Pesanan</p>
            <p className="font-mono font-bold text-sm text-il-accent">{order.id}</p>
          </div>
        </div>

        {/* Total Tagihan */}
        <div className="bg-il-light-bg rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-il-surface-2">
          <div>
            <span className="font-body text-xs text-il-ink-on-light/60">Total yang harus dibayar:</span>
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-il-ink-on-light mt-0.5">
              {order.total}
            </div>
          </div>
          <div className="text-xs text-il-ink-on-light/60 sm:text-right">
            <span>Metode: </span>
            <strong className="text-il-ink-on-light">{order.paymentMethod || "Midtrans / Transfer"}</strong>
          </div>
        </div>

        {/* Instruksi Pembayaran */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-sm text-il-ink-on-light">
            Instruksi Pembayaran
          </h3>

          <div className="border border-il-surface-2 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-il-ink-on-light/60 font-body">Nomor Virtual Account / Kode Bayar</p>
                <p className="font-mono font-bold text-base sm:text-lg text-il-ink-on-light tracking-wider">
                  {dummyVaNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(dummyVaNumber)}
                className="px-3 py-1.5 rounded-lg border border-il-surface-2 text-xs font-medium text-il-ink-on-light hover:border-il-accent transition-colors cursor-pointer"
              >
                {copied ? "Tersalin!" : "Salin Kode"}
              </button>
            </div>
            <p className="text-[11px] text-il-ink-on-light/50 font-body border-t border-dashed border-il-surface-2 pt-2">
              Selesaikan transaksi sebelum 24 jam. Jika sudah transfer, verifikasi akan berjalan otomatis (atau tekan tombol debug di atas pada lingkungan pengembangan).
            </p>
          </div>

          {/* Rincian Produk Singkat */}
          <div className="border border-il-surface-2 rounded-xl p-4">
            <p className="text-xs font-semibold text-il-ink-on-light mb-2">Item yang Dipesan:</p>
            <p className="text-xs text-il-ink-on-light/70">{order.item}</p>
            <div className="mt-3 pt-3 border-t border-il-surface-2 text-xs text-il-ink-on-light/60 flex flex-col gap-1">
              <p>Penerima: <span className="font-medium text-il-ink-on-light">{order.customer}</span> ({order.phone || "-"})</p>
              <p>Alamat: <span className="font-medium text-il-ink-on-light">{order.address}, {order.city} {order.postalCode}</span></p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 pt-6 border-t border-il-surface-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCancelOrder}
            className="w-full sm:w-auto text-xs font-body text-il-danger hover:underline cursor-pointer"
          >
            Batalkan Pesanan
          </button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/produk"
              className="w-full sm:w-auto text-center px-4 py-2.5 rounded-full border border-il-surface-2 text-xs font-medium text-il-ink-on-light hover:border-il-accent transition-colors"
            >
              Belanja Lainnya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
