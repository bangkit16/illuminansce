"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { useToast } from "@/context/ToastContext";

type Tab = "pesanan" | "alamat" | "pengaturan";

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("pesanan");
  const [user, setUser] = useState({
    name: "Aris Prasetyo",
    email: "aris.prasetyo@email.com",
    phone: "0812-3456-7890",
    role: "customer",
    joinedDate: "Maret 2024",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("illuminance_user");
      if (stored) {
        try {
          setUser((prev) => ({ ...prev, ...JSON.parse(stored) }));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("illuminance_user");
    }
    showToast({
      title: "Berhasil Keluar",
      description: "Anda telah keluar dari akun Illuminance.",
      type: "info",
    });
    router.push("/");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("illuminance_user", JSON.stringify(user));
    }
    showToast({
      title: "Profil Diperbarui",
      description: "Perubahan informasi akun berhasil disimpan.",
      type: "success",
    });
  };

  return (
    <div className="bg-il-light-bg text-il-ink-on-light min-h-dvh flex flex-col">
      <Navbar variant="light" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-16 flex-1 w-full">
        {/* Profile Card Header (Light Theme) */}
        <div className="bg-white border border-il-surface-2 rounded-3xl p-6 md:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar Initial */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-il-accent/15 border border-il-accent/30 text-il-accent font-heading font-bold text-2xl md:text-3xl flex items-center justify-center shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading font-bold text-2xl md:text-3xl text-il-ink-on-light">
                    {user.name}
                  </h1>
                  {user.role === "admin" ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-il-accent text-il-dark-bg uppercase tracking-wider">
                      Administrator
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-il-accent/10 text-il-accent border border-il-accent/20">
                      Member Gold
                    </span>
                  )}
                </div>
                <p className="font-body text-xs md:text-sm text-il-ink-on-light/60 mt-1">
                  {user.email} &bull; Bergabung {user.joinedDate}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-full bg-il-accent text-il-dark-bg text-xs font-semibold hover:bg-il-accent-dark transition-colors shadow-xs"
                >
                  Buka Dashboard Admin &rarr;
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-full border border-il-surface-2 text-il-ink-on-light/70 hover:text-il-danger hover:border-il-danger/30 text-xs font-semibold transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-il-surface-2 mb-8 gap-2 overflow-x-auto">
          {[
            { id: "pesanan", label: "Pesanan Saya (2)" },
            { id: "alamat", label: "Alamat Tersimpan (2)" },
            { id: "pengaturan", label: "Pengaturan Akun" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-il-accent text-il-accent font-semibold"
                  : "border-transparent text-il-ink-on-light/50 hover:text-il-ink-on-light"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB CONTENT ─── */}

        {/* 1. Riwayat Pesanan */}
        {activeTab === "pesanan" && (
          <div className="space-y-4">
            {/* Pesanan 1 */}
            <div className="bg-white border border-il-surface-2 rounded-2xl p-5 md:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-il-surface-2 gap-2">
                <div>
                  <span className="font-mono text-xs text-il-ink-on-light/40">No. Pesanan:</span>
                  <span className="font-mono text-xs font-semibold text-il-accent ml-1.5">
                    #ILM-2024-8841
                  </span>
                  <span className="text-xs text-il-ink-on-light/40 ml-3">
                    28 September 2024
                  </span>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-il-accent/15 text-il-accent border border-il-accent/30">
                  Sedang Dikirim
                </span>
              </div>

              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-il-light-bg border border-il-surface-2 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/products/meja-aruna-off.jpg"
                      alt="Lampu Meja Aruna"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base text-il-ink-on-light">
                      Lampu Meja Aruna
                    </h3>
                    <p className="font-body text-xs text-il-ink-on-light/50 mt-0.5">
                      Varian: Kuningan Matte &bull; Qty: 1
                    </p>
                    <p className="font-heading font-semibold text-sm text-il-accent mt-1">
                      Rp 1.450.000
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 text-right">
                  <button
                    onClick={() =>
                      showToast({
                        title: "Pelacakan Pengiriman",
                        description: "No. Resi JNE: JNE-884120938. Paket sedang dalam perjalanan ke Surabaya.",
                        type: "info",
                      })
                    }
                    className="px-4 py-2 rounded-full border border-il-surface-2 text-xs font-semibold text-il-ink-on-light hover:border-il-accent hover:text-il-accent transition-colors cursor-pointer"
                  >
                    Lacak Pengiriman
                  </button>
                  <Link
                    href="/produk/lampu-meja-aruna"
                    className="text-xs text-il-ink-on-light/40 hover:text-il-accent transition-colors"
                  >
                    Beli Lagi &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Pesanan 2 */}
            <div className="bg-white border border-il-surface-2 rounded-2xl p-5 md:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-il-surface-2 gap-2">
                <div>
                  <span className="font-mono text-xs text-il-ink-on-light/40">No. Pesanan:</span>
                  <span className="font-mono text-xs font-semibold text-il-accent ml-1.5">
                    #ILM-2024-7102
                  </span>
                  <span className="text-xs text-il-ink-on-light/40 ml-3">
                    14 Agustus 2024
                  </span>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-il-success/10 text-il-success border border-il-success/20">
                  Pesanan Selesai
                </span>
              </div>

              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-il-light-bg border border-il-surface-2 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/products/gantung-selaras-off.jpg"
                      alt="Lampu Gantung Selaras"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base text-il-ink-on-light">
                      Lampu Gantung Selaras
                    </h3>
                    <p className="font-body text-xs text-il-ink-on-light/50 mt-0.5">
                      Varian: Tembaga Antik &bull; Qty: 1
                    </p>
                    <p className="font-heading font-semibold text-sm text-il-accent mt-1">
                      Rp 2.150.000
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 text-right">
                  <Link
                    href="/produk/lampu-gantung-selaras"
                    className="px-4 py-2 rounded-full border border-il-surface-2 text-xs font-semibold text-il-ink-on-light hover:border-il-accent hover:text-il-accent transition-colors"
                  >
                    Beli Lagi
                  </Link>
                  <button
                    onClick={() =>
                      showToast({
                        title: "Faktur Pembelian",
                        description: "Faktur digital #ILM-2024-7102 telah diunduh.",
                        type: "success",
                      })
                    }
                    className="text-xs text-il-ink-on-light/40 hover:text-il-accent transition-colors cursor-pointer"
                  >
                    Unduh Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Alamat Tersimpan */}
        {activeTab === "alamat" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-il-accent/40 rounded-2xl p-5 relative shadow-xs">
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-il-accent text-il-dark-bg uppercase">
                Alamat Utama
              </span>
              <h3 className="font-heading font-semibold text-base text-il-ink-on-light mb-1">
                Rumah (Utama)
              </h3>
              <p className="font-body text-xs text-il-ink-on-light/60 font-medium mb-2">
                Penerima: {user.name} ({user.phone})
              </p>
              <p className="font-body text-xs text-il-ink-on-light/70 leading-relaxed">
                Jl. Cendrawasih No. 42, RT 03 / RW 05, Kelurahan Dharmahusada,
                Kecamatan Gubeng, Surabaya, Jawa Timur 60285
              </p>
              <div className="mt-4 pt-4 border-t border-il-surface-2 flex gap-3">
                <button
                  onClick={() =>
                    showToast({
                      title: "Ubah Alamat",
                      description: "Fitur edit alamat demo dibuka.",
                      type: "info",
                    })
                  }
                  className="text-xs text-il-accent font-semibold hover:underline cursor-pointer"
                >
                  Ubah Alamat
                </button>
              </div>
            </div>

            <div className="bg-white border border-il-surface-2 rounded-2xl p-5 relative shadow-xs">
              <h3 className="font-heading font-semibold text-base text-il-ink-on-light mb-1">
                Kantor / Studio
              </h3>
              <p className="font-body text-xs text-il-ink-on-light/60 font-medium mb-2">
                Penerima: {user.name} ({user.phone})
              </p>
              <p className="font-body text-xs text-il-ink-on-light/70 leading-relaxed">
                Gedung Graha Kreatif Lt. 3, Jl. Basuki Rahmat No. 12,
                Tegalsari, Surabaya, Jawa Timur 60261
              </p>
              <div className="mt-4 pt-4 border-t border-il-surface-2 flex gap-3">
                <button
                  onClick={() =>
                    showToast({
                      title: "Jadikan Alamat Utama",
                      description: "Alamat kantor dijadikan alamat pengiriman utama.",
                      type: "success",
                    })
                  }
                  className="text-xs text-il-ink-on-light/60 hover:text-il-accent font-semibold transition-colors cursor-pointer"
                >
                  Jadikan Utama
                </button>
                <button
                  onClick={() =>
                    showToast({
                      title: "Ubah Alamat",
                      description: "Fitur edit alamat demo dibuka.",
                      type: "info",
                    })
                  }
                  className="text-xs text-il-accent font-semibold hover:underline cursor-pointer"
                >
                  Ubah
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Pengaturan Akun */}
        {activeTab === "pengaturan" && (
          <div className="max-w-2xl bg-white border border-il-surface-2 rounded-2xl p-6 md:p-8 shadow-xs">
            <h3 className="font-heading font-semibold text-lg text-il-ink-on-light mb-4">
              Informasi Pribadi
            </h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-il-ink-on-light/70 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-sm text-il-ink-on-light focus:outline-none focus:border-il-accent transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-il-ink-on-light/70 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-sm text-il-ink-on-light focus:outline-none focus:border-il-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-il-ink-on-light/70 mb-1">
                    No. Handphone
                  </label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-il-light-bg border border-il-surface-2 text-sm text-il-ink-on-light focus:outline-none focus:border-il-accent transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-xs hover:bg-il-accent-dark transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer minimal light */}
      <footer className="bg-white border-t border-il-surface-2 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-il-ink-on-light/40">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Illuminance. Hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-il-accent transition-colors">
              Beranda
            </Link>
            <Link href="/produk" className="hover:text-il-accent transition-colors">
              Katalog
            </Link>
            <Link href="/admin" className="hover:text-il-accent transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
