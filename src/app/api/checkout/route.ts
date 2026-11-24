import { z } from "zod";
import { SIZES } from "@/lib/collections";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  address: z.string().trim().min(3),
  city: z.string().trim().min(1),
  postalCode: z.string().trim().min(2),
  country: z.string().trim().min(2),
  shippingMethod: z.enum(["standard", "express"]),
  items: z.array(z.object({
    colorId: z.number().int(),
    size: z.enum(SIZES),
    qty: z.number().int().min(1).max(20),
  })).min(1),
});

function makeOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < 6; i++) value += chars[Math.floor(Math.random() * chars.length)];
  return `SZ-${value}`;
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid order" }, { status: 400 });
  }

  // Demo checkout only: validate the form and return a reference. No payment,
  // inventory mutation, or permanent order storage takes place.
  return Response.json({ orderNumber: makeOrderNumber(), demo: true });
}
