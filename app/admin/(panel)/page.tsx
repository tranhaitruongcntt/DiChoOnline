import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDashboardStats, listOrders } from "@/lib/orders";
import OrdersTable from "@/components/admin/OrdersTable";
import { formatPrice, type OrderStatus } from "@/lib/format";

export default async function Dashboard() {
  await requireAdmin();
  const s = getDashboardStats();
  const recent = listOrders({ pageSize: 8 }).rows;
  const count = (k: OrderStatus) => s.byStatus.find((b) => b.status === k)?.n ?? 0;
  const maxV = Math.max(1, ...s.daily.map((d) => d.v));

  return (
    <>
      <h1 className="text-2xl font-bold">Tổng quan</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Đơn hôm nay" value={String(s.today.orders)} />
        <Stat label="Doanh thu hôm nay" value={formatPrice(s.today.revenue)} />
        <Stat label="Chờ xác nhận" value={String(count("pending"))} highlight={count("pending") > 0} href="/admin/don-hang?status=pending" />
        <Stat label="Doanh thu hoàn thành 30 ngày" value={formatPrice(s.revenue30)} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="card p-5">
          <h2 className="font-semibold">Doanh thu 7 ngày gần nhất</h2>
          {s.daily.length ? (
            <ul className="mt-4 flex h-44 items-end gap-3">
              {s.daily.map((d) => (
                <li key={d.d} className="flex flex-1 flex-col items-center gap-1 text-xs text-stone-500">
                  <span className="font-medium text-stone-700">{d.n} đơn</span>
                  <div className="w-full rounded-t-md bg-brand-500" style={{ height: `${Math.max(4, (d.v / maxV) * 120)}px` }} title={formatPrice(d.v)} />
                  <span>{d.d.slice(5).split("-").reverse().join("/")}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 text-sm text-stone-500">Chưa có dữ liệu.</p>}
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">⚠️ Sắp hết hàng</h2>
          <ul className="mt-3 divide-y divide-stone-100 text-sm">
            {s.lowStock.length ? s.lowStock.map((p) => (
              <li key={p.id} className="flex justify-between py-2">
                <Link href={`/admin/san-pham/${p.id}`} className="hover:text-brand-700">{p.name}</Link>
                <span className={p.stock === 0 ? "font-semibold text-rose-600" : "text-amber-700"}>{p.stock}</span>
              </li>
            )) : <li className="py-2 text-stone-500">Tồn kho ổn định.</li>}
          </ul>
        </section>
      </div>

      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-5"><h2 className="font-semibold">Đơn hàng mới</h2><Link href="/admin/don-hang" className="text-sm text-brand-700 hover:underline">Xem tất cả →</Link></div>
        <OrdersTable rows={recent} />
      </section>
    </>
  );
}

function Stat({ label, value, highlight, href }: { label: string; value: string; highlight?: boolean; href?: string }) {
  const body = (
    <div className={`card p-5 ${highlight ? "ring-2 ring-amber-300" : ""}`}>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-stone-900">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
