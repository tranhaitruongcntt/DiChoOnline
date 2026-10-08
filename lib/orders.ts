import "server-only";
import { randomBytes } from "node:crypto";
import { getDb, tx } from "./db";
import { site } from "./site";
import type { OrderStatus } from "./format";

export type OrderInput = {
  customer_name: string; phone: string; email: string | null; address: string; district: string;
  delivery_slot: string; note: string; payment_method: "cod" | "bank";
  items: { productId: number; quantity: number }[];
};

export type Order = {
  id: number; code: string; customer_name: string; phone: string; email: string | null; address: string;
  district: string; delivery_slot: string; note: string; payment_method: "cod" | "bank"; subtotal: number;
  shipping_fee: number; total: number; status: OrderStatus; admin_note: string; created_at: string; updated_at: string;
};
export type OrderItem = { id: number; product_id: number; name: string; unit: string; price: number; quantity: number; line_total: number };
export type ReorderItem = { product_id: number; quantity: number; slug: string; name: string; unit: string; price: number; stock: number; icon: string; image: string | null; category_slug: string };

/** Thông tin hiện tại của các sản phẩm trong đơn cũ (bỏ qua sản phẩm đã ngừng bán) – dùng cho "Mua lại". */
export function getReorderItems(orderId: number): ReorderItem[] {
  return (getDb()
    .prepare(
      `SELECT oi.product_id, oi.quantity, p.slug, p.name, p.unit, p.price, p.stock, p.icon, p.image, c.slug AS category_slug
       FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN categories c ON c.id = p.category_id
       WHERE oi.order_id = ? AND p.is_active = 1 ORDER BY oi.id`,
    )
    .all(orderId) as ReorderItem[]).map((r) => ({ ...r }));
}
export type OrderEvent = { id: number; status: string; note: string; actor: string; created_at: string };

export class OrderError extends Error {}

// Bảng chữ không gây nhầm lẫn (bỏ 0/O, 1/I/L)
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function newOrderCode() {
  const bytes = randomBytes(8);
  let s = "";
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length];
  return `DC${s}`;
}

export const shippingFeeFor = (subtotal: number) => (subtotal >= site.freeShipThreshold ? 0 : site.shippingFee);

