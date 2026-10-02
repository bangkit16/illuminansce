"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/lib/orders-placeholder";
import { getStoredOrders } from "@/lib/orders-storage";
import { getStoredProducts } from "@/lib/products-storage";
import { products } from "@/lib/products-placeholder";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(products.length);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const list = getStoredProducts();
    setProductCount(list.length);
    setLowStockCount(list.filter((p) => p.isLowStock).length);
    setOrders(getStoredOrders());

    const handleOrdersUpdated = () => setOrders(getStoredOrders());
    window.addEventListener("illuminance:orders-updated", handleOrdersUpdated);
    return () => window.removeEventListener("illuminance:orders-updated", handleOrdersUpdated);
  }, []);

  const pendingOrdersCount = orders.filter((o) => o.status === "Diproses" || o.status === "Menunggu Pembayaran").length;

  return (
    <div className="space-y-8">
      {/* 4 Cards Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-il-surface-2 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-il-ink-on-light/50 font-medium">
            Total Penjualan (Bulan Ini)
          </div>
          <div className="font-heading font-bold text-2xl text-il-accent mt-2">
            Rp 48.650.000
          </div>
          <div className="text-[11px] text-il-success font-semibold mt-2 flex items-center gap-1">
            <span>&uarr; 14.2%</span>
            <span className="text-il-ink-on-light/40 font-normal">vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-white border border-il-surface-2 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-il-ink-on-light/50 font-medium">Pesanan Masuk</div>
          <div className="font-heading font-bold text-2xl text-il-ink-on-light mt-2">
            38 Pesanan
          </div>
          <div className="text-[11px] text-il-accent font-semibold mt-2">
            {pendingOrdersCount} pesanan perlu diproses
          </div>
        </div>

        <div className="bg-white border border-il-surface-2 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-il-ink-on-light/50 font-medium">Katalog Aktif</div>
          <div className="font-heading font-bold text-2xl text-il-ink-on-light mt-2">
            {productCount} Produk
          </div>
          <div className="text-[11px] text-il-danger font-semibold mt-2">
            {lowStockCount} produk stok menipis
          </div>
        </div>

        <div className="bg-white border border-il-surface-2 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-il-ink-on-light/50 font-medium">Rating Kepuasan</div>
          <div className="font-heading font-bold text-2xl text-il-ink-on-light mt-2">
            4.9 / 5.0
          </div>
          <div className="text-[11px] text-il-ink-on-light/40 mt-2">
            Dari 142 ulasan terverifikasi
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: Pesanan Terbaru & Kategori Terlaris */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabel Pesanan Terbaru Ringkas (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-il-surface-2 rounded-2xl p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-semibold text-base text-il-ink-on-light">
                Pesanan Masuk Terbaru
              </h2>
              <p className="text-xs text-il-ink-on-light/50">
                Daftar transaksi pelanggan terakhir
              </p>
            </div>
            <Link
              href="/admin/pesanan"
              className="text-xs font-semibold text-il-accent hover:underline cursor-pointer"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-il-surface-2 text-il-ink-on-light/40 font-medium">
                  <th className="pb-3">No. Pesanan</th>
                  <th className="pb-3">Pelanggan</th>
                  <th className="pb-3">Produk</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-il-surface-2">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-il-light-bg/60 transition-colors">
                    <td className="py-3 font-mono font-semibold text-il-accent">
                      {order.id}
                    </td>
                    <td className="py-3 font-medium text-il-ink-on-light">
                      {order.customer}
                    </td>
                    <td className="py-3 text-il-ink-on-light/70 max-w-[160px] truncate">
                      {order.item}
                    </td>
                    <td className="py-3 font-semibold text-il-ink-on-light">
                      {order.total}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          order.status === "Selesai"
                            ? "bg-il-success/10 text-il-success border-il-success/20"
                            : order.status === "Dikirim"
                            ? "bg-il-accent/15 text-il-accent border-il-accent/30"
                            : "bg-il-surface-2 text-il-ink-on-light/70 border-il-surface-2"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribusi Kategori (1 col) */}
        <div className="bg-white border border-il-surface-2 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-semibold text-base text-il-ink-on-light mb-1">
              Kategori Terlaris
            </h2>
            <p className="text-xs text-il-ink-on-light/50 mb-5">
              Pangsa penjualan produk lampu Illuminance
            </p>

            <div className="space-y-4">
              {[
                { name: "Lampu Meja", pct: 38, count: "19 unit" },
                { name: "Lampu Gantung", pct: 32, count: "16 unit" },
                { name: "Lampu Lantai", pct: 18, count: "9 unit" },
                { name: "Lampu Dinding", pct: 12, count: "6 unit" },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-il-ink-on-light font-medium">{item.name}</span>
                    <span className="text-il-accent font-semibold">
                      {item.pct}% ({item.count})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-il-light-bg border border-il-surface-2 overflow-hidden">
                    <div
                      className="h-full bg-il-accent rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-il-surface-2 text-xs text-il-ink-on-light/50 flex justify-between items-center">
            <span>Katalog siap diekspansi</span>
            <Link
              href="/admin/produk"
              className="text-il-accent font-semibold hover:underline"
            >
              Buka Katalog &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
