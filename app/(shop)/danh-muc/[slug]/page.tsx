import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductIcon } from "@/components/icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import SortLinks from "@/components/SortLinks";
import { ProductGrid } from "@/components/ProductCard";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";
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
  const categories = getCategories();
  const cover = categories.find((o) => o.id === c.id)?.cover;

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ name: c.name, href: `/danh-muc/${c.slug}` }]} />
      <header className="relative mt-4 animate-fade-up overflow-hidden rounded-3xl bg-brand-900 text-white">
        {cover && <Image src={cover} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/10" />
        <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-10">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur sm:h-20 sm:w-20" aria-hidden>
            <ProductIcon name={c.icon} className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.5} />
          </span>
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{c.name}</h1>
            <p className="mt-2 max-w-2xl text-white/80">{c.description}</p>
          </div>
        </div>
      </header>
      <nav aria-label="Danh mục khác" className="-mx-4 mt-5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {categories.map((o) => (
            <li key={o.id}>
              <Link href={`/danh-muc/${o.slug}`} aria-current={o.id === c.id ? "page" : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${o.id === c.id ? "bg-brand-600 text-white shadow-sm" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:text-brand-700 hover:ring-brand-300"}`}>
                <ProductIcon name={o.icon} className="h-4 w-4" />{o.name}
                <span className={`text-xs ${o.id === c.id ? "text-white/75" : "text-stone-400"}`}>{o.product_count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
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
