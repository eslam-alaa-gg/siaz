import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Demo mode: do not store or transmit subscriber information.
  return Response.json({ message: "Thanks for your interest. Newsletter sign-up is in demo mode." });
}
