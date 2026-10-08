"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit, requireAdmin } from "@/lib/auth";
import { saveProduct, slugTaken } from "@/lib/admin-products";
import { getCategories } from "@/lib/catalog";
import { slugify } from "@/lib/format";
import { isProductIcon } from "@/components/icons";

const money = z.coerce.number().int("Phải là số nguyên").min(0).max(100_000_000);

const schema = z.object({
  name: z.string().trim().min(2, "Tên quá ngắn").max(120),
  slug: z.string().trim().max(80).optional(),
  category_id: z.coerce.number().int().positive("Chọn danh mục"),
  price: money,
  compare_price: z.union([z.literal(""), money]).transform((v) => (v === "" || v === 0 ? null : v)),
  unit: z.string().trim().min(1, "Nhập đơn vị").max(30),
  stock: z.coerce.number().int().min(0).max(100_000),
  icon: z.string().refine(isProductIcon, "Biểu tượng không hợp lệ"),
  image: z.union([z.literal(""), z.string().trim().url().max(500).refine((u) => u.startsWith("https://"), "Ảnh phải dùng https://")]).transform((v) => v || null),
  origin: z.string().trim().max(60),
  short_desc: z.string().trim().max(200),
  description: z.string().trim().max(5000),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

export async function saveProductAction(_: unknown, fd: FormData): Promise<{ error?: string; fieldErrors?: Record<string, string> }> {
  const admin = await requireAdmin();
  const idRaw = String(fd.get("id") ?? "");
  const id = idRaw ? z.coerce.number().int().positive().parse(idRaw) : null;
  const raw = Object.fromEntries(
    ["name", "slug", "category_id", "price", "compare_price", "unit", "stock", "icon", "image", "origin", "short_desc", "description"].map((k) => [k, String(fd.get(k) ?? "")]),
  );
  const parsed = schema.safeParse({ ...raw, is_active: fd.get("is_active") === "on", is_featured: fd.get("is_featured") === "on" });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: "Vui lòng kiểm tra lại các trường.", fieldErrors };
  }
  const d = parsed.data;
  if (!getCategories().some((c) => c.id === d.category_id)) return { error: "Danh mục không tồn tại." };
  if (d.compare_price !== null && d.compare_price <= d.price) return { fieldErrors: { compare_price: "Giá gốc phải lớn hơn giá bán" } };
  const slug = slugify(d.slug || d.name);
  if (!slug) return { fieldErrors: { slug: "Slug không hợp lệ" } };
  if (slugTaken(slug, id ?? undefined)) return { fieldErrors: { slug: "Slug đã được dùng" } };

  const savedId = saveProduct(id, { ...d, slug });
  audit(admin.id, id ? "product_update" : "product_create", `#${savedId} ${d.name}`);
  revalidatePath("/", "layout");
  redirect(`/admin/san-pham?saved=${savedId}`);
}
