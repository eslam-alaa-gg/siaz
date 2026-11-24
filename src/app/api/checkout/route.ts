import { z } from "zod";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, productColors, productStock, products } from "@/db/schema";
import { shippingCost } from "@/lib/format";
import { SIZES } from "@/lib/collections";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  address: z.string().trim().min(3, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  postalCode: z.string().trim().min(2, "Postal code is required"),
  country: z.string().trim().min(2, "Country is required"),
  shippingMethod: z.enum(["standard", "express"]),
  items: z
    .array(
      z.object({
        colorId: z.number().int(),
        size: z.enum(SIZES),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Your bag is empty"),
});

class StockError extends Error {}

function makeOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SZ-${s}`;
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  try {
    const orderNumber = await db.transaction(async (tx) => {
      // merge duplicates
      const merged = new Map<string, { colorId: number; size: string; qty: number }>();
      for (const it of data.items) {
        const k = `${it.colorId}:${it.size}`;
        const prev = merged.get(k);
        merged.set(k, { ...it, qty: (prev?.qty ?? 0) + it.qty });
      }

      const lines: {
        productId: number;
        name: string;
        slug: string;
        colorName: string;
        size: string;
        qty: number;
        price: number;
        image: string;
      }[] = [];

      for (const it of merged.values()) {
        const [info] = await tx
          .select({
            productId: products.id,
            name: products.name,
            slug: products.slug,
            price: products.price,
            active: products.isActive,
            colorName: productColors.name,
            image: productColors.image,
          })
          .from(productColors)
          .innerJoin(products, eq(products.id, productColors.productId))
          .where(eq(productColors.id, it.colorId));
        if (!info || !info.active) throw new StockError("An item in your bag is no longer available.");

        const updated = await tx
          .update(productStock)
          .set({ quantity: sql`${productStock.quantity} - ${it.qty}` })
          .where(
            and(
              eq(productStock.colorId, it.colorId),
              eq(productStock.size, it.size),
              gte(productStock.quantity, it.qty),
            ),
          )
          .returning({ id: productStock.id });
        if (updated.length === 0) {
          throw new StockError(
            `Sorry, ${info.name} (${info.colorName}, ${it.size}) doesn’t have enough stock for that quantity.`,
          );
        }
        lines.push({
          productId: info.productId,
          name: info.name,
          slug: info.slug,
          colorName: info.colorName,
          size: it.size,
          qty: it.qty,
          price: info.price,
          image: info.image,
        });
      }

      const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
      const shipping = shippingCost(subtotal, data.shippingMethod);
      const number = makeOrderNumber();

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: number,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
          shippingMethod: data.shippingMethod,
          subtotal,
          shipping,
          total: subtotal + shipping,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          orderId: order.id,
          productId: l.productId,
          name: l.name,
          slug: l.slug,
          colorName: l.colorName,
          size: l.size,
          quantity: l.qty,
          unitPrice: l.price,
          image: l.image,
        })),
      );
      return number;
    });

    return Response.json({ orderNumber });
  } catch (e) {
    if (e instanceof StockError) return Response.json({ error: e.message }, { status: 409 });
    console.error(e);
    return Response.json({ error: "We couldn’t place your order. Please try again." }, { status: 500 });
  }
}
