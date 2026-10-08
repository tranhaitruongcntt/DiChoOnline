"use client";

import { MapPin, User, Wallet } from "lucide-react";

import Link from "next/link";
import { useActionState } from "react";
import { useCart } from "@/components/CartProvider";
import OrderSummary from "@/components/OrderSummary";
import { DELIVERY_SLOTS, DISTRICTS, PAYMENT_METHODS, formatPrice } from "@/lib/format";
import { placeOrder, type CheckoutState } from "./actions";

export default function CheckoutForm() {
  const { items, ready, subtotal } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const fe = state.fieldErrors ?? {};

  if (!ready) return <div className="skeleton mt-6 h-64 w-full rounded-2xl" />;
  if (!items.length)
    return (
      <div className="card mt-6 p-12 text-center">
        <p className="text-stone-600">Giỏ hàng đang trống.</p>
        <Link href="/" className="btn-primary mt-4">Mua sắm ngay</Link>
      </div>
    );

  const Err = ({ k }: { k: string }) => (fe[k] ? <p className="mt-1 text-xs text-rose-600" id={`${k}-err`}>{fe[k]}</p> : null);
  const aria = (k: string) => ({ "aria-invalid": !!fe[k] || undefined, "aria-describedby": fe[k] ? `${k}-err` : undefined });

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]" noValidate={false}>
      <div className="space-y-6">
        {state.error && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">{state.error}</div>}

        <fieldset className="card grid gap-4 p-5 sm:grid-cols-2">
          <legend className="sr-only">Người nhận</legend>
          <h2 className="flex items-center gap-2 text-lg font-bold sm:col-span-2"><User className="h-5 w-5 text-brand-600" aria-hidden /> Người nhận</h2>
          <div>
            <label htmlFor="customer_name" className="label">Họ và tên *</label>
            <input id="customer_name" name="customer_name" required minLength={2} maxLength={80} autoComplete="name" className="input" {...aria("customer_name")} />
            <Err k="customer_name" />
          </div>
          <div>
            <label htmlFor="phone" className="label">Số điện thoại *</label>
            <input id="phone" name="phone" type="tel" required inputMode="tel" maxLength={15} autoComplete="tel" placeholder="09xx xxx xxx" className="input" {...aria("phone")} />
            <Err k="phone" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="label">Email (không bắt buộc)</label>
            <input id="email" name="email" type="email" maxLength={120} autoComplete="email" className="input" {...aria("email")} />
            <Err k="email" />
          </div>
        </fieldset>

        <fieldset className="card grid gap-4 p-5 sm:grid-cols-2">
          <legend className="sr-only">Giao hàng</legend>
          <h2 className="flex items-center gap-2 text-lg font-bold sm:col-span-2"><MapPin className="h-5 w-5 text-brand-600" aria-hidden /> Giao hàng</h2>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="label">Địa chỉ (số nhà, đường, phường) *</label>
            <input id="address" name="address" required minLength={5} maxLength={200} autoComplete="street-address" className="input" {...aria("address")} />
            <Err k="address" />
          </div>
          <div>
            <label htmlFor="district" className="label">Quận/Huyện (TP.HCM) *</label>
            <select id="district" name="district" required defaultValue="" className="input" {...aria("district")}>
              <option value="" disabled>-- Chọn --</option>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <Err k="district" />
          </div>
          <div>
            <label htmlFor="delivery_slot" className="label">Thời gian nhận *</label>
            <select id="delivery_slot" name="delivery_slot" required defaultValue={DELIVERY_SLOTS[0]} className="input">
              {DELIVERY_SLOTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="note" className="label">Ghi chú</label>
            <textarea id="note" name="note" rows={3} maxLength={500} placeholder="VD: gọi trước khi giao, chọn cá con to…" className="input" />
          </div>
        </fieldset>

        <fieldset className="card space-y-3 p-5">
          <legend className="sr-only">Thanh toán</legend>
          <h2 className="flex items-center gap-2 text-lg font-bold"><Wallet className="h-5 w-5 text-brand-600" aria-hidden /> Thanh toán</h2>
          {(Object.keys(PAYMENT_METHODS) as (keyof typeof PAYMENT_METHODS)[]).map((k, i) => (
            <label key={k} className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
              <input type="radio" name="payment_method" value={k} defaultChecked={i === 0} className="accent-brand-600" />
              <span className="text-sm font-medium">{PAYMENT_METHODS[k]}</span>
            </label>
          ))}
        </fieldset>

        {/* Honeypot chống bot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ productId: i.id, quantity: i.qty })))} />
      </div>

      <aside>
        <OrderSummary subtotal={subtotal}>
          <ul className="mt-4 max-h-60 space-y-2 overflow-auto border-t border-stone-100 pt-4 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2"><span className="truncate">{i.name} × {i.qty}</span><span className="shrink-0">{formatPrice(i.price * i.qty)}</span></li>
            ))}
          </ul>
          <button type="submit" disabled={pending} className="btn-primary mt-4 w-full py-3 text-base">{pending ? "Đang đặt hàng…" : "Xác nhận đặt hàng"}</button>
          <p className="mt-3 text-center text-xs text-stone-500">Giá cuối cùng được xác nhận theo bảng giá hiện tại của cửa hàng.</p>
        </OrderSummary>
      </aside>
    </form>
  );
}
