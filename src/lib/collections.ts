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
    image: "https://store.staticbloom.co.jp/cdn/shop/files/static-mata-jacket-onyx_1000x.jpg?v=1703639511",
  },
  {
    slug: "essentials",
    name: "Winter Essentials",
    blurb: "Substantial knitwear and warm everyday layers in quiet neutral shades.",
    image: "https://ignewsimg.s3.ap-northeast-1.wasabisys.com/CGpTlFPBmOo",
  },
  {
    slug: "tailored-ease",
    name: "Cold Weather Tailoring",
    blurb: "Soft wool textures, refined coats and considered winter silhouettes.",
    image: "https://images.squarespace-cdn.com/content/v1/67b8ba95da76453e16343fd2/31487f7e-00ad-4d35-a91b-b5b893f3a9d6/Natalino%2B5th%2BNovember%2B2024-1.jpg",
  },
  {
    slug: "street",
    name: "Winter Street",
    blurb: "Relaxed hoodies, utility layers and modern padded pieces.",
    image: "https://www.bigagnes.com/cdn/shop/files/wirehand-parka-brown-sugar-closed.png?v=1724794329",
  },
] as const;

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function collectionName(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug)?.name ?? slug;
}
