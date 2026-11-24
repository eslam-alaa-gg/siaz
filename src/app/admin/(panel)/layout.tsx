import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAdmin } from "@/lib/admin-auth";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-4 md:px-8 md:pt-6">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-full border border-charcoal/10 bg-soft/70 px-5 py-2.5">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-xl font-bold tracking-[-0.05em]">
            SIAZ <span className="ml-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-[13px] font-medium">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-full px-3.5 py-2 transition hover:bg-charcoal/[0.06]">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="btn btn-sm">
            View store
          </Link>
          <form action={logoutAction}>
            <button className="btn btn-sm">Sign out</button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
