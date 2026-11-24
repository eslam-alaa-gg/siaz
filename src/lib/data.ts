import "server-only";
import { cache } from "react";
import type { Product } from "@/db/schema";
import { SEED_PRODUCTS } from "./seed-data";
import { SIZES } from "./collections";

export type CatalogColor = {
  id: number;
  name: string;
  hex: string;
  image: string;
  stock: Record<string, number>;
};
export type CatalogProduct = Product & { colors: CatalogColor[] };

// SIAZ currently runs in demo mode: the catalogue is sourced from local seed data.
// No database connection or environment variable is required.
const DEMO_PRODUCTS: CatalogProduct[] = SEED_PRODUCTS.map((item, index) => ({
  id: index + 1,
  slug: item.slug,
  name: item.name,
  category: item.category,
  collection: item.collection,
  tagline: item.tagline,
  description: item.description,
  material: item.material,
  price: item.price,
  isNew: Boolean(item.isNew),
  isBestseller: Boolean(item.isBestseller),
  isActive: true,
  createdAt: new Date(Date.UTC(2026, 0, 1) - index * 86_400_000),
  colors: item.colors.map((color, colorIndex) => ({
    id: (index + 1) * 100 + colorIndex + 1,
    name: color.name,
    hex: color.hex,
    image: color.image,
    stock: Object.fromEntries(SIZES.map((size, sizeIndex) => [size, color.stock[sizeIndex] ?? 0])),
  })),
}));

export function ensureSeeded() {
  return Promise.resolve();
}

export const getAllProducts = cache(async (includeInactive = false) =>
  DEMO_PRODUCTS.filter((product) => includeInactive || product.isActive),
);

export async function getProductBySlug(slug: string) {
  return DEMO_PRODUCTS.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: number) {
  return DEMO_PRODUCTS.find((product) => product.id === id) ?? null;
}

export function totalStock(product: CatalogProduct) {
  return product.colors.reduce(
    (total, color) => total + Object.values(color.stock).reduce((sum, quantity) => sum + quantity, 0),
    0,
  );
}

export type ShopQuery = {
  q?: string;
  category?: string;
  collection?: string;
  color?: string;
  sort?: string;
  isNew?: boolean;
  bestsellers?: boolean;
};

export async function queryProducts(options: ShopQuery) {
  let list = await getAllProducts();
  const query = options.q?.trim().toLowerCase();
  if (query) {
    const terms = query.split(/\\s+/);
    list = list.filter((product) => {
      const searchable = [
        product.name,
        product.category,
        product.collection,
        product.tagline,
        product.description,
        ...product.colors.map((color) => color.name),
      ].join(" ").toLowerCase();
      return terms.every((term) => searchable.includes(term));
    });
  }
  if (options.category) list = list.filter((product) => product.category === options.category);
  if (options.collection) list = list.filter((product) => product.collection === options.collection);
  if (options.isNew) list = list.filter((product) => product.isNew);
  if (options.bestsellers) list = list.filter((product) => product.isBestseller);
  if (options.color) {
    const color = options.color.toLowerCase();
    list = list.filter((product) => product.colors.some((entry) => entry.name.toLowerCase().includes(color)));
  }
  const sorted = [...list];
  switch (options.sort) {
    case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
    case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
    case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return sorted;
}

export async function getAllColorNames() {
  const products = await getAllProducts();
  const colors = new Map<string, string>();
  for (const product of products) {
    for (const color of product.colors) {
      const name = color.name.split("/")[0].trim();
      if (!colors.has(name)) colors.set(name, color.hex);
    }
  }
  return [...colors.entries()]
    .map(([name, hex]) => ({ name, hex }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Orders are intentionally not persisted in demo mode.
export async function getOrderByNumber(_orderNumber: string) {
  return null;
}
