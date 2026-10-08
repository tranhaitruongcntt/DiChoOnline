import { Check, Plus, Star } from "lucide-react";
import { ProductIcon } from "@/components/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAllProducts } from "@/lib/admin-products";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Sản phẩm" };

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<{ q?: string; saved?: string }> }) {
  await requireAdmin();
  const { q = "", saved } = await searchParams;
  const rows = listAllProducts(q.slice(0, 50));
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <div className="flex gap-2">
          <form action="/admin/san-pham" className="flex gap-2"><input name="q" defaultValue={q} maxLength={50} placeholder="Tìm sản phẩm…" className="input w-52 py-2" /></form>
          <Link href="/admin/san-pham/moi" className="btn-primary"><Plus className="h-4 w-4" aria-hidden />Thêm sản phẩm</Link>
        </div>
      </div>
      {saved && <p className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-800 ring-1 ring-brand-200"><Check className="h-4 w-4" aria-hidden />Đã lưu sản phẩm.</p>}
      <section className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr><th className="px-5 py-3">Sản phẩm</th><th className="px-5 py-3">Danh mục</th><th className="px-5 py-3 text-right">Giá</th><th className="px-5 py-3 text-right">Tồn kho</th><th className="px-5 py-3">Hiển thị</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-5 py-3"><span className="inline-flex items-center gap-2"><ProductIcon name={p.icon} className="h-4 w-4 text-brand-600" />{p.name}</span> <span className="text-xs text-stone-400">/ {p.unit}</span></td>
                <td className="px-5 py-3 text-stone-600">{p.category_name}</td>
                <td className="px-5 py-3 text-right font-medium">{formatPrice(p.price)}</td>
                <td className={`px-5 py-3 text-right font-medium ${p.stock <= 10 ? "text-rose-600" : ""}`}>{p.stock}</td>
                <td className="px-5 py-3">{p.is_active ? <span className="badge bg-emerald-100 text-emerald-800">Đang bán</span> : <span className="badge bg-stone-200 text-stone-600">Ẩn</span>}{p.is_featured ? <Star className="ml-1.5 inline h-4 w-4 fill-amber-400 text-amber-400" aria-label="Nổi bật" /> : null}</td>
                <td className="px-5 py-3 text-right"><Link href={`/admin/san-pham/${p.id}`} className="text-brand-700 hover:underline">Sửa</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
