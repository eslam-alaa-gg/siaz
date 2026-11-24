"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-context";
import { formatPrice, shippingCost, FREE_SHIPPING_THRESHOLD } from "@/lib/format";

const COUNTRIES = ["United States", "Canada", "United Kingdom", "France", "Germany", "Italy", "Spain", "Netherlands", "Australia", "Japan"];

export function CheckoutForm() {
  const { items, subtotal, ready, clear, setQty, remove } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<"standard" | "express">("standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = shippingCost(subtotal, method);
  const total = subtotal + shipping;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: f.get("email"),
          firstName: f.get("firstName"),
          lastName: f.get("lastName"),
          address: f.get("address"),
          city: f.get("city"),
          postalCode: f.get("postalCode"),
          country: f.get("country"),
          shippingMethod: method,
          items: items.map((i) => ({ colorId: i.colorId, size: i.size, qty: i.qty })),
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Checkout failed");
      clear();
      router.push(`/order/${j.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (!ready) return <div className="min-h-[40vh]" />;

  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-[2rem] bg-stone/60 px-6 py-24 text-center">
        <p className="font-serif text-3xl italic">Your bag is empty</p>
        <p className="mb-6 mt-2 text-sm text-muted">Add a piece to begin checkout.</p>
        <Link href="/shop" className="btn">
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
      <div className="space-y-12">
        <fieldset className="space-y-3">
          <legend className="mb-4 font-display text-xl font-medium tracking-tight">Contact</legend>
          <input name="email" type="email" required placeholder="Email address" autoComplete="email" className="field" />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-4 font-display text-xl font-medium tracking-tight">Delivery</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="firstName" required placeholder="First name" autoComplete="given-name" className="field" />
            <input name="lastName" required placeholder="Last name" autoComplete="family-name" className="field" />
          </div>
          <input name="address" required placeholder="Address" autoComplete="street-address" className="field" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="city" required placeholder="City" autoComplete="address-level2" className="field" />
            <input name="postalCode" required placeholder="Postal code" autoComplete="postal-code" className="field" />
          </div>
          <select name="country" required defaultValue="United States" className="field" autoComplete="country-name">
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <legend className="mb-4 font-display text-xl font-medium tracking-tight">Shipping</legend>
          <div className="space-y-2">
            {(
              [
                ["standard", "Standard", "3–5 business days"],
                ["express", "Express", "1–2 business days"],
              ] as const
            ).map(([v, label, sub]) => (
              <label
                key={v}
                className={`flex cursor-pointer items-center justify-between rounded-full border px-6 py-4 transition ${
                  method === v ? "border-charcoal bg-charcoal/[0.04]" : "border-charcoal/15 hover:border-charcoal/40"
                }`}
              >
                <span className="flex items-center gap-4">
                  <input type="radio" name="shipping" checked={method === v} onChange={() => setMethod(v)} className="accent-charcoal" />
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-xs text-muted">{sub}</span>
                  </span>
                </span>
                <span className="text-sm">
                  {shippingCost(subtotal, v) === 0 ? "Free" : formatPrice(shippingCost(subtotal, v))}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-display text-xl font-medium tracking-tight">Payment</legend>
          <p className="rounded-2xl bg-stone/60 px-5 py-4 text-sm text-charcoal/70">
            This is a demo store — no payment is taken. Your order will be created and confirmed instantly.
          </p>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[2rem] bg-soft p-6 md:p-8">
          <h2 className="mb-6 font-display text-xl font-medium tracking-tight">Order summary</h2>
          <ul className="space-y-5">
            {items.map((it) => (
              <li key={`${it.colorId}-${it.size}`} className="flex gap-4">
                <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-xl bg-stone">
                  <Image src={it.image} alt={it.name} fill sizes="72px" className="object-cover object-top" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold leading-snug">{it.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {it.colorName} · {it.size}
                      </p>
                    </div>
                    <p className="text-sm">{formatPrice(it.price * it.qty)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-charcoal/15 text-sm">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(it.colorId, it.size, it.qty - 1)} className="h-7 w-7 rounded-full transition hover:bg-charcoal/[0.06] active:scale-90">
                        −
                      </button>
                      <span className="w-5 text-center tabular-nums">{it.qty}</span>
                      <button type="button" aria-label="Increase quantity" disabled={it.qty >= it.max} onClick={() => setQty(it.colorId, it.size, it.qty + 1)} className="h-7 w-7 rounded-full transition hover:bg-charcoal/[0.06] active:scale-90 disabled:opacity-30">
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => remove(it.colorId, it.size)} className="link-underline text-xs text-muted hover:text-charcoal">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-7 space-y-3 border-t border-charcoal/10 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/65">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/65">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            {method === "standard" && subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-muted">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for complimentary shipping.
              </p>
            )}
            <div className="flex items-baseline justify-between border-t border-charcoal/10 pt-4">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display text-2xl font-medium">{formatPrice(total)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn btn-strong mt-6 w-full py-4 text-[13px]">
            {loading ? "Placing order…" : `Place order — ${formatPrice(total)}`}
          </button>
        </div>
      </aside>
    </form>
  );
}
