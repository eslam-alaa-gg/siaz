import Image from "next/image";
import Link from "next/link";
import { getAllProducts, totalStock } from "@/lib/data";
import { categoryLabel } from "@/lib/collections";
import { formatPrice } from "@/lib/format";
import { deleteProductAction, toggleActiveAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await getAllProducts(true);
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl font-medium tracking-[-0.04em]">Products</h1>
        <Link href="/admin/products/new" className="btn btn-strong">
          New product
        </Link>
      </div>
      <div className="overflow-hidden rounded-3xl bg-soft">
        <ul className="divide-y divide-charcoal/10">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-4 md:flex-nowrap">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-stone">
                {p.colors[0] && <Image src={p.colors[0].image} alt="" fill sizes="64px" className="object-cover object-top" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/products/${p.id}`} className="block truncate text-sm font-semibold hover:underline">
                  {p.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted">
                  {categoryLabel(p.category)} · {p.colors.length} {p.colors.length === 1 ? "colour" : "colours"} ·{" "}
                  {totalStock(p)} in stock
                </p>
              </div>
              <p className="w-20 text-sm">{formatPrice(p.price)}</p>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                  p.isActive ? "border-emerald-700/30 text-emerald-800" : "border-charcoal/20 text-muted"
                }`}
              >
                {p.isActive ? "Live" : "Hidden"}
              </span>
              <div className="flex items-center gap-2">
                <form action={toggleActiveAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="active" value={p.isActive ? "0" : "1"} />
                  <button className="btn btn-sm">{p.isActive ? "Hide" : "Publish"}</button>
                </form>
                <Link href={`/admin/products/${p.id}`} className="btn btn-sm">
                  Edit
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="btn btn-sm !text-red-800">Delete</button>
                </form>
              </div>
            </li>
          ))}
          {products.length === 0 && <li className="p-10 text-center text-sm text-muted">No products yet.</li>}
        </ul>
      </div>
    </div>
  );
}
