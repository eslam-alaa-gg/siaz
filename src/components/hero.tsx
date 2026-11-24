"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowIcon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="px-3 md:px-6">
      <div className="relative isolate mx-auto h-[calc(100svh-6.25rem)] max-h-[900px] min-h-[600px] max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#e6e0d4] md:h-[calc(100svh-7rem)] md:rounded-[2.5rem]">
        {/* Giant wordmark, sits behind the garment */}
        <motion.h1
          aria-label="SIAZ"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease }}
          className="absolute inset-x-0 top-[13%] z-0 select-none text-center font-display text-[46vw] font-bold leading-[0.8] tracking-[-0.065em] text-charcoal md:bottom-[11%] md:top-auto md:text-[35vw] min-[1440px]:text-[500px]"
        >
          SIAZ
        </motion.h1>

        {/* Campaign photograph — blended so its backdrop dissolves into the panel */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease }}
          className="absolute bottom-0 left-1/2 z-10 aspect-[2/3] h-[72%] -translate-x-1/2 mix-blend-darken md:h-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          }}
        >
          <Image
            src="/images/hero.jpg"
            alt="SIAZ campaign — model in a dark oversized nylon bomber jacket and utility trousers"
            fill
            priority
            sizes="(min-width:768px) 40vw, 90vw"
            className="object-cover object-top"
          />
        </motion.div>

        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease }}
          className="absolute left-6 top-[40%] z-20 hidden md:left-12 md:top-[11%] md:block"
        >
          <p className="font-display text-sm font-medium uppercase leading-[1.7] tracking-[0.32em]">
            Fashion
            <br />
            beyond
            <br />
            time
          </p>
        </motion.div>

        {/* Right label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute right-6 top-6 z-20 flex items-start gap-3 text-right md:right-12 md:top-[11%]"
        >
          <p className="text-[11px] font-semibold uppercase leading-[1.7] tracking-[0.2em] text-charcoal/80">
            SIAZ Universe
            <br />
            <span className="text-charcoal/50">FW 2025</span>
          </p>
          <span className="mt-0.5 hidden h-10 w-px bg-charcoal/40 md:block" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-6 top-6 z-20 text-[11px] font-semibold uppercase leading-[1.7] tracking-[0.28em] text-charcoal/80 md:hidden"
        >
          Fashion
          <br />
          beyond time
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease }}
          className="absolute inset-x-0 bottom-6 z-20 flex justify-center md:inset-x-auto md:bottom-9 md:left-12 md:block"
        >
          <Link href="/shop" className="btn btn-light group md:hidden">
            Explore the universe
            <ArrowIcon className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <Link href="/shop" className="btn group hidden md:inline-flex">
            Explore the universe
            <ArrowIcon className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
