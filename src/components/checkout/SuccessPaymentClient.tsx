"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order } from "@/lib/orders-placeholder";
import { getStoredOrderById } from "@/lib/orders-storage";

export function SuccessPaymentClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-il-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
      <div className="bg-white border border-il-surface-2 rounded-2xl p-6 sm:p-10 shadow-xs text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-il-success/10 text-il-success flex items-center justify-center mx-auto">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-il-success/15 text-il-success text-xs font-semibold mb-2">
            Pembayaran Berhasil Dikonfirmasi
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-il-ink-on-light tracking-tight">
            Terima Kasih atas Pesanan Anda!
          </h1>
          <p className="font-body text-sm text-il-ink-on-light/60 mt-2 max-w-md mx-auto">
            Pembayaran Anda telah kami terima. Pesanan sedang dipersiapkan oleh perajin Illuminance dan segera dikirim.
          </p>
        </div>

        {order ? (
          <div className="border border-il-surface-2 rounded-xl p-5 text-left bg-il-light-bg space-y-3 font-body text-xs text-il-ink-on-light/80">
            <div className="flex justify-between items-center border-b border-il-surface-2 pb-3">
              <span className="text-il-ink-on-light/60">Nomor Pesanan:</span>
              <span className="font-mono font-bold text-sm text-il-accent">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-il-ink-on-light/60">Tanggal Transaksi:</span>
              <span className="font-medium text-il-ink-on-light">{order.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-il-ink-on-light/60">Status Pesanan:</span>
              <span className="px-2 py-0.5 rounded bg-il-success/20 text-il-success font-semibold text-[11px]">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-il-ink-on-light/60">Item Dipesan:</span>
              <span className="font-medium text-il-ink-on-light text-right max-w-xs truncate">{order.item}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-il-ink-on-light/60">Penerima & Alamat:</span>
              <span className="font-medium text-il-ink-on-light text-right max-w-xs truncate">
                {order.customer} ({order.city || "Alamat tercatat"})
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-il-surface-2 pt-3 font-semibold text-sm text-il-ink-on-light">
              <span>Total Nilai Transaksi:</span>
              <span className="text-il-accent font-heading font-bold text-base">{order.total}</span>
            </div>
          </div>
        ) : (
          <p className="font-body text-xs text-il-ink-on-light/50 italic">
            Nomor referensi pesanan: {orderId || "Umum"}
          </p>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/produk"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-sm hover:bg-il-accent-dark transition-colors"
          >
            Lanjut Belanja Lampu
          </Link>
          <Link
            href="/admin/pesanan"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-il-surface-2 text-il-ink-on-light font-heading font-medium text-sm hover:border-il-accent transition-colors"
          >
            Cek Dashboard Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
