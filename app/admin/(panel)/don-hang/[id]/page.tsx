import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { allowedNextStatuses, getOrderForAdmin } from "@/lib/orders";
import { ORDER_STATUSES, PAYMENT_METHODS, formatDateTime, formatPrice } from "@/lib/format";
import StatusForm from "./StatusForm";
import { saveNoteAction } from "../actions";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  const data = getOrderForAdmin(id);
  if (!data) notFound();
  const { order: o, items, events } = data;

  return (
    <>
      <Link href="/admin/don-hang" className="text-sm text-stone-500 hover:text-brand-700">← Danh sách đơn hàng</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-bold">{o.code}</h1>
        <span className={`badge ${ORDER_STATUSES[o.status].color}`}>{ORDER_STATUSES[o.status].label}</span>
        <span className="text-sm text-stone-500">Đặt lúc {formatDateTime(o.created_at)}</span>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="card overflow-hidden">
            <h2 className="p-5 font-semibold">Sản phẩm</h2>
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left text-xs uppercase text-stone-500"><tr><th className="px-5 py-2">Sản phẩm</th><th className="px-5 py-2 text-right">Đơn giá</th><th className="px-5 py-2 text-right">SL</th><th className="px-5 py-2 text-right">Thành tiền</th></tr></thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((i) => (
                  <tr key={i.id}><td className="px-5 py-2.5">{i.name} <span className="text-stone-400">({i.unit})</span></td><td className="px-5 py-2.5 text-right">{formatPrice(i.price)}</td><td className="px-5 py-2.5 text-right">{i.quantity}</td><td className="px-5 py-2.5 text-right font-medium">{formatPrice(i.line_total)}</td></tr>
                ))}
              </tbody>
              <tfoot className="text-sm">
                <tr><td colSpan={3} className="px-5 pt-3 text-right text-stone-500">Tạm tính</td><td className="px-5 pt-3 text-right">{formatPrice(o.subtotal)}</td></tr>
                <tr><td colSpan={3} className="px-5 text-right text-stone-500">Phí giao</td><td className="px-5 text-right">{formatPrice(o.shipping_fee)}</td></tr>
                <tr><td colSpan={3} className="px-5 pb-4 text-right font-semibold">Tổng</td><td className="px-5 pb-4 text-right text-lg font-extrabold text-brand-700">{formatPrice(o.total)}</td></tr>
              </tfoot>
            </table>
          </section>

          <section className="card p-5">
            <h2 className="font-semibold">Lịch sử xử lý</h2>
            <ol className="mt-3 space-y-3 border-l-2 border-stone-200 pl-4 text-sm">
              {events.map((e) => (
                <li key={e.id}>
                  <p><span className={`badge ${ORDER_STATUSES[e.status as keyof typeof ORDER_STATUSES]?.color ?? ""}`}>{ORDER_STATUSES[e.status as keyof typeof ORDER_STATUSES]?.label ?? e.status}</span> <span className="text-stone-500">· {formatDateTime(e.created_at)} · {e.actor}</span></p>
                  {e.note && <p className="mt-1 text-stone-600">{e.note}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-5 text-sm">
            <h2 className="font-semibold">Khách hàng</h2>
            <dl className="mt-3 space-y-2">
              <div><dt className="text-stone-500">Họ tên</dt><dd className="font-medium">{o.customer_name}</dd></div>
              <div><dt className="text-stone-500">Điện thoại</dt><dd><a href={`tel:${o.phone}`} className="font-medium text-brand-700">{o.phone}</a></dd></div>
              {o.email && <div><dt className="text-stone-500">Email</dt><dd>{o.email}</dd></div>}
              <div><dt className="text-stone-500">Địa chỉ</dt><dd>{o.address}, {o.district}</dd></div>
              <div><dt className="text-stone-500">Khung giờ</dt><dd>{o.delivery_slot}</dd></div>
              <div><dt className="text-stone-500">Thanh toán</dt><dd>{PAYMENT_METHODS[o.payment_method]}</dd></div>
              {o.note && <div><dt className="text-stone-500">Ghi chú của khách</dt><dd className="whitespace-pre-line rounded-lg bg-amber-50 p-2">{o.note}</dd></div>}
            </dl>
          </section>

          <section className="card p-5">
            <h2 className="font-semibold">Cập nhật trạng thái</h2>
            <StatusForm id={o.id} options={allowedNextStatuses(o.status)} />
          </section>

          <section className="card p-5">
            <h2 className="font-semibold">Ghi chú nội bộ</h2>
            <form action={saveNoteAction} className="mt-3 space-y-2">
              <input type="hidden" name="id" value={o.id} />
              <textarea name="admin_note" defaultValue={o.admin_note} rows={3} maxLength={1000} className="input" />
              <button className="btn-outline w-full">Lưu ghi chú</button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
