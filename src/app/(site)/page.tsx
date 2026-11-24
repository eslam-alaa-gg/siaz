import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { ImageReveal, Reveal } from "@/components/reveal";
import { Newsletter } from "@/components/newsletter";
import { ArrowIcon } from "@/components/icons";
import { getAllProducts } from "@/lib/data";
import { COLLECTIONS } from "@/lib/collections";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const all = await getAllProducts();
  const newArrivals = all.filter((p) => p.isNew).slice(0, 4);
  const best = all.filter((p) => p.isBestseller).slice(0, 4);
  const featured = all.filter((p) => p.collection === "shadow").slice(0, 3);

  return (
    <>
      <Hero />

      {/* Statement */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-36">
        <Reveal>
          <p className="eyebrow mb-6">The SIAZ approach</p>
          <h2 className="max-w-4xl font-display text-[clamp(1.9rem,4.6vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em]">
            Considered essentials, outerwear and tailoring for a{" "}
            <span className="font-serif font-normal italic">quieter</span> kind of wardrobe.
          </h2>
        </Reveal>
      </section>

      {/* Featured collections */}
      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <Reveal className="mb-10 flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em] md:text-5xl">Collections</h2>
            <Link href="/collections" className="btn btn-sm hidden sm:inline-flex">
              All collections
            </Link>
          </Reveal>
        </div>
        <div className="hide-scrollbar mx-auto flex max-w-[1440px] snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-12">
          {COLLECTIONS.map((c, i) => (
            <Reveal
              key={c.slug}
              delay={i * 0.08}
              className={`w-[76vw] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none ${i % 2 === 1 ? "md:mt-16" : ""}`}
            >
              <Link href={`/shop?collection=${c.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-stone">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(min-width:768px) 25vw, 76vw"
                    className="object-cover object-top transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-ivory">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory/70">
                        0{i + 1}
                      </p>
                      <h3 className="font-serif text-2xl leading-tight">{c.name}</h3>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ivory/40 bg-ivory/10 backdrop-blur transition duration-500 group-hover:bg-ivory/25 group-hover:-rotate-45">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-[1440px] px-6 pb-24 md:px-12 md:pb-36">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Just landed</p>
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em] md:text-5xl">New Arrivals</h2>
          </div>
          <Link href="/new-arrivals" className="btn btn-sm">
            View all
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {newArrivals.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.07}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured collection panel */}
      {featured.length > 0 && (
        <section className="px-3 pb-24 md:px-6 md:pb-36">
          <div className="mx-auto grid max-w-[1440px] gap-10 overflow-hidden rounded-[2rem] bg-charcoal p-6 text-ivory md:grid-cols-[0.9fr_1.4fr] md:gap-14 md:rounded-[2.5rem] md:p-14">
            <Reveal className="flex flex-col justify-between gap-12">
              <div>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/50">
                  Featured collection
                </p>
                <h2 className="font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl">
                  Shadow
                  <br />
                  <span className="font-serif font-normal italic">Series</span>
                </h2>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/65">
                  Matte nylon, washed cotton and utility details in black, olive and stone. Outerwear designed to be
                  worn in every season, and to age quietly.
                </p>
              </div>
              <div>
                <Link href="/shop?collection=shadow" className="btn btn-light">
                  Explore the series
                  <ArrowIcon />
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1} className={i === 2 ? "hidden md:block" : ""}>
                  <Link href={`/product/${p.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.3rem] bg-ivory/10">
                      <Image
                        src={p.colors[0].image}
                        alt={p.name}
                        fill
                        sizes="(min-width:768px) 22vw, 45vw"
                        className="object-cover object-top transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="mt-3 flex justify-between gap-2 px-1 text-[13px]">
                      <span className="truncate font-semibold">{p.name}</span>
                      <span className="text-ivory/70">{formatPrice(p.price)}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best sellers */}
      <section className="mx-auto max-w-[1440px] px-6 pb-24 md:px-12 md:pb-36">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Most loved</p>
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em] md:text-5xl">Best Sellers</h2>
          </div>
          <Link href="/shop?bestsellers=1" className="btn btn-sm">
            View all
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {best.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.07}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-24 md:grid-cols-2 md:gap-20 md:px-12 md:pb-36">
        <ImageReveal className="relative mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-[2rem] bg-charcoal md:max-w-none">
          <Image
            src="/images/story.jpg"
            alt="Two models in oversized black outerwear in a dim studio"
            fill
            sizes="(min-width:768px) 45vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
        <Reveal>
          <p className="eyebrow mb-6">Our story</p>
          <h2 className="font-display text-[clamp(2rem,4.2vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            Made slowly, worn for{" "}
            <span className="font-serif font-normal italic">years</span>.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-charcoal/70">
            SIAZ began with a simple idea: clothing should feel timeless the moment you put it on. We work with small
            mills, favour natural and recycled fibres, and refine every silhouette until nothing is left to remove.
          </p>
          <Link href="/about" className="btn mt-9">
            Read our story
            <ArrowIcon />
          </Link>
        </Reveal>
      </section>

      {/* Newsletter */}
      <section className="px-3 pb-3 md:px-6 md:pb-6">
        <Reveal>
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-10 rounded-[2rem] bg-stone px-6 py-14 md:flex-row md:items-center md:rounded-[2.5rem] md:px-14 md:py-20">
            <div>
              <p className="eyebrow mb-4">Newsletter</p>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
                Be first to <span className="font-serif font-normal italic">know</span>.
              </h2>
              <p className="mt-4 max-w-sm text-sm text-charcoal/60">
                Early access to new collections and private previews. No noise.
              </p>
            </div>
            <Newsletter />
          </div>
        </Reveal>
      </section>
    </>
  );
}
