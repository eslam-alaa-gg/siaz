"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./cart-context";
import { MinusIcon, PlusIcon } from "./icons";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/format";
import { SIZES } from "@/lib/collections";

type Color = { id: number; name: string; hex: string; image: string; stock: Record<string, number> };
type P = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  material: string;
  colors: Color[];
};

export function ProductDetail({ product }: { product: P }) {
  const [ci, setCi] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const { add, setCartOpen, items } = useCart();

  const color = product.colors[ci];
  const fullFrameImage = ["winter-layered-look", "heritage-puffer-jacket", "winter-wool-overcoat"].includes(product.slug);
  const colorTotal = SIZES.reduce((a, s) => a + (color.stock[s] ?? 0), 0);
  const available = size ? (color.stock[size] ?? 0) : 0;
  const inBag = size ? (items.find((i) => i.colorId === color.id && i.size === size)?.qty ?? 0) : 0;
  const canAdd = available - inBag;

  function pickColor(i: number) {
    setCi(i);
    setError(false);
    setAdded(false);
    if (size && (product.colors[i].stock[size] ?? 0) <= 0) setSize(null);
    setQty(1);
  }

  function pickSize(s: string) {
    setSize(s);
    setError(false);
    setAdded(false);
    setQty((q) => Math.min(q, Math.max(1, color.stock[s] ?? 1)));
  }

  function addToBag() {
    if (!size) {
      setError(true);
      return;
    }
    if (canAdd <= 0) return;
    add(
      {
        colorId: color.id,
        size,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        colorName: color.name,
        image: color.image,
        price: product.price,
        max: available,
      },
      Math.min(qty, canAdd),
    );
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2200);
  }

  let stockLine: { text: string; tone: "ok" | "low" | "out" };
  if (colorTotal === 0) stockLine = { text: "Sold out in this colour", tone: "out" };
  else if (!size) stockLine = { text: "In stock — select a size", tone: "ok" };
  else if (available <= 0) stockLine = { text: "Sold out in this size", tone: "out" };
  else if (available <= 3) stockLine = { text: `Only ${available} left in size ${size}`, tone: "low" };
  else stockLine = { text: `In stock in size ${size}`, tone: "ok" };

  return (
    <div className="grid gap-8 md:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      {/* Image */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[640px] overflow-hidden rounded-[1.8rem] bg-stone lg:max-w-none">
          <AnimatePresence initial={false}>
            <motion.div
              key={color.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.15 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={color.image}
                alt={`${product.name} in ${color.name}, front view`}
                fill
                priority
                sizes="(min-width:1024px) 55vw, 100vw"
                className={fullFrameImage ? "object-contain p-5 md:p-8" : "object-cover object-top"}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Info */}
      <div className="lg:py-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
          <Link href="/shop" className="hover:text-charcoal">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-charcoal">
            {product.categoryLabel}
          </Link>
        </nav>

        <h1 className="font-display text-[clamp(2rem,4.2vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          {product.name}
        </h1>
        <p className="mt-2 font-serif text-lg italic text-muted">{product.tagline}</p>
        <p className="mt-5 font-display text-2xl">{formatPrice(product.price)}</p>

        <div className="mt-9">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-[13px] font-semibold">
              Colour <span className="ml-1 font-normal text-muted">{color.name}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Colour">
            {product.colors.map((c, i) => (
              <button
                key={c.id}
                role="radio"
                aria-checked={i === ci}
                aria-label={c.name}
                title={c.name}
                onClick={() => pickColor(i)}
                className={`h-10 w-10 rounded-full border p-[3px] transition duration-300 active:scale-90 ${
                  i === ci ? "border-charcoal" : "border-charcoal/15 hover:border-charcoal/50"
                }`}
              >
                <span className="block h-full w-full rounded-full border border-charcoal/10" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-[13px] font-semibold">Size</p>
            <AnimatePresence>
              {error && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-700"
                >
                  Please select a size
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Size">
            {SIZES.map((s) => {
              const out = (color.stock[s] ?? 0) <= 0;
              const active = size === s;
              return (
                <button
                  key={s}
                  role="radio"
                  aria-checked={active}
                  disabled={out}
                  onClick={() => pickSize(s)}
                  className={`h-12 rounded-full border text-[13px] font-semibold transition duration-300 active:scale-95 ${
                    active
                      ? "border-charcoal bg-charcoal text-ivory"
                      : out
                        ? "border-charcoal/10 text-muted/60 line-through"
                        : "border-charcoal/20 hover:border-charcoal/70 hover:bg-charcoal/[0.04]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <p
            className={`mt-3 flex items-center gap-2 text-xs ${
              stockLine.tone === "out" ? "text-red-700" : stockLine.tone === "low" ? "text-amber-700" : "text-charcoal/60"
            }`}
            aria-live="polite"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stockLine.tone === "out" ? "bg-red-600" : stockLine.tone === "low" ? "bg-amber-500" : "bg-emerald-600"
              }`}
            />
            {stockLine.text}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex h-[52px] shrink-0 items-center justify-between rounded-full border border-charcoal/20 px-1.5 sm:w-36">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-charcoal/[0.06] active:scale-90"
            >
              <MinusIcon />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(Math.max(1, canAdd || available || 1), q + 1))}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-charcoal/[0.06] active:scale-90"
            >
              <PlusIcon />
            </button>
          </div>
          <button
            onClick={addToBag}
            disabled={colorTotal === 0 || (!!size && canAdd <= 0)}
            className="btn btn-strong h-[52px] flex-1 text-[13px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "added" : colorTotal === 0 || (size && canAdd <= 0) ? "out" : "add"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {added
                  ? "Added to bag ✓"
                  : colorTotal === 0
                    ? "Sold out"
                    : size && canAdd <= 0
                      ? available <= 0
                        ? "Sold out"
                        : "Maximum in bag"
                      : `Add to bag — ${formatPrice(product.price * qty)}`}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <div className="mt-10 divide-y divide-charcoal/10 border-y border-charcoal/10">
          <Accordion title="Description" defaultOpen>
            <p>{product.description}</p>
          </Accordion>
          <Accordion title="Materials & care">
            <p>{product.material}</p>
          </Accordion>
          <Accordion title="Shipping & returns">
            <p>
              Complimentary standard shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}. Express delivery is
              available at checkout. Returns accepted within 30 days in original condition.
            </p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left text-[13px] font-semibold"
      >
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <PlusIcon />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-[1.8] text-charcoal/70">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
