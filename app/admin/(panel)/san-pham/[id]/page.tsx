import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/admin-products";
import { getCategories } from "@/lib/catalog";
import ProductForm from "./ProductForm";

export const metadata: Metadata = { title: "Sửa sản phẩm" };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  let product = null;
  if (id !== "moi") {
    const n = Number.parseInt(id, 10);
    if (!Number.isSafeInteger(n) || n <= 0) notFound();
    // node:sqlite trả về object không có prototype → sao chép thành object thường trước khi truyền cho Client Component
    const row = getProductById(n);
    product = row ? { ...row } : null;
    if (!product) notFound();
  }
  const categories = getCategories().map(({ id, name }) => ({ id, name }));
  return (
    <>
      <Link href="/admin/san-pham" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-brand-700"><ArrowLeft className="h-4 w-4" aria-hidden />Danh sách sản phẩm</Link>
      <h1 className="mt-2 text-2xl font-bold">{product ? `Sửa: ${product.name}` : "Thêm sản phẩm"}</h1>
      <ProductForm product={product} categories={categories} />
    </>
  );
}
