import Link from "next/link";
import { count, desc, sum } from "drizzle-orm";
import { db } from "@/db";
import { orders, subscribers } from "@/db/schema";
import { getAllProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [products, [{ n: orderCount, revenue }], [{ n: subs }], recent] = await Promise.all([
    getAllProducts(true),
    db.select({ n: count(), revenue: sum(orders.total) }).from(orders),
    db.select({ n: count() }).from(subscribers),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
  ]);

  const low: { name: string; color: string; size: string; qty: number; slug: string }[] = [];
  for (const p of products)
    for (const c of p.colors)
      for (const [size, qty] of Object.entries(c.stock))
        if (qty <= 2) low.push({ name: p.name, color: c.name, size, qty, slug: p.slug });
  low.sort((a, b) => a.qty - b.qty);

  const stats = [
    { l: "Products", v: products.length },
    { l: "Orders", v: orderCount },
    { l: "Revenue", v: formatPrice(Number(revenue ?? 0)) },
    { l: "Subscribers", v: subs },
  ];

  return (
    <div className="space-y-10">
      <h1 className="font-display text-4xl font-medium tracking-[-0.04em]">Overview</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-3xl bg-soft p-6">
            <p className="eyebrow">{s.l}</p>
            <p className="mt-3 font-display text-3xl font-medium">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-soft p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="link-underline text-xs">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-charcoal/10 text-sm">
              {recent.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3">
                  <span>
                    <span className="font-semibold">{o.orderNumber}</span>
                    <span className="ml-2 text-muted">{o.firstName} {o.lastName}</span>
                  </span>
                  <span>{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-soft p-6">
          <h2 className="mb-4 font-display text-xl font-medium">Low stock</h2>
          {low.length === 0 ? (
            <p className="text-sm text-muted">Stock levels look healthy.</p>
          ) : (
            <ul className="max-h-72 divide-y divide-charcoal/10 overflow-y-auto text-sm">
              {low.slice(0, 20).map((l, i) => (
                <li key={i} className="flex items-center justify-between py-2.5">
                  <span>
                    {l.name} <span className="text-muted">· {l.color} · {l.size}</span>
                  </span>
                  <span className={l.qty === 0 ? "text-red-700" : "text-amber-700"}>
                    {l.qty === 0 ? "Sold out" : `${l.qty} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
