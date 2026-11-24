import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageReveal, Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  { n: "01", t: "Restraint", d: "We edit relentlessly. Every seam, pocket and proportion earns its place." },
  { n: "02", t: "Material", d: "Dense cottons, washed linen and recycled technical fabrics, sourced from small mills." },
  { n: "03", t: "Longevity", d: "Pieces designed to outlast the season — and to look better the longer you wear them." },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-10 md:px-12 md:pb-32 md:pt-16">
        <Reveal>
          <p className="eyebrow mb-6">About SIAZ</p>
          <h1 className="max-w-5xl font-display text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[1] tracking-[-0.045em]">
            Fashion <span className="font-serif font-normal italic">beyond</span> time.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-24 md:grid-cols-2 md:gap-20 md:px-12 md:pb-36">
        <ImageReveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-charcoal">
          <Image src="/images/story.jpg" alt="SIAZ studio campaign" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
        </ImageReveal>
        <Reveal>
          <p className="font-display text-2xl font-medium leading-[1.3] tracking-[-0.02em] md:text-3xl">
            SIAZ is a contemporary label built around quiet confidence, strong silhouettes and a restrained palette.
          </p>
          <p className="mt-6 max-w-lg text-[15px] leading-[1.9] text-charcoal/65">
            Born in the studio and shaped by street, tailoring and the shadows between them, our collections are
            designed to be lived in. We make in limited runs, so each piece is considered, not disposable. From
            heavyweight tees and brushed fleece to technical outerwear and tailored trousers — everything is built to
            be worn together, and worn for years.
          </p>
          <Link href="/shop" className="btn mt-9">
            Shop the collection
            <ArrowIcon />
          </Link>
        </Reveal>
      </section>

      <section className="px-3 pb-3 md:px-6 md:pb-6">
        <div className="mx-auto grid max-w-[1440px] gap-10 rounded-[2rem] bg-stone px-6 py-14 md:grid-cols-3 md:gap-14 md:rounded-[2.5rem] md:px-14 md:py-20">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.1}>
              <p className="eyebrow mb-6">{v.n}</p>
              <h2 className="font-serif text-3xl italic">{v.t}</h2>
              <p className="mt-4 max-w-xs text-sm leading-[1.8] text-charcoal/65">{v.d}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
