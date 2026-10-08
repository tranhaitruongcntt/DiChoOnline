import type { Metadata } from "next";
import LookupForm from "./LookupForm";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Tra cứu tình trạng đơn hàng Đi Chợ Online bằng mã đơn và số điện thoại.",
  alternates: { canonical: "/tra-cuu-don-hang" },
};

export default function LookupPage() {
  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-stone-800">Tra cứu đơn hàng</h1>
        <p className="mt-1 text-stone-600">Nhập mã đơn hàng và số điện thoại bạn đã dùng khi đặt.</p>
        <LookupForm />
      </div>
    </div>
  );
}
