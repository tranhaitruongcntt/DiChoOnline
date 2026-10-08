"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "./CartProvider";

type Props = { product: Omit<CartItem, "qty">; withQty?: boolean };

export default function AddToCartButton({ product, withQty = false }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.maxQty <= 0;

  const onAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  if (outOfStock) return <button className="btn-outline w-full" disabled>Tạm hết hàng</button>;

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
        {added ? (<><Check className="h-4 w-4" aria-hidden /> Đã thêm</>) : (<><CartIcon /> Thêm vào giỏ</>)}
      </button>
    </div>
  );
}

export function CartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <ShoppingCart className={className} aria-hidden />;
}
