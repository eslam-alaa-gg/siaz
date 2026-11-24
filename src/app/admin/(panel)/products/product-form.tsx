"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveProductAction } from "../../actions";
import { CATEGORIES, COLLECTIONS, SIZES } from "@/lib/collections";

type ColorState = {
  id?: number;
  name: string;
  hex: string;
  image: string;
  stock: Record<string, number>;
};

export type ProductFormValue = {
  id?: number;
  name: string;
  slug: string;
  category: string;
  collection: string;
  tagline: string;
  description: string;
  material: string;
  price: number;
  isNew: boolean;
  isBestseller: boolean;
  isActive: boolean;
  colors: ColorState[];
};

const emptyColor = (): ColorState => ({
  name: "",
  hex: "#1f1f1f",
  image: "",
  stock: Object.fromEntries(SIZES.map((s) => [s, 0])),
});

export function ProductForm({ initial }: { initial?: ProductFormValue }) {
  const [v, setV] = useState<ProductFormValue>(
    initial ?? {
      name: "",
      slug: "",
      category: CATEGORIES[0].slug,
      collection: COLLECTIONS[0].slug,
      tagline: "",
      description: "",
      material: "",
      price: 100,
      isNew: true,
      isBestseller: false,
      isActive: true,
      colors: [emptyColor()],
    },
  );
  const [state, action, pending] = useActionState(saveProductAction, undefined);

  const set = <K extends keyof ProductFormValue>(k: K, val: ProductFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));
  const setColor = (i: number, patch: Partial<ColorState>) =>
    setV((p) => ({ ...p, colors: p.colors.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="payload" value={JSON.stringify(v)} />

      <section className="grid gap-4 rounded-3xl bg-soft p-6 md:grid-cols-2">
        <Field label="Name">
          <input className="field" required value={v.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Slug (optional)">
          <input className="field" value={v.slug} placeholder="auto-generated" onChange={(e) => set("slug", e.target.value)} />
        </Field>
        <Field label="Category">
          <select className="field" value={v.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Collection">
          <select className="field" value={v.collection} onChange={(e) => set("collection", e.target.value)}>
            {COLLECTIONS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Price (USD)">
          <input
            className="field"
            type="number"
            min={1}
            required
            value={v.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </Field>
        <Field label="Tagline">
          <input className="field" value={v.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description">
            <textarea className="field min-h-28" value={v.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Material & care">
            <textarea className="field min-h-20" value={v.material} onChange={(e) => set("material", e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6 md:col-span-2">
          <Toggle label="New arrival" checked={v.isNew} onChange={(c) => set("isNew", c)} />
          <Toggle label="Best seller" checked={v.isBestseller} onChange={(c) => set("isBestseller", c)} />
          <Toggle label="Visible in store" checked={v.isActive} onChange={(c) => set("isActive", c)} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium tracking-tight">Colours, images & stock</h2>
          <button type="button" className="btn btn-sm" onClick={() => set("colors", [...v.colors, emptyColor()])}>
            Add colour
          </button>
        </div>
        <p className="text-xs text-muted">
          Each colour needs its own front-facing photograph (one garment, one view). Use a path such as
          /images/products/tee-black.jpg or a full https URL.
        </p>
        {v.colors.map((c, i) => (
          <div key={i} className="grid gap-5 rounded-3xl bg-soft p-6 md:grid-cols-[120px_1fr]">
            <div className="relative aspect-[3/4] w-28 overflow-hidden rounded-2xl bg-stone md:w-full">
              {c.image && <Image src={c.image} alt="" fill sizes="120px" className="object-cover object-top" />}
            </div>
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
                <input className="field" placeholder="Colour name" value={c.name} onChange={(e) => setColor(i, { name: e.target.value })} />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label="Colour swatch"
                    value={c.hex}
                    onChange={(e) => setColor(i, { hex: e.target.value })}
                    className="h-11 w-11 shrink-0 cursor-pointer rounded-full border border-charcoal/20 bg-transparent p-1"
                  />
                  <input className="field !px-3 !text-xs" value={c.hex} onChange={(e) => setColor(i, { hex: e.target.value })} />
                </div>
                {v.colors.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm !text-red-800"
                    onClick={() => set("colors", v.colors.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                className="field"
                placeholder="Image path or URL"
                value={c.image}
                onChange={(e) => setColor(i, { image: e.target.value })}
              />
              <div>
                <p className="eyebrow mb-2">Stock by size</p>
                <div className="grid grid-cols-5 gap-2">
                  {SIZES.map((s) => (
                    <label key={s} className="block text-center text-xs">
                      <span className="mb-1 block font-semibold">{s}</span>
                      <input
                        type="number"
                        min={0}
                        className="field !px-2 text-center"
                        value={c.stock[s] ?? 0}
                        onChange={(e) =>
                          setColor(i, { stock: { ...c.stock, [s]: Math.max(0, Number(e.target.value) || 0) } })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {state?.error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}
      <div className="flex gap-3">
        <button disabled={pending} className="btn btn-strong">
          {pending ? "Saving…" : initial?.id ? "Save changes" : "Create product"}
        </button>
        <a href="/admin/products" className="btn">
          Cancel
        </a>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block px-2 text-xs font-semibold">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-charcoal" />
      {label}
    </label>
  );
}
