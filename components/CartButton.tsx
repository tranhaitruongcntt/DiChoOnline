"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { CartIcon } from "./AddToCartButton";
import { formatPrice } from "@/lib/format";

export default function CartButton() {
  const { count, subtotal, ready } = useCart();
  return (
    <Link href="/gio-hang" className="relative flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-white shadow-sm transition hover:bg-brand-700" aria-label={`Giỏ hàng: ${count} sản phẩm`}>
      <CartIcon className="h-5 w-5" />
      <span className="hidden text-sm font-semibold sm:inline">{ready ? formatPrice(subtotal) : "Giỏ hàng"}</span>
      {ready && count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
