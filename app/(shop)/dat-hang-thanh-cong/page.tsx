import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "./ClearCart";

export const metadata: Metadata = { title: "Đặt hàng thành công", robots: { index: false, follow: false } };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ ma?: string }> }) {
  const raw = (await searchParams).ma ?? "";
  const code = /^DC[2-9A-HJKMNP-Z]{8}$/.test(raw) ? raw : null;
  return (
    <div className="container-x py-14">
      <ClearCart />
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-4xl" aria-hidden>✅</p>
        <h1 className="mt-5 text-2xl font-extrabold text-stone-900">Đặt hàng thành công!</h1>
        <p className="mt-2 text-stone-600">Cảm ơn bạn. Nhân viên sẽ gọi xác nhận đơn trong ít phút.</p>
        {code && (
          <div className="mt-6 rounded-2xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">Mã đơn hàng của bạn</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-brand-700">{code}</p>
            <p className="mt-2 text-xs text-stone-500">Hãy lưu lại mã này để tra cứu đơn hàng cùng số điện thoại đã đặt.</p>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/tra-cuu-don-hang" className="btn-outline">Tra cứu đơn hàng</Link>
          <Link href="/" className="btn-primary">Tiếp tục mua sắm</Link>
        </div>
      </div>
    </div>
  );
}
