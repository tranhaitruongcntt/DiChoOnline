import type { Metadata } from "next";
import { Clock } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Countdown from "@/components/Countdown";
import PageHero from "@/components/PageHero";
import { ProductGrid } from "@/components/ProductCard";
import { getDeals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Khuyến mãi hôm nay – Thực phẩm tươi giá tốt",
  description: "Tổng hợp ưu đãi thực phẩm tươi sạch hôm nay: rau củ, trái cây, hải sản, gạo giảm giá. Số lượng có hạn, giao nhanh 2 giờ.",
  alternates: { canonical: "/khuyen-mai" },
};

export default function DealsPage() {
  const deals = getDeals(100);
  const max = Math.max(0, ...deals.map((d) => Math.round((1 - d.price / (d.compare_price ?? d.price)) * 100)));
  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ name: "Khuyến mãi", href: "/khuyen-mai" }]} />
      <PageHero image="/images/banners/menu-promo.webp" eyebrow="Flash Sale mỗi ngày" title={`Giảm đến ${max}% hôm nay`} desc="Giá tốt cho thực phẩm tươi – ưu đãi làm mới mỗi ngày, số lượng có hạn.">
        <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3 text-stone-800">
          <span className="flex items-center gap-1.5 text-sm font-medium"><Clock className="h-4 w-4 text-rose-500" /> Kết thúc sau</span>
          <Countdown />
        </div>
      </PageHero>
      <p className="mt-8 text-sm text-stone-500">{deals.length} sản phẩm đang giảm giá</p>
      <div className="mt-4">
        {deals.length ? <ProductGrid products={deals} /> : <p className="card p-10 text-center text-stone-500">Hiện chưa có chương trình khuyến mãi. Quay lại sau nhé!</p>}
      </div>
    </div>
  );
}
