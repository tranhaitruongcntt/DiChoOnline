import type { Metadata } from "next";
import CartView from "./CartView";

export const metadata: Metadata = { title: "Giỏ hàng", robots: { index: false, follow: false } };

export default function CartPage() {
  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-bold text-stone-800">Giỏ hàng của bạn</h1>
      <CartView />
    </div>
  );
}
