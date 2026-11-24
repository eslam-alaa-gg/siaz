"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./cart-context";
import { CloseIcon, SearchIcon } from "./icons";
import { formatPrice } from "@/lib/format";

type Hit = { slug: string; name: string; price: number; category: string; image: string };

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
    else {
      setQ("");
      setHits([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const j = await r.json();
        setHits(j.results ?? []);
      } catch {}
      setLoading(false);
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <motion.div
            role="dialog"
            aria-label="Search"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-3 mt-3 max-w-3xl rounded-[2rem] bg-ivory p-4 shadow-2xl sm:p-6 md:mx-auto md:mt-6"
          >
            <form onSubmit={submit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search hoodies, trousers, black…"
                  className="field !pl-12"
                  aria-label="Search products"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-charcoal/15 transition hover:bg-charcoal/[0.06] active:scale-90"
              >
                <CloseIcon />
              </button>
            </form>

            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {!q.trim() ? (
                <div className="px-2 pb-2 pt-1">
                  <p className="eyebrow mb-3">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {["Hoodie", "Bomber", "Trousers", "Tee", "Linen"].map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="btn btn-sm">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : hits.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  {loading ? "Searching…" : `No pieces found for “${q}”.`}
                </p>
              ) : (
                <ul>
                  {hits.map((h) => (
                    <li key={h.slug}>
                      <Link
                        href={`/product/${h.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-charcoal/[0.05]"
                      >
                        <span className="relative h-[72px] w-[56px] shrink-0 overflow-hidden rounded-xl bg-stone">
                          <Image src={h.image} alt="" fill sizes="56px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{h.name}</span>
                          <span className="text-xs capitalize text-muted">{h.category.replace("-", " ")}</span>
                        </span>
                        <span className="pr-2 text-sm">{formatPrice(h.price)}</span>
                      </Link>
                    </li>
                  ))}
                  <li className="px-2 pt-2">
                    <button onClick={submit} className="btn btn-sm w-full">
                      View all results
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
