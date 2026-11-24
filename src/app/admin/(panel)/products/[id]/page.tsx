import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data";
import { ProductForm } from "../product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = Number.isFinite(Number(id)) ? await getProductById(Number(id)) : null;
  if (!p) notFound();
  return (
    <div>
      <h1 className="mb-8 font-display text-4xl font-medium tracking-[-0.04em]">Edit {p.name}</h1>
      <ProductForm
        key={p.id}
        initial={{
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          collection: p.collection,
          tagline: p.tagline,
          description: p.description,
          material: p.material,
          price: p.price,
          isNew: p.isNew,
          isBestseller: p.isBestseller,
          isActive: p.isActive,
          colors: p.colors.map((c) => ({
            id: c.id,
            name: c.name,
            hex: c.hex,
            image: c.image,
            stock: c.stock,
          })),
        }}
      />
    </div>
  );
}
