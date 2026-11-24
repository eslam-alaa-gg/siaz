import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchOverlay } from "@/components/search-overlay";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-[4.75rem] md:pt-[5.5rem]">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
