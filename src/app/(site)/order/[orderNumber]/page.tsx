import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Demo order" };

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return (
    <section className="mx-auto max-w-2xl px-6 pb-28 pt-16 text-center md:pt-24">
      <span className="mx-auto mb-8 grid h-14 w-14 place-items-center rounded-full border border-charcoal/30 text-2xl">✓</span>
      <p className="eyebrow mb-3">Demo reference · {orderNumber}</p>
      <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em]">
        Thanks for <span className="font-serif font-normal italic">trying SIAZ</span>.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-charcoal/65">
        This is a demonstration checkout. No payment was taken and this order was not saved or sent for fulfilment.
      </p>
      <Link href="/shop" className="btn mt-10">Continue shopping</Link>
    </section>
  );
}
