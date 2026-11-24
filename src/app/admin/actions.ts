"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, notInArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders, productColors, productStock, products } from "@/db/schema";
import { checkPassword, endAdminSession, isAdmin, startAdminSession } from "@/lib/admin-auth";
import { SIZES } from "@/lib/collections";
import { slugify } from "@/lib/format";

export type FormState = { error?: string } | undefined;

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const pw = String(formData.get("password") ?? "");
  if (!checkPassword(pw)) return { error: "Incorrect password." };
  await startAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/login");
}

const colorSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, "Every colour needs a name"),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Colour must be a hex value like #1f1f1f"),
  image: z.string().trim().min(1, "Every colour needs an image URL"),
  stock: z.record(z.string(), z.number().int().min(0)),
});

const productSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(2, "Name is required"),
  slug: z.string().trim().optional(),
  category: z.string().min(1),
  collection: z.string().min(1),
  tagline: z.string().trim().default(""),
  description: z.string().trim().default(""),
  material: z.string().trim().default(""),
  price: z.number().int().min(1, "Price must be at least 1"),
  isNew: z.boolean(),
  isBestseller: z.boolean(),
  isActive: z.boolean(),
  colors: z.array(colorSchema).min(1, "Add at least one colour"),
});

export async function saveProductAction(_: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) redirect("/admin/login");

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  } catch {
    return { error: "Invalid form data." };
  }
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid product" };
  const d = parsed.data;
  const slug = slugify(d.slug || d.name);
  if (!slug) return { error: "Slug is required" };

  try {
    await db.transaction(async (tx) => {
      const values = {
        slug,
        name: d.name,
        category: d.category,
        collection: d.collection,
        tagline: d.tagline,
        description: d.description,
        material: d.material,
        price: d.price,
        isNew: d.isNew,
        isBestseller: d.isBestseller,
        isActive: d.isActive,
      };
      let productId = d.id;
      if (productId) {
        await tx.update(products).set(values).where(eq(products.id, productId));
      } else {
        const [row] = await tx.insert(products).values(values).returning({ id: products.id });
        productId = row.id;
      }

      const keepIds: number[] = [];
      for (const [pos, c] of d.colors.entries()) {
        let colorId = c.id;
        if (colorId) {
          await tx
            .update(productColors)
            .set({ name: c.name, hex: c.hex, image: c.image, position: pos })
            .where(eq(productColors.id, colorId));
        } else {
          const [row] = await tx
            .insert(productColors)
            .values({ productId, name: c.name, hex: c.hex, image: c.image, position: pos })
            .returning({ id: productColors.id });
          colorId = row.id;
        }
        keepIds.push(colorId);
        await tx.delete(productStock).where(eq(productStock.colorId, colorId));
        await tx.insert(productStock).values(
          SIZES.map((size) => ({ colorId: colorId!, size, quantity: c.stock[size] ?? 0 })),
        );
      }
      await tx
        .delete(productColors)
        .where(
          keepIds.length
            ? and(
                eq(productColors.productId, productId),
                notInArray(productColors.id, keepIds),
              )
            : eq(productColors.productId, productId),
        );
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("unique") || (e as { code?: string })?.code === "23505" || String((e as { cause?: { code?: string } })?.cause?.code) === "23505") {
      return { error: "That slug is already used by another product." };
    }
    console.error(e);
    return { error: "Could not save the product." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (id) await db.delete(products).where(eq(products.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function toggleActiveAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const active = formData.get("active") === "1";
  if (id) await db.update(products).set({ isActive: active }).where(eq(products.id, id));
  revalidatePath("/", "layout");
}

export async function updateOrderStatusAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (id && ["confirmed", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }
  revalidatePath("/admin/orders");
}
