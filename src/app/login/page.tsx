"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "";
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Mohon masukkan email dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simpan session mock
      const isUserAdmin = email.toLowerCase().includes("admin");
      const user = {
        name: isUserAdmin ? "Administrator Illuminance" : "Aris Prasetyo",
        email: email,
        role: isUserAdmin ? "admin" : "customer",
        joinedDate: "Maret 2024",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("illuminance_user", JSON.stringify(user));
        document.cookie = `illuminance_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
      }

      showToast({
        title: "Berhasil Masuk",
        description: `Selamat datang kembali, ${user.name}!`,
        type: "success",
      });

      if (redirectTarget) {
        router.push(redirectTarget);
      } else if (isUserAdmin) {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    }, 600);
  };

  const handleQuickLogin = (role: "customer" | "admin") => {
    const user =
      role === "admin"
        ? {
            name: "Admin Illuminance",
            email: "admin@illuminance.id",
            role: "admin",
            joinedDate: "Januari 2024",
          }
        : {
            name: "Aris Prasetyo",
            email: "aris.prasetyo@email.com",
            role: "customer",
            joinedDate: "Maret 2024",
          };

    if (typeof window !== "undefined") {
      localStorage.setItem("illuminance_user", JSON.stringify(user));
      document.cookie = `illuminance_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
    }

    showToast({
      title: "Login Demo Berhasil",
      description: `Masuk sebagai ${user.name} (${role === "admin" ? "Admin" : "Pelanggan"})`,
      type: "success",
    });

    if (redirectTarget) {
      router.push(redirectTarget);
    } else if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-il-surface-2 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-il-ink-on-light">
          Masuk ke Akun
        </h1>
        <p className="font-body text-xs text-il-ink-on-light/60 mt-1">
          Akses riwayat pesanan, alamat tersimpan, dan wishlist Anda.
        </p>
      </div>

      {redirectTarget && redirectTarget.startsWith("/admin") && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-amber-600">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Halaman admin membutuhkan akses dengan akun Administrator.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-il-danger/10 border border-il-danger/20 text-il-danger text-xs flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-body text-xs font-medium text-il-ink-on-light/80 mb-1.5">
            Alamat Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
            className="w-full px-4 py-3 rounded-xl bg-il-light-bg border border-il-surface-2 text-sm text-il-ink-on-light placeholder-il-ink-on-light/40 focus:outline-none focus:border-il-accent transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-body text-xs font-medium text-il-ink-on-light/80">
              Kata Sandi
            </label>
            <button
              type="button"
              onClick={() =>
                showToast({
                  title: "Reset Kata Sandi",
                  description: "Instruksi reset kata sandi telah dikirim ke email demo.",
                  type: "info",
                })
              }
              className="text-[11px] text-il-accent hover:underline cursor-pointer"
            >
              Lupa sandi?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-4 pr-11 py-3 rounded-xl bg-il-light-bg border border-il-surface-2 text-sm text-il-ink-on-light placeholder-il-ink-on-light/40 focus:outline-none focus:border-il-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-il-ink-on-light/40 hover:text-il-ink-on-light transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-il-surface-2 accent-il-accent cursor-pointer"
          />
          <label htmlFor="remember" className="font-body text-xs text-il-ink-on-light/70 cursor-pointer select-none">
            Ingat saya di perangkat ini
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-sm hover:bg-il-accent-dark transition-colors duration-200 cursor-pointer shadow-md disabled:opacity-50 mt-2"
        >
          {isLoading ? "Memproses..." : "Masuk ke Akun"}
        </button>
      </form>

      {/* Demo Fast Login Buttons */}
      <div className="mt-6 pt-5 border-t border-il-surface-2">
        <p className="text-[11px] text-center text-il-ink-on-light/40 uppercase tracking-[0.15em] mb-3">
          Opsi Akses Instan (Demo)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin("customer")}
            className="px-3 py-2.5 rounded-xl border border-il-surface-2 bg-il-light-bg text-xs font-medium text-il-ink-on-light hover:border-il-accent hover:text-il-accent transition-colors cursor-pointer text-center"
          >
            Demo Pelanggan
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("admin")}
            className="px-3 py-2.5 rounded-xl border border-il-accent/40 bg-il-accent/10 text-xs font-medium text-il-accent hover:bg-il-accent hover:text-il-dark-bg transition-colors cursor-pointer text-center"
          >
            Demo Admin &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-il-light-bg text-il-ink-on-light flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="font-heading font-bold text-2xl tracking-tight text-il-ink-on-light hover:text-il-accent transition-colors"
        >
          illuminance
        </Link>
        <p className="font-body text-xs text-il-ink-on-light/50 mt-1 uppercase tracking-[0.2em]">
          Eksklusif Ruang & Cahaya
        </p>
      </div>

      <Suspense fallback={<div className="text-xs text-il-ink-on-light/50">Memuat formulir masuk...</div>}>
        <LoginForm />
      </Suspense>

      {/* Footer link */}
      <div className="mt-8 text-center text-xs text-il-ink-on-light/40 flex gap-4">
        <Link href="/" className="hover:text-il-accent transition-colors">
          &larr; Kembali ke Beranda
        </Link>
        <span>&bull;</span>
        <Link href="/produk" className="hover:text-il-accent transition-colors">
          Katalog Lampu
        </Link>
      </div>
    </div>
  );
}
