export const SIZES = ["XS", "S", "M", "L", "XL"] as const;

export const CATEGORIES = [
  { slug: "coats", label: "Coats" },
  { slug: "jackets", label: "Jackets" },
  { slug: "knitwear", label: "Knitwear" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "sweatshirts", label: "Sweatshirts" },
  { slug: "shirts", label: "Overshirts" },
  { slug: "trousers", label: "Winter Looks" },
] as const;

export const COLLECTIONS = [
  {
    slug: "shadow",
    name: "Shadow Outerwear",
    blurb: "Technical parkas, padded jackets and utility layers in deep winter tones.",
    image: "https://inc.nobis.com/cdn/shop/files/Heritage-navy-F3.png?v=1750056790&width=2890",
  },
  {
    slug: "essentials",
    name: "Winter Essentials",
    blurb: "Substantial knitwear and warm everyday layers in quiet neutral shades.",
    image: "https://enviktos.com/cdn/shop/files/cardigan1.png?crop=center&height=856&v=1760067516&width=857",
  },
  {
    slug: "tailored-ease",
    name: "Cold Weather Tailoring",
    blurb: "Soft wool textures, refined coats and considered winter silhouettes.",
    image: "https://metismaven.com/images/cover-premium-wool-winter-2025.jpg",
  },
  {
    slug: "street",
    name: "Winter Street",
    blurb: "Relaxed hoodies, utility layers and modern padded pieces.",
    image: "https://cdn.shopify.com/s/files/1/0930/0351/4203/files/Short_Supply_Winter_Blog_3.webp?v=1768917183",
  },
] as const;

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function collectionName(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug)?.name ?? slug;
}
