"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    // TODO: Integrasikan dengan email marketing platform (mis. Mailchimp, Klaviyo)
    setSubmitted(true);
    setError("");
  };

  return (
    <section className="bg-il-dark-bg py-20 md:py-28 relative overflow-hidden">
      {/* il-glow dekoratif */}
      <div
        className="il-glow"
        aria-hidden="true"
        style={{
          width: "600px",
          height: "400px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 max-w-[640px] mx-auto px-4 md:px-6 text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-il-accent mb-6">
          Newsletter
        </span>

        <h2 className="font-heading font-semibold text-3xl md:text-4xl text-il-ink-on-dark tracking-[-0.02em] mb-4">
          Inspirasi cahaya langsung
          <br />
          ke kotak masuk Anda
        </h2>

        <p className="font-body text-il-ink-on-dark/60 mb-8">
          Tips dekorasi, produk baru, dan penawaran eksklusif untuk pelanggan setia kami.
          {/* TODO: Ganti dengan value proposition newsletter yang sesungguhnya */}
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-il-success bg-il-success/10 border border-il-success/20 rounded-full px-6 py-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-body font-medium text-sm">Terima kasih! Anda sudah terdaftar.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Alamat email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Masukkan email Anda"
                  autoComplete="email"
                  required
                  aria-describedby={error ? "newsletter-error" : undefined}
                  aria-invalid={!!error}
                  className={`w-full px-5 py-3.5 rounded-full bg-il-dark-surface border text-il-ink-on-dark placeholder-il-ink-on-dark/30 font-body text-sm outline-none focus:border-il-accent transition-colors ${
                    error ? "border-il-danger" : "border-il-dark-border"
                  }`}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-full bg-il-accent text-il-dark-bg font-heading font-semibold text-sm hover:bg-il-accent-dark transition-colors whitespace-nowrap cursor-pointer"
              >
                Daftar Sekarang
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-2 text-xs text-il-danger text-left pl-5">
                {error}
              </p>
            )}
            <p className="font-body text-xs text-il-ink-on-dark/30 mt-3">
              Tidak ada spam. Berhenti berlangganan kapan saja.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
