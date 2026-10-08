"use server";

import { lookupOrder } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

export type LookupResult = Awaited<ReturnType<typeof doLookup>>;

function doLookup(code: string, phone: string) {
  const r = lookupOrder(code, phone);
  if (!r) return null;
  // Chỉ trả về thông tin cần thiết, che bớt dữ liệu cá nhân
  const { order, items, events, reorder } = r;
  return {
    code: order.code, status: order.status, created_at: order.created_at, customer_name: order.customer_name,
    address: `${order.address.slice(0, 6)}***, ${order.district}`, delivery_slot: order.delivery_slot,
    payment_method: order.payment_method, subtotal: order.subtotal, shipping_fee: order.shipping_fee, total: order.total,
    items: items.map(({ name, unit, price, quantity, line_total }) => ({ name, unit, price, quantity, line_total })),
    events: events.map(({ status, created_at }) => ({ status, created_at })),
    reorder: reorder.map((p) => ({
      id: p.product_id, slug: p.slug, name: p.name, price: p.price, unit: p.unit, icon: p.icon, image: p.image,
      category: p.category_slug, maxQty: p.stock, qty: Math.min(p.quantity, p.stock),
    })).filter((p) => p.qty > 0),
  };
}

export async function lookupAction(_: unknown, fd: FormData): Promise<{ error?: string; result?: NonNullable<LookupResult> }> {
  const ip = await clientIp();
  if (!rateLimit(`lookup:${ip}`, 15, 10 * 60 * 1000).ok) return { error: "Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau." };
  const code = String(fd.get("code") ?? "").trim().toUpperCase().slice(0, 12);
  const phone = String(fd.get("phone") ?? "").replace(/[\s.-]/g, "").replace(/^\+84/, "0").slice(0, 12);
  if (!/^DC[0-9A-Z]{8}$/.test(code) || !/^0\d{9}$/.test(phone)) return { error: "Mã đơn hoặc số điện thoại không đúng định dạng." };
  const result = doLookup(code, phone);
  return result ? { result } : { error: "Không tìm thấy đơn hàng khớp với thông tin đã nhập." };
}
