import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import SortLinks from "@/components/SortLinks";
import { ProductGrid } from "@/components/ProductCard";
import { getCategory, getProductsByCategory } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sap_xep?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return { title: "Không tìm thấy danh mục", robots: { index: false } };
  const title = `${c.name} tươi sạch – Giao nhanh 2 giờ`;
  return {
    title,
    description: c.description,
    alternates: { canonical: `/danh-muc/${c.slug}` },
    openGraph: { title, description: c.description, url: `/danh-muc/${c.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sap_xep } = await searchParams;
  const c = getCategory(slug);
  if (!c) notFound();
  const products = getProductsByCategory(c.id, sap_xep);

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ name: c.name, href: `/danh-muc/${c.slug}` }]} />
      <header className="mt-4 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-brand-50 to-emerald-50 p-6 ring-1 ring-brand-100 sm:flex-row sm:items-center">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white text-5xl shadow-sm" aria-hidden>{c.icon}</span>
        <div>
          <h1 className="text-3xl font-extrabold text-brand-900">{c.name}</h1>
          <p className="mt-1 max-w-2xl text-stone-600">{c.description}</p>
        </div>
      </header>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500">{products.length} sản phẩm</p>
        <SortLinks basePath={`/danh-muc/${c.slug}`} current={sap_xep} />
      </div>
      <div className="mt-5">
        {products.length ? <ProductGrid products={products} /> : <p className="card p-10 text-center text-stone-500">Danh mục đang được cập nhật sản phẩm.</p>}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: c.name,
          itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/san-pham/${p.slug}`), name: p.name })),
        }}
      />
    </div>
  );
}
