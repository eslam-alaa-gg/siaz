import { queryProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (!q.trim()) return Response.json({ results: [] });
  const list = await queryProducts({ q });
  return Response.json({
    results: list.slice(0, 6).map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.colors[0].image,
    })),
  });
}
