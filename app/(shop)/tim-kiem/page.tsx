import { SearchX } from "lucide-react";
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
          <div className="card p-12 text-center">
            <SearchX className="mx-auto h-12 w-12 text-stone-300" strokeWidth={1.5} aria-hidden />
            <p className="mt-3 text-stone-600">{q ? "Không tìm thấy sản phẩm phù hợp. Hãy thử từ khoá khác, ví dụ “rau”, “tôm”, “xoài”." : "Nhập từ khoá vào ô tìm kiếm phía trên."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
