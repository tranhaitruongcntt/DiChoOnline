import { SearchX } from "lucide-react";
import Link from "next/link";

const POPULAR = ["Rau", "Trái cây", "Tôm", "Cá hồi", "Thịt bò", "Trứng", "Gạo"];
import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductCard";
import SortLinks from "@/components/SortLinks";
import { searchProducts } from "@/lib/catalog";

type Props = { searchParams: Promise<{ q?: string; sap_xep?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = ((await searchParams).q || "").slice(0, 80);
  // Trang kết quả tìm kiếm không nên được index (tránh nội dung mỏng/trùng lặp)
  return { title: q ? `Tìm kiếm “${q}”` : "Tìm kiếm", robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q: raw = "", sap_xep } = await searchParams;
  const q = String(raw).slice(0, 80).trim();
  const results = q ? searchProducts(q, sap_xep) : [];
  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-bold text-stone-800">{q ? <>Kết quả cho “{q}”</> : "Tìm kiếm sản phẩm"}</h1>
      {q && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-500">{results.length} sản phẩm</p>
          <SortLinks basePath="/tim-kiem" current={sap_xep} extra={{ q }} />
        </div>
      )}
      <div className="mt-5">
        {results.length ? (
          <ProductGrid products={results} />
        ) : (
          <div className="card animate-fade-up p-8 text-center sm:p-12">
            <SearchX className="mx-auto h-12 w-12 text-stone-300" strokeWidth={1.5} aria-hidden />
            <p className="mt-3 text-stone-600">{q ? "Không tìm thấy sản phẩm phù hợp. Thử một từ khoá khác nhé." : "Bạn muốn mua gì hôm nay?"}</p>
            <form action="/tim-kiem" method="get" role="search" className="mx-auto mt-5 flex max-w-md gap-2">
              <label htmlFor="q2" className="sr-only">Từ khoá</label>
              <input id="q2" name="q" type="search" defaultValue={q} maxLength={80} autoFocus={!q} placeholder="VD: rau muống, tôm, xoài…" className="input rounded-full" />
              <button className="btn-primary rounded-full px-5">Tìm</button>
            </form>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {POPULAR.map((k) => (
                <Link key={k} href={`/tim-kiem?q=${encodeURIComponent(k)}`} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-brand-50 hover:text-brand-700">{k}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
