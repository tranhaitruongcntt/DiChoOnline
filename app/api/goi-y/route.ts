import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "@/lib/catalog";
import { rateLimit } from "@/lib/rate-limit";

// Gợi ý tìm kiếm cho ô search ở header (tối đa 6 sản phẩm)
export async function GET(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
  if (!rateLimit(`suggest:${ip}`, 120, 60_000).ok) return NextResponse.json({ items: [] }, { status: 429 });
  const q = (req.nextUrl.searchParams.get("q") || "").slice(0, 60).trim();
  if (q.length < 1) return NextResponse.json({ items: [] });
  const items = searchProducts(q).slice(0, 6).map((p) => ({
    slug: p.slug, name: p.name, price: p.price, compare_price: p.compare_price, unit: p.unit,
    image: p.image, icon: p.icon, category: p.category_name,
  }));
  return NextResponse.json({ items }, { headers: { "Cache-Control": "private, max-age=60" } });
}
