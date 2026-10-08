"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createOrder, OrderError } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/request";
import { DELIVERY_SLOTS, DISTRICTS } from "@/lib/format";

export type CheckoutState = { error?: string; fieldErrors?: Record<string, string> };

const text = (min: number, max: number, msg: string) =>
  z.string().trim().min(min, msg).max(max, `Tối đa ${max} ký tự`).transform((s) => s.replace(/[\u0000-\u001f\u007f]/g, " "));

const schema = z.object({
  customer_name: text(2, 80, "Vui lòng nhập họ tên"),
  phone: z.string().trim().transform((s) => s.replace(/[\s.-]/g, "").replace(/^\+84/, "0"))
    .pipe(z.string().regex(/^0(3|5|7|8|9)\d{8}$/, "Số điện thoại không hợp lệ")),
  email: z.union([z.literal(""), z.string().trim().email("Email không hợp lệ").max(120)]).transform((s) => s || null),
  address: text(5, 200, "Vui lòng nhập địa chỉ giao hàng"),
  district: z.enum(DISTRICTS, { message: "Vui lòng chọn quận/huyện" }),
  delivery_slot: z.enum(DELIVERY_SLOTS, { message: "Vui lòng chọn khung giờ" }),
  note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự").default(""),
  payment_method: z.enum(["cod", "bank"], { message: "Chọn phương thức thanh toán" }),
  items: z.string().max(5000).transform((s, ctx) => {
    try { return JSON.parse(s); } catch { ctx.addIssue({ code: "custom", message: "Giỏ hàng không hợp lệ" }); return z.NEVER; }
  }).pipe(
    z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) }))
      .min(1, "Giỏ hàng đang trống").max(50, "Giỏ hàng quá nhiều sản phẩm")
      .refine((a) => new Set(a.map((i) => i.productId)).size === a.length, "Giỏ hàng bị trùng sản phẩm"),
  ),
});

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  // Honeypot chống bot: trường ẩn, người dùng thật không điền
  if (formData.get("website")) return { error: "Không thể xử lý yêu cầu." };

  const ip = await clientIp();
  const rl = rateLimit(`order:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return { error: `Bạn đặt hàng quá nhanh. Vui lòng thử lại sau ${Math.ceil(rl.retryAfterSec / 60)} phút.` };

  const raw = Object.fromEntries(["customer_name", "phone", "email", "address", "district", "delivery_slot", "note", "payment_method", "items"].map((k) => [k, String(formData.get(k) ?? "")]));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      fieldErrors[k] ??= issue.message;
    }
    return { error: fieldErrors.items ?? "Vui lòng kiểm tra lại thông tin.", fieldErrors };
  }

  let code: string;
  try {
    code = createOrder(parsed.data, hashIp(ip)).code;
  } catch (e) {
    if (e instanceof OrderError) return { error: e.message };
    console.error("[checkout]", e);
    return { error: "Có lỗi xảy ra, vui lòng thử lại." };
  }
  redirect(`/dat-hang-thanh-cong?ma=${code}`);
}
