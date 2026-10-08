import "server-only";
import { getDb } from "./db";

export type Category = { id: number; slug: string; name: string; icon: string; description: string; product_count?: number; cover?: string | null };
export type Product = {
  id: number; slug: string; name: string; category_id: number; category_slug: string; category_name: string;
  price: number; compare_price: number | null; unit: string; stock: number; icon: string; image: string | null;
  origin: string; short_desc: string; description: string; is_active: number; is_featured: number; updated_at: string;
};

const PRODUCT_SELECT = `
  SELECT p.*, c.slug AS category_slug, c.name AS category_name
  FROM products p JOIN categories c ON c.id = p.category_id`;

export const SORTS = {
  "noi-bat": { label: "Nổi bật", sql: "p.is_featured DESC, p.id ASC" },
  "gia-tang": { label: "Giá thấp → cao", sql: "p.price ASC" },
  "gia-giam": { label: "Giá cao → thấp", sql: "p.price DESC" },
  "moi-nhat": { label: "Mới nhất", sql: "p.created_at DESC, p.id DESC" },
} as const;
export type SortKey = keyof typeof SORTS;
const sortSql = (s?: string) => SORTS[(s as SortKey) in SORTS ? (s as SortKey) : "noi-bat"].sql;

export function getCategories(): Category[] {
  return getDb()
    .prepare(
      `SELECT c.*,
         (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) AS product_count,
         (SELECT p.image FROM products p WHERE p.category_id = c.id AND p.is_active = 1 AND p.image IS NOT NULL
            ORDER BY p.price DESC, p.id LIMIT 1) AS cover
       FROM categories c ORDER BY c.sort_order, c.id`,
    )
    .all() as Category[];
}

export function getCategory(slug: string): Category | undefined {
  return getDb().prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as Category | undefined;
}

export function getFeaturedProducts(limit = 8): Product[] {
  return getDb().prepare(`${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.is_featured = 1 ORDER BY p.id LIMIT ?`).all(limit) as Product[];
}

export function getDeals(limit = 4): Product[] {
  return getDb()
    .prepare(`${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.compare_price > p.price
              ORDER BY (p.compare_price - p.price) * 1.0 / p.compare_price DESC LIMIT ?`)
    .all(limit) as Product[];
}

export function getProductsByCategory(categoryId: number, sort?: string): Product[] {
  return getDb().prepare(`${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.category_id = ? ORDER BY ${sortSql(sort)}`).all(categoryId) as Product[];
}

export function getProduct(slug: string): Product | undefined {
  return getDb().prepare(`${PRODUCT_SELECT} WHERE p.slug = ? AND p.is_active = 1`).get(slug) as Product | undefined;
}

export function getRelatedProducts(p: Product, limit = 4): Product[] {
  return getDb()
    .prepare(`${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.category_id = ? AND p.id <> ? ORDER BY p.is_featured DESC, RANDOM() LIMIT ?`)
    .all(p.category_id, p.id, limit) as Product[];
}

/** Tìm kiếm không phân biệt dấu tiếng Việt. */
export function searchProducts(q: string, sort?: string): Product[] {
  const norm = normalize(q);
  if (!norm) return [];
  const all = getDb().prepare(`${PRODUCT_SELECT} WHERE p.is_active = 1 ORDER BY ${sortSql(sort)}`).all() as Product[];
  const terms = norm.split(/\s+/);
  return all.filter((p) => {
    const hay = normalize(`${p.name} ${p.category_name} ${p.origin} ${p.short_desc}`);
    return terms.every((t) => hay.includes(t));
  });
}

export function getSitemapEntries() {
  const db = getDb();
  return {
    categories: db.prepare("SELECT slug FROM categories").all() as { slug: string }[],
    products: db.prepare("SELECT slug, updated_at FROM products WHERE is_active = 1").all() as { slug: string; updated_at: string }[],
  };
}

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}
