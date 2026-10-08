"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShoppingBasket, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { CartIcon } from "./AddToCartButton";
import { ProductIcon } from "./icons";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

/** Nút giỏ hàng ở header + giỏ hàng xem nhanh khi rê chuột (desktop). */
export default function CartButton() {
  const { items, count, subtotal, ready, remove } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => setOpen(false), [pathname]);

  const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 768px)").matches;
  const enter = () => { if (!canHover() || pathname.startsWith("/gio-hang") || pathname.startsWith("/thanh-toan")) return; clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), 120); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 200); };
  const remain = site.freeShipThreshold - subtotal;

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link href="/gio-hang" className="relative flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-white shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow-md active:scale-95" aria-label={`Giỏ hàng: ${count} sản phẩm`}>
        <CartIcon className="h-5 w-5" />
        <span className="hidden text-sm font-semibold tabular-nums sm:inline">{ready ? formatPrice(subtotal) : "Giỏ hàng"}</span>
        {ready && count > 0 && (
          <span key={count} className="absolute -right-2 -top-2 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>

      {open && (
        <div className="absolute right-0 top-full z-50 w-96 pt-3">
          <span aria-hidden className="absolute right-6 top-[7px] h-3 w-3 rotate-45 rounded-tl-sm border-l border-t border-stone-200 bg-white" />
          <div className="animate-toast-in overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-800 shadow-2xl shadow-stone-900/15">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBasket className="mx-auto h-12 w-12 text-stone-300" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-stone-500">Giỏ hàng đang trống</p>
              </div>
            ) : (
              <>
                <p className="border-b border-stone-100 px-4 py-3 text-sm font-semibold">Giỏ hàng <span className="font-normal text-stone-400">({count} sản phẩm)</span></p>
                <ul className="max-h-72 divide-y divide-stone-100 overflow-y-auto">
                  {items.map((i) => (
                    <li key={i.id} className="group flex items-center gap-3 px-4 py-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {i.image ? <Image src={i.image} alt="" fill sizes="48px" className="object-cover" /> : <span className="grid h-full place-items-center"><ProductIcon name={i.icon} className="h-5 w-5 text-brand-600" /></span>}
                      </span>
                      <Link href={`/san-pham/${i.slug}`} className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium hover:text-brand-700">{i.name}</span>
                        <span className="text-xs text-stone-500">{i.qty} × {formatPrice(i.price)}</span>
                      </Link>
                      <span className="text-sm font-semibold tabular-nums">{formatPrice(i.qty * i.price)}</span>
                      <button type="button" onClick={() => remove(i.id)} aria-label={`Xoá ${i.name}`} className="grid h-7 w-7 place-items-center rounded-lg text-stone-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 group-hover:opacity-100"><X className="h-4 w-4" /></button>
                    </li>
                  ))}
                </ul>
                <div className="space-y-3 border-t border-stone-100 bg-stone-50 p-4">
                  {remain > 0 ? (
                    <p className="text-xs text-stone-500">Mua thêm <strong className="text-brand-700">{formatPrice(remain)}</strong> để được miễn phí giao hàng</p>
                  ) : (
                    <p className="text-xs font-medium text-brand-700">Đơn hàng của bạn được miễn phí giao hàng</p>
                  )}
                  <p className="flex items-baseline justify-between"><span className="text-sm text-stone-500">Tạm tính</span><span className="font-display text-lg font-bold text-brand-700">{formatPrice(subtotal)}</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/gio-hang" className="btn-outline">Xem giỏ hàng</Link>
                    <Link href="/thanh-toan" className="btn-primary">Đặt hàng</Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
