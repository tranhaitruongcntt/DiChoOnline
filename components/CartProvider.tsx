"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: number; slug: string; name: string; price: number; unit: string; icon: string; image?: string | null; category: string; qty: number; maxQty: number };
type CartCtx = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  /** Sản phẩm vừa thêm gần nhất – dùng cho thông báo nhỏ (toast) */
  lastAdded: { name: string; image?: string | null; at: number } | null;
};

const KEY = "dicho_cart_v1";
const MAX_LINES = 50;
const Ctx = createContext<CartCtx | null>(null);

// Lưu ngay khi thay đổi (không đợi effect) để không mất giỏ nếu người dùng chuyển trang tức thì
function persist(next: CartItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* bộ nhớ đầy hoặc chế độ riêng tư */ }
  return next;
}

function load(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((i) => Number.isInteger(i?.id) && typeof i?.name === "string" && Number.isInteger(i?.qty) && i.qty > 0)
      .slice(0, MAX_LINES);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartCtx["lastAdded"]>(null);

  useEffect(() => {
    setItems(load());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setItems(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* bộ nhớ đầy hoặc chế độ riêng tư */ }
  }, [items, ready]);

  const add = useCallback<CartCtx["add"]>((item, qty = 1) => {
    setLastAdded({ name: item.name, image: item.image, at: Date.now() });
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) return persist(prev.map((i) => (i.id === item.id ? { ...i, ...item, qty: Math.min(i.qty + qty, item.maxQty, 99) } : i)));
      if (prev.length >= MAX_LINES) return prev;
      return persist([...prev, { ...item, qty: Math.min(qty, item.maxQty, 99) }]);
    });
  }, []);
  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, i.maxQty, 99) } : i))));
  }, []);
  const remove = useCallback((id: number) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items, ready, add, setQty, remove, clear, lastAdded,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    [items, ready, add, setQty, remove, clear, lastAdded],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart phải nằm trong CartProvider");
  return ctx;
}
