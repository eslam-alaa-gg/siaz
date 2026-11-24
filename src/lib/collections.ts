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
    image: "https://torontolife.mblycdn.com/uploads/tl/2023/01/WINTER-JACKETS-HERO-IMAGE.png",
  },
  {
    slug: "essentials",
    name: "Winter Essentials",
    blurb: "Substantial knitwear and warm everyday layers in quiet neutral shades.",
    image: "https://mikuta.com/cdn/shop/files/mikuta-the-dark-grey-long-knitted-cardigan-the-black-cropped-leather-pants-the-dark-dry-cotton-vintage-t-shirt-the-black-laced-leather-boots-paris-fw25-lara1.jpg?v=1763410866&width=2560",
  },
  {
    slug: "tailored-ease",
    name: "Cold Weather Tailoring",
    blurb: "Soft wool textures, refined coats and considered winter silhouettes.",
    image: "https://cdn.laredoute.com/blogs/images/6/24901553504ab.jpg",
  },
  {
    slug: "street",
    name: "Winter Street",
    blurb: "Relaxed hoodies, utility layers and modern padded pieces.",
    image: "https://thevinylhouse.co.kr/web/upload/appfiles/ZaReJam3QiELznoZeGGkMG/1f800a8a1524bc6e38dd42b2799e8bdd.jpg",
  },
] as const;

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function collectionName(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug)?.name ?? slug;
}
