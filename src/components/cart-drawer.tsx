"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./cart-context";
import { CloseIcon, MinusIcon, PlusIcon } from "./icons";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, subtotal, cartOpen, setCartOpen, setQty, remove, count } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          key="cart"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-ivory sm:inset-y-3 sm:right-3 sm:rounded-[2rem]"
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <div>
                <h2 className="font-display text-2xl font-medium tracking-tight">Your bag</h2>
                <p className="text-xs text-muted">{count} {count === 1 ? "item" : "items"}</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
                className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/15 transition hover:bg-charcoal/[0.06] active:scale-90"
              >
                <CloseIcon />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="font-serif text-3xl italic">Your bag is empty</p>
                <p className="max-w-[26ch] text-sm text-muted">Pieces you add will wait for you here.</p>
                <Link href="/shop" onClick={() => setCartOpen(false)} className="btn">
                  Explore the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="mx-6 mb-3 rounded-2xl bg-stone/60 px-4 py-3">
                  <p className="text-xs text-charcoal/80">
                    {remaining > 0
                      ? `${formatPrice(remaining)} away from complimentary shipping`
                      : "You’ve unlocked complimentary shipping"}
                  </p>
                  <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-charcoal/10">
                    <motion.div
                      className="h-full rounded-full bg-charcoal"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <ul className="hide-scrollbar flex-1 space-y-4 overflow-y-auto px-6 pb-4">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={`${it.colorId}-${it.size}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="flex gap-4"
                      >
                        <Link
                          href={`/product/${it.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="relative h-28 w-[88px] shrink-0 overflow-hidden rounded-2xl bg-stone"
                        >
                          <Image src={it.image} alt={it.name} fill sizes="88px" className="object-cover" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <Link
                                href={`/product/${it.slug}`}
                                onClick={() => setCartOpen(false)}
                                className="text-sm font-semibold leading-snug"
                              >
                                {it.name}
                              </Link>
                              <span className="text-sm">{formatPrice(it.price * it.qty)}</span>
                            </div>
                            <p className="mt-1 text-xs text-muted">
                              {it.colorName} · Size {it.size}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-charcoal/15">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => setQty(it.colorId, it.size, it.qty - 1)}
                                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-charcoal/[0.06] active:scale-90"
                              >
                                <MinusIcon className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums">{it.qty}</span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => setQty(it.colorId, it.size, it.qty + 1)}
                                disabled={it.qty >= it.max}
                                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-charcoal/[0.06] active:scale-90 disabled:opacity-30"
                              >
                                <PlusIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(it.colorId, it.size)}
                              className="link-underline text-xs text-muted transition hover:text-charcoal"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-charcoal/10 px-6 pb-6 pt-5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-charcoal/70">Subtotal</span>
                    <span className="font-display text-xl font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="btn btn-strong w-full py-3.5"
                  >
                    Proceed to checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
