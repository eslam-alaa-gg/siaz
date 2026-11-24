import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-28 pt-10 md:px-12 md:pt-16">
      <p className="eyebrow mb-3">Secure checkout</p>
      <h1 className="mb-12 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em]">
        Checkout
      </h1>
      <CheckoutForm />
    </section>
  );
}
