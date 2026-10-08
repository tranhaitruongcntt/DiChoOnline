import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listOrders } from "@/lib/orders";
import { ORDER_STATUSES } from "@/lib/format";
import OrdersTable from "@/components/admin/OrdersTable";

export const metadata: Metadata = { title: "Đơn hàng" };

type Props = { searchParams: Promise<{ status?: string; q?: string; page?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const status = sp.status && sp.status in ORDER_STATUSES ? sp.status : undefined;
  const q = (sp.q ?? "").trim().slice(0, 50);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const data = listOrders({ status, q, page });
  const link = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status, q: q || undefined, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    return `/admin/don-hang${p.size ? `?${p}` : ""}`;
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Đơn hàng</h1>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link href={link({ status: undefined, page: undefined })} className={`badge px-3 py-1.5 ${!status ? "bg-stone-800 text-white" : "bg-white ring-1 ring-stone-200"}`}>Tất cả</Link>
        {Object.entries(ORDER_STATUSES).map(([k, v]) => (
          <Link key={k} href={link({ status: k, page: undefined })} className={`badge px-3 py-1.5 ${status === k ? "bg-stone-800 text-white" : "bg-white ring-1 ring-stone-200"}`}>{v.label}</Link>
        ))}
        <form className="ml-auto flex gap-2" action="/admin/don-hang">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} maxLength={50} placeholder="Mã đơn, SĐT, tên…" className="input w-56 py-2" />
          <button className="btn-outline py-2">Tìm</button>
        </form>
      </div>
      <section className="card mt-5 overflow-hidden">
        <OrdersTable rows={data.rows} />
        <div className="flex items-center justify-between border-t border-stone-100 px-5 py-3 text-sm text-stone-500">
          <span>{data.total} đơn · Trang {data.page}/{data.pageCount}</span>
          <span className="flex gap-2">
            {data.page > 1 && <Link className="btn-outline py-1.5" href={link({ page: String(data.page - 1) })}><ChevronLeft className="h-4 w-4" aria-hidden />Trước</Link>}
            {data.page < data.pageCount && <Link className="btn-outline py-1.5" href={link({ page: String(data.page + 1) })}>Sau<ChevronRight className="h-4 w-4" aria-hidden /></Link>}
          </span>
        </div>
      </section>
    </>
  );
}
