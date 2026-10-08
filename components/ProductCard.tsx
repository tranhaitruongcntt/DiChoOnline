import Link from "next/link";
import ProductVisual from "./ProductVisual";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog";

export const toCartProduct = (p: Product) => ({
  id: p.id, slug: p.slug, name: p.name, price: p.price, unit: p.unit, icon: p.icon, category: p.category_slug, maxQty: p.stock,
});

export default function ProductCard({ p }: { p: Product }) {
  const discount = p.compare_price && p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  return (
    <article className="card group flex flex-col p-3 transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/san-pham/${p.slug}`} className="relative block">
        <ProductVisual icon={p.icon} image={p.image} name={p.name} category={p.category_slug} />
        {discount > 0 && <span className="badge absolute left-2 top-2 bg-rose-500 text-white">-{discount}%</span>}
        {p.stock > 0 && p.stock <= 10 && <span className="badge absolute right-2 top-2 bg-white/90 text-amber-700">Sắp hết</span>}
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-medium text-brand-700">{p.origin}</p>
        <h3 className="mt-0.5 line-clamp-2 min-h-10 text-sm font-semibold text-stone-800">
          <Link href={`/san-pham/${p.slug}`} className="hover:text-brand-700">{p.name}</Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-brand-700">{formatPrice(p.price)}</span>
          {discount > 0 && <s className="text-xs text-stone-400">{formatPrice(p.compare_price!)}</s>}
        </div>
        <p className="text-xs text-stone-500">/ {p.unit}</p>
        <div className="mt-3"><AddToCartButton product={toCartProduct(p)} /></div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
