import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/ui/Providers";
import { IsDemo } from "@/components/ui/IsDemo";

// TODO: Ganti title & description dengan informasi brand Illuminance yang sebenarnya
export const metadata: Metadata = {
  title: "Illuminance — Koleksi Lampu Premium",
  description:
    "Toko lampu premium pilihan: Lampu Meja, Gantung, Lantai, Dinding. Temukan lampu yang menghidupkan suasana ruangan Anda.",
};

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-dvh flex flex-col font-body antialiased">
        <Providers>
          {children}
          <IsDemo />
        </Providers>
      </body>
    </html>
  );
}
