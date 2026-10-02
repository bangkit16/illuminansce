"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/lib/orders-placeholder";
import { getStoredOrders, updateOrderStatus } from "@/lib/orders-storage";
import { useToast } from "@/context/ToastContext";

export default function AdminPesananPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | OrderStatus>("all");

  const syncOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    syncOrders();
    const handleUpdate = () => syncOrders();
    window.addEventListener("illuminance:orders-updated", handleUpdate);
    return () => window.removeEventListener("illuminance:orders-updated", handleUpdate);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    updateOrderStatus(id, newStatus);
    syncOrders();
    showToast({
      title: "Status Pesanan Diperbarui",
      description: `Pesanan ${id} kini berstatus: ${newStatus}`,
      type: "success",
    });
  };

  const filteredOrders = orders.filter((o) => {
    return orderStatusFilter === "all" || o.status === orderStatusFilter;
  });

  return (
    <div className="bg-white border border-il-surface-2 rounded-2xl p-5 md:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-semibold text-lg text-il-ink-on-light">
            Daftar Lengkap Pesanan Pelanggan
          </h2>
          <p className="text-xs text-il-ink-on-light/50 mt-0.5">
            Pantau status verifikasi, packing, dan pengiriman ekspedisi
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-il-light-bg rounded-xl border border-il-surface-2 self-start sm:self-auto overflow-x-auto">
          {(["all", "Menunggu Pembayaran", "Diproses", "Dikirim", "Selesai", "Batal"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setOrderStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                orderStatusFilter === st
                  ? "bg-white text-il-ink-on-light font-semibold shadow-xs"
                  : "text-il-ink-on-light/60 hover:text-il-ink-on-light"
              }`}
            >
              {st === "all" ? "Semua Status" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Pesanan Lengkap */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-il-surface-2 text-il-ink-on-light/50 font-medium">
              <th className="pb-3">No. Pesanan</th>
              <th className="pb-3">Tanggal</th>
              <th className="pb-3">Pelanggan</th>
              <th className="pb-3">Lampu Dipesan</th>
              <th className="pb-3">Metode Bayar</th>
              <th className="pb-3">Nilai Transaksi</th>
              <th className="pb-3">Status Saat Ini</th>
              <th className="pb-3 text-right">Ubah Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-il-surface-2">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-il-light-bg/60 transition-colors">
                <td className="py-4 font-mono font-semibold text-il-accent">
                  {order.id}
                </td>
                <td className="py-4 text-il-ink-on-light/60 whitespace-nowrap">
                  {order.date}
                </td>
                <td className="py-4">
                  <p className="font-semibold text-il-ink-on-light">{order.customer}</p>
                  <p className="text-[10px] text-il-ink-on-light/40">{order.email}</p>
                </td>
                <td className="py-4 text-il-ink-on-light/80 font-medium max-w-[200px] truncate">
                  {order.item}
                </td>
                <td className="py-4 text-il-ink-on-light/70 text-[11px]">
                  {order.paymentMethod || "Midtrans / Transfer"}
                </td>
                <td className="py-4 font-heading font-semibold text-il-ink-on-light">
                  {order.total}
                </td>
                <td className="py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border whitespace-nowrap ${
                      order.status === "Selesai"
                        ? "bg-il-success/10 text-il-success border-il-success/30"
                        : order.status === "Dikirim"
                        ? "bg-il-accent/15 text-il-accent border-il-accent/30"
                        : order.status === "Menunggu Pembayaran"
                        ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                        : order.status === "Batal"
                        ? "bg-il-danger/10 text-il-danger border-il-danger/30"
                        : "bg-il-surface-2 text-il-ink-on-light/70 border-il-surface-2"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="px-2.5 py-1.5 rounded-lg border border-il-surface-2 bg-il-light-bg text-[11px] font-medium text-il-ink-on-light outline-none cursor-pointer focus:border-il-accent"
                  >
                    <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Batal">Batal</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-xs text-il-ink-on-light/50">
            Tidak ada pesanan dengan status &quot;{orderStatusFilter}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
