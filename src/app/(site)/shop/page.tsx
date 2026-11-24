import type { Metadata } from "next";
import { ShopView, type ShopParams } from "@/components/shop-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopParams> }) {
  return <ShopView params={await searchParams} />;
}
