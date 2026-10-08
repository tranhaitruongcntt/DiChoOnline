import { RefreshCw, ShieldCheck, Snowflake, Truck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ProductVisual from "@/components/ProductVisual";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductGrid, toCartProduct } from "@/components/ProductCard";
import { getProduct, getRelatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return { title: "Không tìm thấy sản phẩm", robots: { index: false } };
  const title = `${p.name} ${p.origin ? `(${p.origin})` : ""} – ${formatPrice(p.price)}/${p.unit}`;
  const description = `${p.short_desc} Mua ${p.name.toLowerCase()} tươi ngon tại ${site.name}, giao nhanh 2 giờ.`.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/san-pham/${p.slug}` },
    openGraph: { type: "website", title, description, url: `/san-pham/${p.slug}`, images: p.image ? [{ url: p.image }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const related = getRelatedProducts(p);
  const discount = p.compare_price && p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  const url = absoluteUrl(`/san-pham/${p.slug}`);

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ name: p.category_name, href: `/danh-muc/${p.category_slug}` }, { name: p.name, href: `/san-pham/${p.slug}` }]} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="card group p-4">
          <ProductVisual icon={p.icon} image={p.image} name={p.name} category={p.category_slug} size="lg" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-700">Xuất xứ: {p.origin}</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight text-stone-900">{p.name}</h1>
          <p className="mt-3 text-lg text-stone-600">{p.short_desc}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-brand-700">{formatPrice(p.price)}</span>
            <span className="pb-1 text-stone-500">/ {p.unit}</span>
            {discount > 0 && (
              <>
                <s className="pb-1 text-stone-400">{formatPrice(p.compare_price!)}</s>
                <span className="badge mb-1.5 bg-rose-500 text-white">-{discount}%</span>
              </>
            )}
          </div>
          <p className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${p.stock > 0 ? "text-brand-700" : "text-rose-600"}`}>
            <span className={`h-2 w-2 rounded-full ${p.stock > 0 ? "bg-brand-500" : "bg-rose-500"}`} aria-hidden />
            {p.stock > 0 ? `Còn hàng${p.stock <= 10 ? ` – chỉ còn ${p.stock}` : ""}` : "Tạm hết hàng"}
          </p>

          <div className="mt-6 max-w-md"><AddToCartButton product={toCartProduct(p)} withQty /></div>

          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            {([[Truck, "Giao nhanh trong 2 giờ"], [ShieldCheck, "Nguồn gốc rõ ràng"], [Snowflake, "Đóng gói giữ lạnh"], [RefreshCw, "Đổi trả trong 24h"]] as const).map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 ring-1 ring-stone-200"><Icon className="h-4 w-4 text-brand-600" aria-hidden />{t}</li>
            ))}
          </ul>

          <section className="mt-8" aria-labelledby="mota">
            <h2 id="mota" className="text-lg font-bold text-stone-800">Mô tả sản phẩm</h2>
            <div className="prose-vi mt-2">
              {p.description.split(/\n+/).map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="lq">
          <h2 id="lq" className="text-2xl font-bold text-stone-800">Sản phẩm liên quan</h2>
          <div className="mt-5"><ProductGrid products={related} /></div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description || p.short_desc,
          sku: `DC-${p.id}`,
          category: p.category_name,
          url,
          ...(p.image ? { image: [p.image] } : {}),
          brand: { "@type": "Brand", name: site.name },
          countryOfOrigin: p.origin,
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "VND",
            price: p.price,
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": absoluteUrl("/#store") },
          },
        }}
      />
    </div>
  );
}