/** Tạo đơn: giá luôn lấy từ DB (không tin giá từ trình duyệt), kiểm tra & trừ tồn kho trong 1 transaction. */
export function createOrder(input: OrderInput, ipHash: string): { code: string } {
  const db = getDb();
  return tx(db, () => {
    const getProduct = db.prepare("SELECT id, name, unit, price, stock FROM products WHERE id = ? AND is_active = 1");
    const lines = input.items.map(({ productId, quantity }) => {
      const p = getProduct.get(productId) as { id: number; name: string; unit: string; price: number; stock: number } | undefined;
      if (!p) throw new OrderError("Một số sản phẩm không còn kinh doanh. Vui lòng cập nhật giỏ hàng.");
      if (p.stock < quantity) throw new OrderError(`"${p.name}" chỉ còn ${p.stock} sản phẩm.`);
      return { ...p, quantity, line_total: p.price * quantity };
    });
    const subtotal = lines.reduce((s, l) => s + l.line_total, 0);
    const shipping = shippingFeeFor(subtotal);
    const code = newOrderCode();

    const { lastInsertRowid } = db
      .prepare(
        `INSERT INTO orders (code, customer_name, phone, email, address, district, delivery_slot, note, payment_method,
                             subtotal, shipping_fee, total, ip_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(code, input.customer_name, input.phone, input.email, input.address, input.district, input.delivery_slot,
        input.note, input.payment_method, subtotal, shipping, subtotal + shipping, ipHash);
    const orderId = Number(lastInsertRowid);

    const insItem = db.prepare("INSERT INTO order_items (order_id, product_id, name, unit, price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)");
    const decStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
    for (const l of lines) {
      insItem.run(orderId, l.id, l.name, l.unit, l.price, l.quantity, l.line_total);
      if (decStock.run(l.quantity, l.id, l.quantity).changes !== 1) throw new OrderError(`"${l.name}" vừa hết hàng.`);
    }
    db.prepare("INSERT INTO order_events (order_id, status, note, actor) VALUES (?, 'pending', 'Khách đặt hàng', 'customer')").run(orderId);
    return { code };
  });
}

/** Khách tra cứu: bắt buộc khớp cả mã đơn và số điện thoại. */
export function lookupOrder(code: string, phone: string) {
  const db = getDb();
  const order = db.prepare("SELECT * FROM orders WHERE code = ? AND phone = ?").get(code, phone) as Order | undefined;
  if (!order) return null;
  return { order, items: getItems(order.id), events: getEvents(order.id), reorder: getReorderItems(order.id) };
}

const getItems = (orderId: number) =>
  getDb().prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id").all(orderId) as OrderItem[];
const getEvents = (orderId: number) =>
  getDb().prepare("SELECT * FROM order_events WHERE order_id = ? ORDER BY id").all(orderId) as OrderEvent[];

// ===== Quản trị =====

export function listOrders(opts: { status?: string; q?: string; page?: number; pageSize?: number }) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (opts.status) { where.push("status = ?"); params.push(opts.status); }
  if (opts.q) {
    where.push("(code LIKE ? OR phone LIKE ? OR customer_name LIKE ?)");
    const like = `%${opts.q.replace(/[%_]/g, "")}%`;
    params.push(like, like, like);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const pageSize = opts.pageSize ?? 20;
  const page = Math.max(1, opts.page ?? 1);
  const db = getDb();
  const { n } = db.prepare(`SELECT COUNT(*) AS n FROM orders ${w}`).get(...params) as { n: number };
  const rows = db
    .prepare(`SELECT * FROM orders ${w} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...params, pageSize, (page - 1) * pageSize) as Order[];
  return { rows, total: n, page, pageCount: Math.max(1, Math.ceil(n / pageSize)) };
}

export function getOrderForAdmin(id: number) {
  const order = getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
  if (!order) return null;
  return { order, items: getItems(id), events: getEvents(id) };
}

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipping", "cancelled"],
  shipping: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};
export const allowedNextStatuses = (s: OrderStatus) => TRANSITIONS[s];

export function updateOrderStatus(id: number, next: OrderStatus, note: string, actor: string) {
  const db = getDb();
  tx(db, () => {
    const order = db.prepare("SELECT status FROM orders WHERE id = ?").get(id) as { status: OrderStatus } | undefined;
    if (!order) throw new OrderError("Không tìm thấy đơn hàng.");
    if (!TRANSITIONS[order.status].includes(next)) throw new OrderError("Chuyển trạng thái không hợp lệ.");
    db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(next, id);
    db.prepare("INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)").run(id, next, note, actor);
    if (next === "cancelled") {
      // Hoàn lại tồn kho khi huỷ
      db.prepare(
        `UPDATE products SET stock = stock + (SELECT COALESCE(SUM(quantity),0) FROM order_items WHERE order_id = ? AND product_id = products.id)
         WHERE id IN (SELECT product_id FROM order_items WHERE order_id = ?)`,
      ).run(id, id);
    }
  });
}

export function updateAdminNote(id: number, note: string) {
  getDb().prepare("UPDATE orders SET admin_note = ?, updated_at = datetime('now') WHERE id = ?").run(note, id);
}

export function getDashboardStats() {
  const db = getDb();
  const today = db
    .prepare(`SELECT COUNT(*) AS orders, COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN total END),0) AS revenue
              FROM orders WHERE date(created_at, '+7 hours') = date('now', '+7 hours')`)
    .get() as { orders: number; revenue: number };
  const byStatus = db.prepare("SELECT status, COUNT(*) AS n FROM orders GROUP BY status").all() as { status: OrderStatus; n: number }[];
  const revenue30 = db
    .prepare(`SELECT COALESCE(SUM(total),0) AS v FROM orders WHERE status = 'completed' AND created_at >= datetime('now','-30 days')`)
    .get() as { v: number };
  const lowStock = db.prepare("SELECT id, name, stock, unit FROM products WHERE is_active = 1 AND stock <= 10 ORDER BY stock LIMIT 8").all() as { id: number; name: string; stock: number; unit: string }[];
  const daily = db
    .prepare(`SELECT date(created_at, '+7 hours') AS d, COUNT(*) AS n, COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN total END),0) AS v
              FROM orders WHERE created_at >= datetime('now','-7 days') GROUP BY d ORDER BY d`)
    .all() as { d: string; n: number; v: number }[];
  return { today, byStatus, revenue30: revenue30.v, lowStock, daily };
}
