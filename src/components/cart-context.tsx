"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";

export type CartItem = {
  colorId: number;
  size: string;
  qty: number;
  productId: number;
  slug: string;
  name: string;
  colorName: string;
  image: string;
  price: number;
  max: number;
};

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (colorId: number, size: string, qty: number) => void;
  remove: (colorId: number, size: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "siaz-cart-v1";

export function Providers({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    const lock = cartOpen || searchOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen]);

  const add = useCallback<Ctx["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.colorId === item.colorId && p.size === item.size);
      if (i >= 0) {
        const next = [...prev];
        next[i] = {
          ...next[i],
          ...item,
          qty: Math.min(item.max, next[i].qty + qty),
        };
        return next;
      }
      return [...prev, { ...item, qty: Math.min(item.max, qty) }];
    });
  }, []);

  const setQty = useCallback<Ctx["setQty"]>((colorId, size, qty) => {
    setItems((prev) =>
      prev
        .map((p) =>
          p.colorId === colorId && p.size === size
            ? { ...p, qty: Math.max(0, Math.min(p.max, qty)) }
            : p,
        )
        .filter((p) => p.qty > 0),
    );
  }, []);

  const remove = useCallback<Ctx["remove"]>((colorId, size) => {
    setItems((prev) => prev.filter((p) => !(p.colorId === colorId && p.size === size)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Ctx>(
    () => ({
      items,
      count: items.reduce((a, b) => a + b.qty, 0),
      subtotal: items.reduce((a, b) => a + b.qty * b.price, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
    }),
    [items, ready, add, setQty, remove, clear, cartOpen, searchOpen],
  );

  return (
    <CartCtx.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within Providers");
  return c;
}
