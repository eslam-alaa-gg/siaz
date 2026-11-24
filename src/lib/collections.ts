export const SIZES = ["XS", "S", "M", "L", "XL"] as const;

export const CATEGORIES = [
  { slug: "t-shirts", label: "T-Shirts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "sweatshirts", label: "Sweatshirts" },
  { slug: "shirts", label: "Shirts" },
  { slug: "jackets", label: "Jackets" },
  { slug: "trousers", label: "Trousers" },
] as const;

export const COLLECTIONS = [
  {
    slug: "shadow",
    name: "Shadow Series",
    blurb: "Technical outerwear and utility in washed black and olive.",
    image: "/images/products/bomber-black.jpg",
  },
  {
    slug: "essentials",
    name: "Everyday Essentials",
    blurb: "Heavyweight basics, cut slightly large and made to last.",
    image: "/images/products/tee-black.jpg",
  },
  {
    slug: "tailored-ease",
    name: "Tailored Ease",
    blurb: "Pleated trousers, linen and stone-toned layers.",
    image: "/images/products/trouser-stone.jpg",
  },
  {
    slug: "street",
    name: "Studio Street",
    blurb: "Relaxed streetwear essentials with quiet attitude.",
    image: "/images/products/hoodie-black.jpg",
  },
] as const;

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function collectionName(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug)?.name ?? slug;
}
