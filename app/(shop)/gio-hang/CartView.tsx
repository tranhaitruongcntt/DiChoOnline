"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import ProductVisual from "@/components/ProductVisual";
import OrderSummary from "@/components/OrderSummary";
import { formatPrice } from "@/lib/format";

export default function CartView() {
  const { items, ready, setQty, remove, subtotal } = useCart();

  if (!ready) return <div className="card mt-6 h-40 animate-pulse" />;
  if (!items.length)
    return (
      <div className="card mt-6 p-12 text-center">
        <p className="text-6xl" aria-hidden>🧺</p>
        <p className="mt-4 text-stone-600">Giỏ hàng đang trống.</p>
        <Link href="/" className="btn-primary mt-6">Tiếp tục mua sắm</Link>
      </div>
    );

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
      <ul className="card divide-y divide-stone-100">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-4 p-4">
            <Link href={`/san-pham/${i.slug}`} className="w-20 shrink-0"><ProductVisual icon={i.icon} name={i.name} category={i.category} /></Link>
            <div className="min-w-0 flex-1">
              <Link href={`/san-pham/${i.slug}`} className="font-semibold text-stone-800 hover:text-brand-700">{i.name}</Link>
              <p className="text-sm text-stone-500">{formatPrice(i.price)} / {i.unit}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-stone-300">
                  <button type="button" aria-label="Giảm" className="px-2.5 py-1" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">{i.qty}</span>
                  <button type="button" aria-label="Tăng" className="px-2.5 py-1 disabled:opacity-40" disabled={i.qty >= i.maxQty} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                </div>
                <button type="button" onClick={() => remove(i.id)} className="text-sm text-rose-600 hover:underline">Xoá</button>
              </div>
            </div>
            <p className="font-bold text-stone-800">{formatPrice(i.price * i.qty)}</p>
          </li>
        ))}
      </ul>
      <aside>
        <OrderSummary subtotal={subtotal}>
          <Link href="/thanh-toan" className="btn-primary mt-4 w-full py-3 text-base">Tiến hành đặt hàng</Link>
        </OrderSummary>
      </aside>
    </div>
  );
}
