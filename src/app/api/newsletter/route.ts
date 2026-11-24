import { z } from "zod";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const inserted = await db
    .insert(subscribers)
    .values({ email: parsed.data.email })
    .onConflictDoNothing()
    .returning();
  return Response.json({
    message: inserted.length
      ? "Welcome to the universe. Check your inbox soon."
      : "You’re already on the list — thank you.",
  });
}
