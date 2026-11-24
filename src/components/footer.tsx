import Link from "next/link";
import { CATEGORIES, COLLECTIONS } from "@/lib/collections";
import { Newsletter } from "./newsletter";

export function Footer() {
  return (
    <footer className="px-3 pb-3 md:px-6 md:pb-6">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] bg-charcoal px-6 pb-8 pt-14 text-ivory md:rounded-[2.5rem] md:px-14 md:pt-20">
        <div className="relative z-10 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl italic leading-tight md:text-4xl">
              Stay close to
              <br />
              the universe.
            </p>
            <p className="mb-5 mt-4 max-w-sm text-sm text-ivory/55">
              New drops, private previews and the occasional note from the studio.
            </p>
            <Newsletter dark />
          </div>

          <FooterCol title="Shop">
            <FooterLink href="/shop">All products</FooterLink>
            <FooterLink href="/new-arrivals">New arrivals</FooterLink>
            <FooterLink href="/shop?bestsellers=1">Best sellers</FooterLink>
            {CATEGORIES.slice(0, 3).map((c) => (
              <FooterLink key={c.slug} href={`/shop?category=${c.slug}`}>
                {c.label}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Collections">
            {COLLECTIONS.map((c) => (
              <FooterLink key={c.slug} href={`/shop?collection=${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Studio">
            <FooterLink href="/about">About SIAZ</FooterLink>
            <FooterLink href="/collections">Collections</FooterLink>
            <FooterLink href="/admin">Admin</FooterLink>
          </FooterCol>
        </div>

        <div
          aria-hidden
          className="pointer-events-none relative z-0 mt-14 select-none text-center font-display text-[30vw] font-bold leading-[0.78] tracking-[-0.06em] text-ivory/[0.06] md:mt-10 md:text-[21vw]"
        >
          SIAZ
        </div>

        <div className="relative z-10 mt-6 flex flex-col gap-2 border-t border-ivory/10 pt-6 text-xs text-ivory/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} SIAZ. All rights reserved.</p>
          <p>Complimentary shipping on orders over $250.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/40">{title}</p>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-ivory/80 transition-colors hover:text-ivory">
        {children}
      </Link>
    </li>
  );
}
