"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AddToCartButton from "./AddToCartButton";
import type { CartItem } from "./CartProvider";
import { formatPrice } from "@/lib/format";

/** Thanh mua nhanh trên điện thoại – hiện khi nút "Thêm vào giỏ" chính đã cuộn qua khỏi màn hình. */
export default function StickyBuyBar({ product, targetId }: { product: Omit<CartItem, "qty">; targetId: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let frame = 0;
    const update = () => { frame = 0; setShow(el.getBoundingClientRect().bottom < 0); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [targetId]);
  if (!show) return null;
  // Portal ra <body>: tránh bị lệch khi phần tử cha có transform (hiệu ứng chuyển động)
  return createPortal(
    <div className="fixed inset-x-0 bottom-[calc(57px+env(safe-area-inset-bottom))] z-30 animate-toast-in border-t border-stone-200 bg-white/95 px-4 py-2.5 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.2)] backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-stone-500">{product.name}</p>
          <p className="font-display text-lg font-bold leading-tight text-brand-700">{formatPrice(product.price)}<span className="text-xs font-normal text-stone-500"> /{product.unit}</span></p>
        </div>
        <div className="w-40 shrink-0"><AddToCartButton product={product} /></div>
      </div>
    </div>,
    document.body,
  );
}
