"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./cart-context";
import { PlusIcon } from "./icons";
import { formatPrice } from "@/lib/format";
import { SIZES } from "@/lib/collections";

export type CardProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  colors: { id: number; name: string; hex: string; image: string; stock: Record<string, number> }[];
};

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw",
}: {
  product: CardProduct;
  priority?: boolean;
  sizes?: string;
}) {
  const [ci, setCi] = useState(0);
  const [quick, setQuick] = useState(false);
  const { add, setCartOpen } = useCart();
  const color = product.colors[ci];
  const fullFrameImage = ["winter-layered-look", "heritage-puffer-jacket", "winter-wool-overcoat"].includes(product.slug);
  const soldOut = Object.values(color.stock).every((q) => q <= 0);

  function quickAdd(size: string) {
    const max = color.stock[size] ?? 0;
    if (max <= 0) return;
    add({
      colorId: color.id,
      size,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      colorName: color.name,
      image: color.image,
      price: product.price,
      max,
    });
    setQuick(false);
    setCartOpen(true);
  }

  return (
    <article className="group" onMouseLeave={() => setQuick(false)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] bg-stone">
        <Link
          href={`/product/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 block"
          draggable={false}
        >
          {product.colors.map((c, i) => (
            <Image
              key={c.id}
              src={c.image}
              alt={i === ci ? `${product.name} in ${c.name}` : ""}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className={`${fullFrameImage ? "object-contain p-4" : "object-cover object-top"} transition-[opacity,transform] duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.035] ${
                i === ci ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </Link>

        {soldOut && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ivory/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
            Sold out
          </span>
        )}

        {!soldOut && (
          <div className="absolute inset-x-3 bottom-3 flex justify-end">
            <AnimatePresence mode="wait" initial={false}>
              {quick ? (
                <motion.div
                  key="sizes"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="flex w-full items-center justify-between gap-1 rounded-full border border-charcoal/10 bg-soft/80 p-1.5 backdrop-blur-xl"
                >
                  {SIZES.map((s) => {
                    const out = (color.stock[s] ?? 0) <= 0;
                    return (
                      <button
                        key={s}
                        onClick={() => quickAdd(s)}
                        disabled={out}
                        aria-label={`Add size ${s} to bag`}
                        className={`h-9 flex-1 rounded-full text-[11px] font-semibold transition active:scale-90 ${
                          out
                            ? "text-muted line-through"
                            : "hover:bg-charcoal/10"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.button
                  key="plus"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setQuick(true)}
                  aria-label={`Quick add ${product.name}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/15 bg-soft/70 backdrop-blur-xl transition duration-300 hover:bg-soft active:scale-90 lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0 lg:focus-visible:opacity-100"
                >
                  <PlusIcon />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <Link href={`/product/${product.slug}`} className="block truncate text-[14px] font-semibold tracking-[-0.005em]">
            {product.name}
          </Link>
          <p className="mt-0.5 text-[12px] capitalize text-muted">{color.name}</p>
        </div>
        <p className="shrink-0 text-[14px]">{formatPrice(product.price)}</p>
      </div>

      {product.colors.length > 1 && (
        <div className="mt-2 flex items-center gap-2 px-1" role="radiogroup" aria-label="Colour">
          {product.colors.map((c, i) => (
            <button
              key={c.id}
              role="radio"
              aria-checked={i === ci}
              aria-label={c.name}
              title={c.name}
              onClick={() => setCi(i)}
              className={`h-[18px] w-[18px] rounded-full border p-[2px] transition active:scale-90 ${
                i === ci ? "border-charcoal" : "border-transparent hover:border-charcoal/30"
              }`}
            >
              <span className="block h-full w-full rounded-full border border-charcoal/15" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
