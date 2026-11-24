import Link from "next/link";
import { getAllProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const products = await getAllProducts(true);
  const stats = [
    { label: "Demo products", value: products.length },
    { label: "Orders", value: "—" },
    { label: "Revenue", value: "—" },
    { label: "Subscribers", value: "—" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-[-0.04em]">Overview</h1>
        <p className="mt-2 text-sm text-muted">Demo mode · no database connected</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-soft p-6">
            <p className="eyebrow">{stat.label}</p>
            <p className="mt-3 font-display text-3xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>
      <section className="rounded-3xl bg-soft p-6 md:p-8">
        <h2 className="font-display text-xl font-medium">Demo environment</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          The catalogue is loaded from local sample data. Orders, newsletter sign-ups, inventory changes,
          and product edits are not persisted in this demo environment.
        </p>
        <Link href="/admin/products" className="btn mt-6">View sample products</Link>
      </section>
    </div>
  );
}
