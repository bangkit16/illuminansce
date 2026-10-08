import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Masuk ke Akun — Illuminance",
  description: "Masuk ke akun pelanggan atau administrator Illuminance.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
