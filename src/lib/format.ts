export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const FREE_SHIPPING_THRESHOLD = 250;
export function shippingCost(subtotal: number, method: string) {
  if (method === "express") return 24;
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 12;
}
