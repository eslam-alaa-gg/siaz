"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { CATEGORIES } from "@/lib/collections";
import { SearchIcon } from "./icons";

const SORTS = [
  { v: "", l: "Newest" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
  { v: "name", l: "Name A–Z" },
];

export function ShopFilters({ colors, total }: { colors: { name: string; hex: string }[]; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const category = params.get("category") ?? "";
  const color = params.get("color") ?? "";
  const sort = params.get("sort") ?? "";
  const collection = params.get("collection");

  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    start(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  }

  const hasFilters = !!(category || color || sort || params.get("q") || collection || params.get("bestsellers"));

  return (
    <div className="mb-10 space-y-5">
      <div className="hide-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0">
        {[{ slug: "", label: "All" }, ...CATEGORIES].map((c) => {
          const active = category === c.slug;
          return (
            <button
              key={c.slug}
              onClick={() => update({ category: c.slug })}
              aria-pressed={active}
              className={`btn btn-sm shrink-0 ${active ? "!border-charcoal !bg-charcoal !text-ivory" : ""}`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: q.trim() });
          }}
          className="relative w-full md:max-w-sm"
          role="search"
        >
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => q.trim() !== (params.get("q") ?? "") && update({ q: q.trim() })}
            placeholder="Search products"
            aria-label="Search products"
            className="field !py-2.5 !pl-11 !text-[13px]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Filter by colour">
            <span className="mr-1 text-xs text-muted">Colour</span>
            {colors.map(({ name: c, hex }) => {
              const active = color.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  role="radio"
                  aria-checked={active}
                  aria-label={c}
                  title={c}
                  onClick={() => update({ color: active ? "" : c })}
                  className={`h-[22px] w-[22px] rounded-full border p-[2.5px] transition active:scale-90 ${
                    active ? "border-charcoal" : "border-transparent hover:border-charcoal/30"
                  }`}
                >
                  <span
                    className="block h-full w-full rounded-full border border-charcoal/15"
                    style={{ background: hex }}
                  />
                </button>
              );
            })}
          </div>

          <label className="relative flex items-center">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="field cursor-pointer appearance-none !w-auto !py-2.5 !pl-5 !pr-10 !text-[13px]"
            >
              {SORTS.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-4 h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="m2 4.5 4 4 4-4" />
            </svg>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted" aria-live="polite">
        <span className={pending ? "opacity-50" : ""}>
          {total} {total === 1 ? "piece" : "pieces"}
        </span>
        {hasFilters && (
          <button
            onClick={() => {
              setQ("");
              start(() => router.replace(pathname, { scroll: false }));
            }}
            className="link-underline text-charcoal"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
