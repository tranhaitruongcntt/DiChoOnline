"use client";

import { PRODUCT_ICONS, isProductIcon } from "@/components/icons";

import { useActionState } from "react";
import { saveProductAction } from "../actions";
import type { Product } from "@/lib/catalog";

export default function ProductForm({ product: p, categories }: { product: Product | null; categories: { id: number; name: string }[] }) {
  const [state, action, pending] = useActionState(saveProductAction, {});
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="card mt-6 grid max-w-3xl gap-4 p-6 sm:grid-cols-2">
      {state.error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">{state.error}</p>}
      {p && <input type="hidden" name="id" value={p.id} />}
      <F fe={fe} name="name" label="Tên sản phẩm *" span><input id="name" name="name" required maxLength={120} defaultValue={p?.name} className="input" /></F>
      <F fe={fe} name="slug" label="Slug (để trống sẽ tự tạo)"><input id="slug" name="slug" maxLength={80} defaultValue={p?.slug} className="input font-mono" /></F>
      <F fe={fe} name="category_id" label="Danh mục *">
        <select id="category_id" name="category_id" defaultValue={p?.category_id ?? ""} required className="input">
          <option value="" disabled>-- Chọn --</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </F>
      <F fe={fe} name="price" label="Giá bán (VNĐ) *"><input id="price" name="price" type="number" min={0} step={1000} required defaultValue={p?.price} className="input" /></F>
      <F fe={fe} name="compare_price" label="Giá gốc (để hiện giảm giá)"><input id="compare_price" name="compare_price" type="number" min={0} step={1000} defaultValue={p?.compare_price ?? ""} className="input" /></F>
      <F fe={fe} name="unit" label="Đơn vị *"><input id="unit" name="unit" required maxLength={30} defaultValue={p?.unit ?? "kg"} className="input" /></F>
      <F fe={fe} name="stock" label="Tồn kho *"><input id="stock" name="stock" type="number" min={0} required defaultValue={p?.stock ?? 0} className="input" /></F>
      <F fe={fe} name="icon" label="Biểu tượng (khi chưa có ảnh)">
        <select id="icon" name="icon" defaultValue={p && isProductIcon(p.icon) ? p.icon : "basket"} className="input">
          {Object.entries(PRODUCT_ICONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </F>
      <F fe={fe} name="origin" label="Xuất xứ"><input id="origin" name="origin" maxLength={60} defaultValue={p?.origin} className="input" /></F>
      <F fe={fe} name="image" label="URL ảnh (https://…, tuỳ chọn)" span><input id="image" name="image" type="url" maxLength={500} defaultValue={p?.image ?? ""} className="input" /></F>
      <F fe={fe} name="short_desc" label="Mô tả ngắn (hiển thị & SEO)" span><input id="short_desc" name="short_desc" maxLength={200} defaultValue={p?.short_desc} className="input" /></F>
      <F fe={fe} name="description" label="Mô tả chi tiết" span><textarea id="description" name="description" rows={5} maxLength={5000} defaultValue={p?.description} className="input" /></F>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={p ? !!p.is_active : true} className="accent-brand-600" /> Đang bán</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" defaultChecked={!!p?.is_featured} className="accent-brand-600" /> Sản phẩm nổi bật</label>
      <div className="sm:col-span-2"><button className="btn-primary" disabled={pending}>{pending ? "Đang lưu…" : "Lưu sản phẩm"}</button></div>
    </form>
  );
}

function F({ fe, name, label, children, span }: { fe: Record<string, string>; name: string; label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {fe[name] && <p className="mt-1 text-xs text-rose-600">{fe[name]}</p>}
    </div>
  );
}
