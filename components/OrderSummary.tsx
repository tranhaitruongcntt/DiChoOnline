import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export default function OrderSummary({ subtotal, children }: { subtotal: number; children?: React.ReactNode }) {
  const ship = subtotal >= site.freeShipThreshold ? 0 : site.shippingFee;
  const remain = site.freeShipThreshold - subtotal;
  return (
    <div className="card sticky top-40 p-5">
      <h2 className="text-lg font-bold text-stone-800">Tóm tắt đơn hàng</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-stone-500">Tạm tính</dt><dd className="font-medium">{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-stone-500">Phí giao hàng</dt><dd className="font-medium">{ship ? formatPrice(ship) : "Miễn phí"}</dd></div>
        <div className="flex justify-between border-t border-stone-100 pt-3 text-base"><dt className="font-semibold">Tổng cộng</dt><dd className="font-extrabold text-brand-700">{formatPrice(subtotal + ship)}</dd></div>
      </dl>
      {remain > 0 && (
        <div className="mt-4">
          <p className="text-xs text-stone-500">Mua thêm <strong className="text-brand-700">{formatPrice(remain)}</strong> để được miễn phí giao hàng</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-brand-500" style={{ width: `${Math.min(100, (subtotal / site.freeShipThreshold) * 100)}%` }} /></div>
        </div>
      )}
      {children}
    </div>
  );
}
