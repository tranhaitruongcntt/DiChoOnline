import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { seedCategories, seedProducts } from "./seed-data";
import { hashPassword } from "./password";

declare global {
  // eslint-disable-next-line no-var
  var __dichoDb: DatabaseSync | undefined;
}

/** Đường dẫn file CSDL. Trên Vercel chỉ /tmp được phép ghi (dữ liệu tạm, mất khi máy chủ khởi động lại). */
export const dbPath = () => process.env.DATABASE_PATH || (process.env.VERCEL ? "/tmp/dicho.db" : "./data/dicho.db");

function open(): DatabaseSync {
  const file = path.resolve(dbPath());
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
  db.exec(fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"));
  seed(db);
  attachDemoImages(db);
  bootstrapAdmin(db);
  return db;
}

function seed(db: DatabaseSync) {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM categories").get() as { n: number };
  if (n > 0) return;
  tx(db, () => {
    const insCat = db.prepare("INSERT INTO categories (slug, name, icon, description, sort_order) VALUES (?, ?, ?, ?, ?)");
    seedCategories.forEach((c, i) => insCat.run(c.slug, c.name, c.icon, c.description, i));
    const catId = db.prepare("SELECT id FROM categories WHERE slug = ?");
    const insProd = db.prepare(
      `INSERT INTO products (slug, name, category_id, price, compare_price, unit, stock, icon, origin, short_desc, description, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const p of seedProducts) {
      const { id } = catId.get(p.category) as { id: number };
      insProd.run(p.slug, p.name, id, p.price, p.compare ?? null, p.unit, p.stock, p.icon, p.origin, p.short, p.desc, p.featured ? 1 : 0);
    }
  });
}

/** Gắn ảnh demo (public/images/products/<slug>.webp) cho sản phẩm mẫu chưa có ảnh – chỉ chạy một lần. */
function attachDemoImages(db: DatabaseSync) {
  const KEY = "demo_images_v1";
  if (db.prepare("SELECT 1 FROM settings WHERE key = ?").get(KEY)) return;
  const dir = path.join(process.cwd(), "public", "images", "products");
  const upd = db.prepare("UPDATE products SET image = ? WHERE slug = ? AND image IS NULL");
  tx(db, () => {
    for (const p of seedProducts) {
      if (fs.existsSync(path.join(dir, `${p.slug}.webp`))) upd.run(`/images/products/${p.slug}.webp`, p.slug);
    }
    db.prepare("INSERT INTO settings (key, value) VALUES (?, datetime('now'))").run(KEY);
  });
}

/** Tạo admin đầu tiên từ biến môi trường nếu DB chưa có tài khoản quản trị nào. */
function bootstrapAdmin(db: DatabaseSync) {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM admins").get() as { n: number };
  if (n > 0) return;
  if (password.length < 12) {
    console.warn("[dicho] ADMIN_PASSWORD phải có ít nhất 12 ký tự – bỏ qua việc tạo admin.");
    return;
  }
  db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, hashPassword(password));
  console.info(`[dicho] Đã tạo tài khoản quản trị "${username}".`);
}

export function getDb(): DatabaseSync {
  if (!globalThis.__dichoDb) globalThis.__dichoDb = open();
  return globalThis.__dichoDb;
}

/** Chạy hàm trong transaction (BEGIN IMMEDIATE để tránh race khi trừ tồn kho). */
export function tx<T>(db: DatabaseSync, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
