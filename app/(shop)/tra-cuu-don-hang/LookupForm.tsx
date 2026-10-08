"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { lookupAction } from "./actions";
import { ORDER_STATUSES, PAYMENT_METHODS, formatDateTime, formatPrice, type OrderStatus } from "@/lib/format";

const STEPS: OrderStatus[] = ["pending", "confirmed", "shipping", "completed"];

export default function LookupForm() {
  const [state, action, pending] = useActionState(lookupAction, {});
  const r = state.result;
  const { add } = useCart();
  const router = useRouter();
  const reorder = () => {
    if (!r) return;
    for (const { qty, ...p } of r.reorder) add(p, qty);
    router.push("/gio-hang");
  };
  return (
    <>
      <form action={action} className="card mt-6 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="code" className="label">Mã đơn hàng</label>
          <input id="code" name="code" required maxLength={12} placeholder="DCxxxxxxxx" className="input font-mono uppercase" autoComplete="off" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Số điện thoại</label>
          <input id="phone" name="phone" type="tel" required maxLength={15} className="input" autoComplete="tel" />
        </div>
        <button className="btn-primary" disabled={pending}>{pending ? "Đang tìm…" : "Tra cứu"}</button>
      </form>
      {state.error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">{state.error}</p>}
      {r && (
        <section className="card mt-6 p-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-mono text-lg font-bold">{r.code}</h2>
            <span className={`badge ${ORDER_STATUSES[r.status].color}`}>{ORDER_STATUSES[r.status].label}</span>
          </div>
          <p className="mt-1 text-sm text-stone-500">Đặt lúc {formatDateTime(r.created_at)} · {r.customer_name} · {r.address}</p>
          {r.status !== "cancelled" && (
            <ol className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">
              {STEPS.map((s, i) => {
                const done = STEPS.indexOf(r.status) >= i;
                return (
                  <li key={s}>
                    <div className={`h-1.5 rounded-full ${done ? "bg-brand-500" : "bg-stone-200"}`} />
                    <p className={`mt-1.5 ${done ? "font-semibold text-brand-700" : "text-stone-400"}`}>{ORDER_STATUSES[s].label}</p>
                  </li>
                );
              })}
            </ol>
          )}
          <ul className="mt-5 divide-y divide-stone-100 text-sm">
            {r.items.map((i, k) => (
              <li key={k} className="flex justify-between py-2"><span>{i.name} <span className="text-stone-400">({i.unit}) × {i.quantity}</span></span><span>{formatPrice(i.line_total)}</span></li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-sm">
            <div className="flex justify-between"><dt>Phí giao hàng</dt><dd>{r.shipping_fee ? formatPrice(r.shipping_fee) : "Miễn phí"}</dd></div>
            <div className="flex justify-between font-bold"><dt>Tổng cộng</dt><dd className="text-brand-700">{formatPrice(r.total)}</dd></div>
            <div className="flex justify-between text-stone-500"><dt>Thanh toán</dt><dd>{PAYMENT_METHODS[r.payment_method]}</dd></div>
            <div className="flex justify-between text-stone-500"><dt>Giao</dt><dd>{r.delivery_slot}</dd></div>
          </dl>
          {r.reorder.length > 0 && (
            <button type="button" onClick={reorder} className="btn-primary mt-5 w-full py-3 text-base">
              <RotateCcw className="h-4 w-4" /> Mua lại đơn này ({r.reorder.length} sản phẩm)
            </button>
          )}
        </section>
      )}
    </>
  );
}
