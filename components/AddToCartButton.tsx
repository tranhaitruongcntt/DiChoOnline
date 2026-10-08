"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "./CartProvider";

type Props = { product: Omit<CartItem, "qty">; withQty?: boolean };

export default function AddToCartButton({ product, withQty = false }: Props) {
  const { add, items, setQty: setCartQty, ready } = useCart();
  const inCart = ready ? items.find((i) => i.id === product.id) : undefined;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.maxQty <= 0;

  const onAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  if (outOfStock) return <button className="btn-outline w-full" disabled>Tạm hết hàng</button>;

  // Thẻ sản phẩm: khi đã có trong giỏ thì hiện bộ tăng/giảm số lượng ngay trên thẻ
  if (!withQty && inCart) {
    return (
      <div className="flex h-10 animate-fade-in items-center justify-between rounded-xl bg-brand-50 ring-1 ring-brand-200">
        <button type="button" onClick={() => setCartQty(product.id, inCart.qty - 1)} aria-label={`Giảm số lượng ${product.name}`}
          className="grid h-10 w-10 place-items-center rounded-xl text-brand-700 transition-colors hover:bg-brand-100 active:scale-90"><Minus className="h-4 w-4" /></button>
        <span key={inCart.qty} className="animate-pop text-sm font-bold tabular-nums text-brand-800" aria-live="polite">{inCart.qty}<span className="sr-only"> trong giỏ</span></span>
        <button type="button" onClick={() => setCartQty(product.id, inCart.qty + 1)} disabled={inCart.qty >= Math.min(product.maxQty, 99)} aria-label={`Tăng số lượng ${product.name}`}
          className="grid h-10 w-10 place-items-center rounded-xl text-brand-700 transition-colors hover:bg-brand-100 active:scale-90 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {withQty && (
        <div className="flex items-center rounded-xl border border-stone-300 bg-white">
          <button type="button" aria-label="Giảm" className="px-3 py-2.5 text-lg leading-none" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
          <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" aria-label="Tăng" className="px-3 py-2.5 text-lg leading-none" onClick={() => setQty((q) => Math.min(product.maxQty, 99, q + 1))}><Plus className="h-4 w-4" /></button>
        </div>
      )}
      <button type="button" onClick={onAdd} className={`btn-primary flex-1 ${added ? "bg-brand-700" : ""}`} aria-label={`Thêm ${product.name} vào giỏ`}>
        {added ? (<><Check className="h-4 w-4 animate-pop" aria-hidden /> Đã thêm</>) : (<><CartIcon /> {withQty ? "Thêm vào giỏ" : (<><span className="sm:hidden">Thêm</span><span className="hidden sm:inline">Thêm vào giỏ</span></>)}</>)}
      </button>
    </div>
  );
}

export function CartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <ShoppingCart className={className} aria-hidden />;
}
