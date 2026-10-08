import type { Metadata } from "next";
import CheckoutForm from "./CheckoutForm";
import CheckoutSteps from "@/components/CheckoutSteps";

export const metadata: Metadata = { title: "Đặt hàng", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <div className="container-x py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-800 sm:text-3xl">Thông tin đặt hàng</h1>
        <div className="sm:w-[420px]"><CheckoutSteps current={2} /></div>
      </div>
      <CheckoutForm />
    </div>
  );
}
