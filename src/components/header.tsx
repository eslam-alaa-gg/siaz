"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./cart-context";
import { BagIcon, CloseIcon, SearchIcon } from "./icons";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const { count, setCartOpen, setSearchOpen } = useCart();
  const [menu, setMenu] = useState(false);

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
        <div className="mx-auto grid h-14 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center rounded-full border border-charcoal/10 bg-soft/70 px-5 backdrop-blur-xl md:px-7">
          <Link
            href="/"
            aria-label="SIAZ — home"
            className="font-display text-[22px] font-bold leading-none tracking-[-0.05em]"
          >
            SIAZ
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-active={isActive(l.href)}
                className="link-underline text-[13px] font-medium tracking-wide text-charcoal/80 transition-colors hover:text-charcoal data-[active=true]:text-charcoal"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="md:hidden" />

          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-charcoal/[0.06] active:scale-90"
            >
              <SearchIcon />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping bag, ${count} items`}
              className="relative grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-charcoal/[0.06] active:scale-90"
            >
              <BagIcon />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full border border-charcoal/70 bg-ivory px-1 text-[9px] font-bold leading-none"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMenu((v) => !v)}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              className="grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-charcoal/[0.06] active:scale-90 md:hidden"
            >
              {menu ? (
                <CloseIcon />
              ) : (
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 9h16M4 15h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-charcoal/20 backdrop-blur-sm md:hidden"
            onClick={() => setMenu(false)}
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-3 top-[4.6rem] rounded-[2rem] border border-charcoal/10 bg-ivory p-7 shadow-[0_30px_80px_-30px_rgba(37,37,37,0.4)]"
              aria-label="Mobile"
            >
              <ul className="flex flex-col">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                    className="border-b border-charcoal/10 last:border-0"
                  >
                    <Link
                      href={l.href}
                      className="flex items-center justify-between py-4 font-display text-[28px] font-medium tracking-tight"
                    >
                      {l.label}
                      <span className="text-sm text-muted">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-6 font-serif text-lg italic text-muted">Fashion beyond time.</p>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
