import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageReveal, Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";
import { getAllProducts } from "@/lib/data";
import { COLLECTIONS } from "@/lib/collections";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const all = await getAllProducts();
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-10 md:px-12 md:pt-16">
      <Reveal className="mb-14 md:mb-24">
        <p className="eyebrow mb-3">Seasonal edits</p>
        <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em]">
          The <span className="font-serif font-normal italic">collections</span>
        </h1>
      </Reveal>

      <div className="space-y-16 md:space-y-28">
        {COLLECTIONS.map((c, i) => {
          const count = all.filter((p) => p.collection === c.slug).length;
          return (
            <article
              key={c.slug}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-20 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <ImageReveal className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-stone">
                <Link href={`/shop?collection=${c.slug}`} className="group absolute inset-0 block">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(min-width:768px) 45vw, 100vw"
                    className="object-cover object-top transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
                  />
                </Link>
              </ImageReveal>
              <Reveal>
                <p className="eyebrow mb-5">
                  0{i + 1} — {count} {count === 1 ? "piece" : "pieces"}
                </p>
                <h2 className="font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl">
                  {c.name}
                </h2>
                <p className="mt-5 max-w-sm text-[15px] leading-[1.8] text-charcoal/65">{c.blurb}</p>
                <Link href={`/shop?collection=${c.slug}`} className="btn mt-8">
                  View collection
                  <ArrowIcon />
                </Link>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
