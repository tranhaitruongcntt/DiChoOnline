import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm",
  description: "Tất cả danh mục thực phẩm tươi sạch: rau củ, trái cây, thịt tươi, hải sản, trứng sữa, đồ khô và gia vị.",
  alternates: { canonical: "/danh-muc" },
};

export default function CategoriesPage() {
  const categories = getCategories();
  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ name: "Danh mục", href: "/danh-muc" }]} />
      <h1 className="mt-4 animate-fade-up text-3xl font-bold text-stone-900 sm:text-4xl">Danh mục sản phẩm</h1>
      <p className="mt-2 animate-fade-up text-stone-600 [animation-delay:80ms]">Chọn nhóm thực phẩm bạn cần – tất cả đều tươi mới mỗi ngày.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {categories.map((c, i) => (
          <li key={c.id} className="animate-fade-up" style={{ animationDelay: `${120 + i * 60}ms` }}>
            <CategoryCard c={c} sizes="(min-width: 640px) 33vw, 50vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
