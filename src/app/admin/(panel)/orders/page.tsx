import Image from "next/image";
import { desc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { updateOrderStatusAction } from "../../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

export default async function AdminOrders() {
  const list = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);
  const items = list.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, list.map((o) => o.id)))
    : [];

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl font-medium tracking-[-0.04em]">Orders</h1>
      {list.length === 0 ? (
        <p className="rounded-3xl bg-soft p-10 text-center text-sm text-muted">No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {list.map((o) => (
            <li key={o.id} className="rounded-3xl bg-soft p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-medium">{o.orderNumber}</p>
                  <p className="mt-1 text-xs text-muted">
                    {o.createdAt.toLocaleString("en-US")} · {o.firstName} {o.lastName} · {o.email}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {o.address}, {o.postalCode} {o.city}, {o.country}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-display text-xl">{formatPrice(o.total)}</p>
                  <form action={updateOrderStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <select name="status" defaultValue={o.status} className="field !w-auto !py-2 !text-xs capitalize">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-sm">Update</button>
                  </form>
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-3 border-t border-charcoal/10 pt-4">
                {items
                  .filter((i) => i.orderId === o.id)
                  .map((i) => (
                    <li key={i.id} className="flex items-center gap-3 rounded-2xl bg-ivory px-3 py-2 text-xs">
                      <span className="relative h-10 w-8 overflow-hidden rounded-lg bg-stone">
                        <Image src={i.image} alt="" fill sizes="32px" className="object-cover object-top" />
                      </span>
                      <span>
                        {i.name} · {i.colorName} · {i.size} × {i.quantity}
                      </span>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
