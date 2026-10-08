import Link from "next/link";
import { ORDER_STATUSES, formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/orders";

export default function OrdersTable({ rows }: { rows: Order[] }) {
  if (!rows.length) return <p className="p-5 text-sm text-stone-500">Không có đơn hàng.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase text-stone-500">
          <tr><th className="px-5 py-3">Mã đơn</th><th className="px-5 py-3">Khách hàng</th><th className="px-5 py-3">Khu vực</th><th className="px-5 py-3">Tổng</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Thời gian</th></tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((o) => (
            <tr key={o.id} className="hover:bg-stone-50">
              <td className="px-5 py-3 font-mono font-semibold"><Link href={`/admin/don-hang/${o.id}`} className="text-brand-700 hover:underline">{o.code}</Link></td>
              <td className="px-5 py-3">{o.customer_name}<br /><span className="text-xs text-stone-500">{o.phone}</span></td>
              <td className="px-5 py-3">{o.district}</td>
              <td className="px-5 py-3 font-semibold">{formatPrice(o.total)}</td>
              <td className="px-5 py-3"><span className={`badge ${ORDER_STATUSES[o.status].color}`}>{ORDER_STATUSES[o.status].label}</span></td>
              <td className="px-5 py-3 text-stone-500">{formatDateTime(o.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
