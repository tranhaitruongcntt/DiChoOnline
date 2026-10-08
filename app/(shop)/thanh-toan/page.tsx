import type { Metadata } from "next";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = { title: "Đặt hàng", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-bold text-stone-800">Thông tin đặt hàng</h1>
      <CheckoutForm />
    </div>
  );
}
