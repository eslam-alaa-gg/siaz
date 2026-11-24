import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getAllProducts, getProductBySlug } from "@/lib/data";
import { categoryLabel } from "@/lib/collections";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p?.name ?? "Product", description: p?.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive || product.colors.length === 0) notFound();

  const all = await getAllProducts();
  const others = all.filter((p) => p.id !== product.id);
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category && p.collection === product.collection),
    ...others.filter((p) => p.category !== product.category && p.collection !== product.collection),
  ].slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-6 md:px-12 md:pt-10">
        <ProductDetail
          key={product.id}
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            category: product.category,
            categoryLabel: categoryLabel(product.category),
            tagline: product.tagline,
            description: product.description,
            material: product.material,
            colors: product.colors,
          }}
        />
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Complete the look</p>
          <h2 className="font-display text-3xl font-medium tracking-[-0.03em] md:text-4xl">You may also like</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-4 md:gap-x-5">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
