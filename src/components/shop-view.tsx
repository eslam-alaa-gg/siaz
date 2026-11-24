import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "./product-card";
import { Reveal } from "./reveal";
import { ShopFilters } from "./shop-filters";
import { getAllColorNames, queryProducts } from "@/lib/data";
import { categoryLabel, collectionName } from "@/lib/collections";

export type ShopParams = {
  q?: string;
  category?: string;
  collection?: string;
  color?: string;
  sort?: string;
  bestsellers?: string;
};

export async function ShopView({
  params,
  forceNew = false,
}: {
  params: ShopParams;
  forceNew?: boolean;
}) {
  const [products, colors] = await Promise.all([
    queryProducts({
      q: params.q,
      category: params.category,
      collection: params.collection,
      color: params.color,
      sort: params.sort,
      isNew: forceNew,
      bestsellers: params.bestsellers === "1",
    }),
    getAllColorNames(),
  ]);

  let title = "Shop";
  let eyebrow = "The collection";
  if (forceNew) {
    title = "New Arrivals";
    eyebrow = "Just landed";
  } else if (params.q) {
    title = `Results for “${params.q}”`;
    eyebrow = "Search";
  } else if (params.collection) {
    title = collectionName(params.collection);
    eyebrow = "Collection";
  } else if (params.bestsellers === "1") {
    title = "Best Sellers";
    eyebrow = "Most loved";
  } else if (params.category) {
    title = categoryLabel(params.category);
  }

  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-10 md:px-12 md:pt-16">
      <Reveal className="mb-10 md:mb-14">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-medium leading-[1] tracking-[-0.04em]">
          {title}
        </h1>
      </Reveal>

      <Suspense fallback={null}>
        <ShopFilters colors={colors} total={products.length} />
      </Suspense>

      {products.length === 0 ? (
        <div className="grid place-items-center rounded-[2rem] bg-stone/60 px-6 py-24 text-center">
          <p className="font-serif text-3xl italic">Nothing found</p>
          <p className="mb-6 mt-2 text-sm text-muted">Try adjusting your filters or search.</p>
          <Link href={forceNew ? "/new-arrivals" : "/shop"} className="btn">
            Reset filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.05} y={16}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
