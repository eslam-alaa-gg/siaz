import "server-only";
import { cache } from "react";
import { asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  orderItems,
  orders,
  productColors,
  productStock,
  products,
  type Product,
} from "@/db/schema";
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

let seedPromise: Promise<void> | null = null;

async function seed() {
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(884422)`);
    const [{ n }] = await tx.select({ n: count() }).from(products);
    if (n > 0) return;
    for (const [i, p] of SEED_PRODUCTS.entries()) {
      const [row] = await tx
        .insert(products)
        .values({
          slug: p.slug,
          name: p.name,
          category: p.category,
          collection: p.collection,
          tagline: p.tagline,
          description: p.description,
          material: p.material,
          price: p.price,
          isNew: !!p.isNew,
          isBestseller: !!p.isBestseller,
          createdAt: new Date(Date.now() - i * 86_400_000),
        })
        .returning();
      for (const [ci, c] of p.colors.entries()) {
        const [col] = await tx
          .insert(productColors)
          .values({ productId: row.id, name: c.name, hex: c.hex, image: c.image, position: ci })
          .returning();
        await tx.insert(productStock).values(
          SIZES.map((size, si) => ({ colorId: col.id, size, quantity: c.stock[si] ?? 0 })),
        );
      }
    }
  });
}

export function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = seed().catch((e) => {
      seedPromise = null;
      throw e;
    });
  }
  return seedPromise;
}

async function assemble(rows: Product[]): Promise<CatalogProduct[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const colors = await db
    .select()
    .from(productColors)
    .where(inArray(productColors.productId, ids))
    .orderBy(asc(productColors.position), asc(productColors.id));
  const stock = colors.length
    ? await db
        .select()
        .from(productStock)
        .where(inArray(productStock.colorId, colors.map((c) => c.id)))
    : [];
  const stockBy = new Map<number, Record<string, number>>();
  for (const s of stock) {
    const rec = stockBy.get(s.colorId) ?? {};
    rec[s.size] = s.quantity;
    stockBy.set(s.colorId, rec);
  }
  return rows.map((r) => ({
    ...r,
    colors: colors
      .filter((c) => c.productId === r.id)
      .map((c) => ({
        id: c.id,
        name: c.name,
        hex: c.hex,
        image: c.image,
        stock: stockBy.get(c.id) ?? {},
      })),
  }));
}

export const getAllProducts = cache(async (includeInactive = false) => {
  await ensureSeeded();
  const q = db.select().from(products).orderBy(desc(products.createdAt), desc(products.id));
  const rows = includeInactive ? await q : (await q).filter((p) => p.isActive);
  return (await assemble(rows)).filter((p) => p.colors.length > 0 || includeInactive);
});

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(products).where(eq(products.slug, slug));
  const [p] = await assemble(rows);
  return p ?? null;
}

export async function getProductById(id: number) {
  await ensureSeeded();
  const rows = await db.select().from(products).where(eq(products.id, id));
  const [p] = await assemble(rows);
  return p ?? null;
}

export function totalStock(p: CatalogProduct) {
  return p.colors.reduce(
    (a, c) => a + Object.values(c.stock).reduce((x, y) => x + y, 0),
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

export async function queryProducts(opts: ShopQuery) {
  let list = await getAllProducts();
  const q = opts.q?.trim().toLowerCase();
  if (q) {
    const terms = q.split(/\s+/);
    list = list.filter((p) => {
      const hay = [
        p.name,
        p.category,
        p.collection,
        p.tagline,
        p.description,
        ...p.colors.map((c) => c.name),
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }
  if (opts.category) list = list.filter((p) => p.category === opts.category);
  if (opts.collection) list = list.filter((p) => p.collection === opts.collection);
  if (opts.isNew) list = list.filter((p) => p.isNew);
  if (opts.bestsellers) list = list.filter((p) => p.isBestseller);
  if (opts.color) {
    const c = opts.color.toLowerCase();
    list = list.filter((p) => p.colors.some((x) => x.name.toLowerCase().includes(c)));
  }
  const sorted = [...list];
  switch (opts.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break; // newest first (already ordered)
  }
  return sorted;
}

export async function getAllColorNames() {
  const list = await getAllProducts();
  const map = new Map<string, string>();
  for (const p of list)
    for (const c of p.colors) {
      const name = c.name.split("/")[0].trim();
      if (!map.has(name)) map.set(name, c.hex);
    }
  return [...map.entries()]
    .map(([name, hex]) => ({ name, hex }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getOrderByNumber(orderNumber: string) {
  const [o] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
  if (!o) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
  return { ...o, items };
}
