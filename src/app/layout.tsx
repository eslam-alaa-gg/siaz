import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Serif_Display, Manrope, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/cart-context";
import "./globals.css";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "SIAZ — Fashion beyond time", template: "%s — SIAZ" },
  description:
    "SIAZ is a contemporary fashion label. Considered essentials, outerwear and tailoring in a restrained palette.",
};

export const viewport: Viewport = { themeColor: "#F4F1EA" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${manrope.variable} ${dmSerif.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
