import type { Metadata } from "next";
import CartView from "./CartView";
import CheckoutSteps from "@/components/CheckoutSteps";
import { ProductGrid } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Giỏ hàng", robots: { index: false, follow: false } };

export default function CartPage() {
  const suggestions = getFeaturedProducts(5);
  return (
    <div className="container-x py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-800 sm:text-3xl">Giỏ hàng của bạn</h1>
        <div className="sm:w-[420px]"><CheckoutSteps current={1} /></div>
      </div>
      <CartView />
      <section className="mt-14" aria-labelledby="goi-y">
        <h2 id="goi-y" className="reveal text-xl font-bold text-stone-800 sm:text-2xl">Có thể bạn muốn mua thêm</h2>
        <div className="mt-5"><ProductGrid products={suggestions} /></div>
      </section>
    </div>
  );
}
