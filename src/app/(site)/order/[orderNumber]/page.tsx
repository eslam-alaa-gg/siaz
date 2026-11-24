import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order confirmed" };

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <section className="mx-auto max-w-3xl px-6 pb-28 pt-10 md:pt-16">
      <div className="text-center">
        <span className="mx-auto mb-8 grid h-14 w-14 place-items-center rounded-full border border-charcoal/30">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="eyebrow mb-3">Order {order.orderNumber}</p>
        <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em]">
          Thank you, <span className="font-serif font-normal italic">{order.firstName}</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-charcoal/65">
          Your order is confirmed. A confirmation will be sent to <strong className="font-semibold">{order.email}</strong>.
        </p>
      </div>

      <div className="mt-14 rounded-[2rem] bg-soft p-6 md:p-10">
        <ul className="space-y-5">
          {order.items.map((it) => (
            <li key={it.id} className="flex gap-4">
              <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-xl bg-stone">
                <Image src={it.image} alt={it.name} fill sizes="72px" className="object-cover object-top" />
              </div>
              <div className="flex flex-1 justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{it.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {it.colorName} · Size {it.size} · Qty {it.quantity}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(it.unitPrice * it.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-8 space-y-3 border-t border-charcoal/10 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-charcoal/65">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/65">Shipping ({order.shippingMethod})</dt>
            <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-charcoal/10 pt-4">
            <dt className="font-semibold">Total</dt>
            <dd className="font-display text-2xl font-medium">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-8 grid gap-6 border-t border-charcoal/10 pt-6 text-sm sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Shipping to</p>
            <p className="leading-relaxed text-charcoal/75">
              {order.firstName} {order.lastName}
              <br />
              {order.address}
              <br />
              {order.postalCode} {order.city}
              <br />
              {order.country}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Status</p>
            <p className="capitalize text-charcoal/75">{order.status}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/shop" className="btn">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
