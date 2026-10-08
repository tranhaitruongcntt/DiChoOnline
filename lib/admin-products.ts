import "server-only";
import { getDb } from "./db";
import type { Product } from "./catalog";

export type ProductInput = {
  name: string; slug: string; category_id: number; price: number; compare_price: number | null; unit: string; stock: number;
  icon: string; image: string | null; origin: string; short_desc: string; description: string; is_active: boolean; is_featured: boolean;
};

export function listAllProducts(q?: string): Product[] {
  const like = q ? `%${q.replace(/[%_]/g, "")}%` : "%";
  return getDb()
    .prepare(`SELECT p.*, c.slug AS category_slug, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id
              WHERE p.name LIKE ? ORDER BY c.sort_order, p.name`)
    .all(like) as Product[];
}

export function getProductById(id: number): Product | undefined {
  return getDb()
    .prepare(`SELECT p.*, c.slug AS category_slug, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`)
    .get(id) as Product | undefined;
}

export function slugTaken(slug: string, exceptId?: number) {
  return !!getDb().prepare("SELECT 1 FROM products WHERE slug = ? AND id <> ?").get(slug, exceptId ?? 0);
}

export function saveProduct(id: number | null, d: ProductInput): number {
  const db = getDb();
  const vals = [d.name, d.slug, d.category_id, d.price, d.compare_price, d.unit, d.stock, d.icon, d.image, d.origin, d.short_desc, d.description, d.is_active ? 1 : 0, d.is_featured ? 1 : 0];
  if (id) {
    db.prepare(
      `UPDATE products SET name=?, slug=?, category_id=?, price=?, compare_price=?, unit=?, stock=?, icon=?, image=?, origin=?,
         short_desc=?, description=?, is_active=?, is_featured=?, updated_at=datetime('now') WHERE id=?`,
    ).run(...vals, id);
    return id;
  }
  const r = db.prepare(
    `INSERT INTO products (name, slug, category_id, price, compare_price, unit, stock, icon, image, origin, short_desc, description, is_active, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(...vals);
  return Number(r.lastInsertRowid);
}
