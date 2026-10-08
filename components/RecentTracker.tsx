"use client";

import { useEffect } from "react";
import type { CartItem } from "./CartProvider";

export const RECENT_VIEW_KEY = "dicho_recent_viewed";
export type RecentProduct = Omit<CartItem, "qty"> & { compare?: number | null };

/** Ghi lại sản phẩm vừa xem (tối đa 12) để hiển thị "Đã xem gần đây". */
export default function RecentTracker({ product }: { product: RecentProduct }) {
  useEffect(() => {
    try {
      const list: RecentProduct[] = JSON.parse(localStorage.getItem(RECENT_VIEW_KEY) || "[]");
      const next = [product, ...(Array.isArray(list) ? list : []).filter((p) => p?.id !== product.id)].slice(0, 12);
      localStorage.setItem(RECENT_VIEW_KEY, JSON.stringify(next));
    } catch { /* bỏ qua */ }
  }, [product]);
  return null;
}
