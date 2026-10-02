"use client";

/**
 * LitStateImage — Komponen gambar crossfade mati↔menyala
 *
 * Elemen pembeda visual utama brand Illuminance.
 * Crossfade mulus antara foto produk "mati" dan "menyala"
 * via transition-opacity, bukan ganti src abrupt.
 *
 * Dipakai di:
 *   - ProductCard (trigger: hover)
 *   - DetailProduk Gallery (trigger: hover + toggle eksplisit "☀ Lihat saat menyala")
 */

import { useState, useCallback } from "react";

type LitStateImageProps = {
  /** Foto produk kondisi MATI (default) */
  imageOff: string;
  /** Foto produk kondisi MENYALA */
  imageOn: string;
  /** Alt text untuk aksesibilitas — deskripsikan produk, bukan state */
  alt: string;
  /** Mode trigger: 'hover' atau 'toggle' atau 'both' */
  triggerMode?: "hover" | "toggle" | "both";
  /** Kelas CSS tambahan untuk wrapper */
  className?: string;
  /** Aspect ratio wrapper, default aspect-[3/4] */
  aspectClass?: string;
  /** Jika true, tampilkan tombol toggle "☀ Lihat saat menyala" */
  showToggleButton?: boolean;
  /** State awal — default false (mati) */
  initialLit?: boolean;
};

export function LitStateImage({
  imageOff,
  imageOn,
  alt,
  triggerMode = "hover",
  className = "",
  aspectClass = "aspect-[3/4]",
  showToggleButton = false,
  initialLit = false,
}: LitStateImageProps) {
  const [isLit, setIsLit] = useState(initialLit);
  const [isHovered, setIsHovered] = useState(false);

  // Tentukan apakah tampilkan gambar menyala
  const showLit =
    isLit ||
    (isHovered && (triggerMode === "hover" || triggerMode === "both"));

  const handleMouseEnter = useCallback(() => {
    if (triggerMode === "hover" || triggerMode === "both") setIsHovered(true);
  }, [triggerMode]);

  const handleMouseLeave = useCallback(() => {
    if (triggerMode === "hover" || triggerMode === "both") setIsHovered(false);
  }, [triggerMode]);

  const handleToggle = useCallback(() => {
    if (triggerMode === "toggle" || triggerMode === "both") {
      setIsLit((prev) => !prev);
    }
  }, [triggerMode]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${aspectClass} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gambar MATI — selalu ada di DOM */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageOff}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: showLit ? 0 : 1 }}
        loading="lazy"
      />

      {/* Gambar MENYALA — crossfade */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageOn}
        alt={`${alt} — menyala`}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: showLit ? 1 : 0 }}
        loading="lazy"
      />

      {/* Glow ambient saat menyala */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: showLit ? 1 : 0,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(227,163,77,0.18) 0%, transparent 65%)",
        }}
      />

      {/* Tombol toggle eksplisit — untuk aksesibilitas keyboard & touch */}
      {showToggleButton && (
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={isLit}
          aria-label={isLit ? "Tampilkan produk mati" : "Lihat saat menyala"}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-200 cursor-pointer select-none"
          style={{
            backgroundColor: isLit
              ? "rgba(227,163,77,0.9)"
              : "rgba(20,18,15,0.75)",
            borderColor: isLit
              ? "rgba(227,163,77,0.6)"
              : "rgba(246,241,231,0.2)",
            color: isLit ? "#14120F" : "#F6F1E7",
          }}
        >
          <span aria-hidden="true">{isLit ? "●" : "☀"}</span>
          {isLit ? "Matikan" : "Lihat saat menyala"}
        </button>
      )}
    </div>
  );
}
