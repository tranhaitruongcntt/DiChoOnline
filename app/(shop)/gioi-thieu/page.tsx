import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, Leaf, ShieldCheck, Snowflake, Sprout, Truck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `${site.name} – siêu thị thực phẩm tươi sạch trực tuyến tại TP. Hồ Chí Minh. Kết nối nông trại đạt chuẩn với bữa cơm gia đình Việt.`,
  alternates: { canonical: "/gioi-thieu" },
};

const STATS = [["50+", "Nông trại & cơ sở đánh bắt"], ["2 giờ", "Giao hàng nội thành"], ["24h", "Đổi trả nếu không tươi"], ["6:00–21:00", "Phục vụ mỗi ngày"]];
const VALUES = [
  { Icon: Sprout, t: "Tươi mỗi ngày", d: "Hàng được nhập mỗi sáng, không tồn kho qua đêm với rau và hải sản." },
  { Icon: ShieldCheck, t: "Nguồn gốc rõ ràng", d: "Ưu tiên nông trại đạt chuẩn VietGAP, thịt có giấy kiểm dịch." },
  { Icon: Snowflake, t: "Chuỗi lạnh", d: "Đóng gói giữ lạnh từ kho tới tận tay khách hàng." },
  { Icon: Truck, t: "Giao nhanh", d: "Đặt trước 18:00, nhận trong 2 giờ tại TP. Hồ Chí Minh." },
  { Icon: HandHeart, t: "Tận tâm", d: "Nhân viên chọn từng món như đi chợ cho chính gia đình mình." },
  { Icon: Leaf, t: "Giảm rác thải", d: "Hạn chế túi nilon, khuyến khích bao bì tái sử dụng." },
];

export default function AboutPage() {
  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ name: "Giới thiệu", href: "/gioi-thieu" }]} />
      <PageHero image="/images/banners/gioi-thieu.webp" eyebrow="Về chúng tôi" title="Đi chợ hộ bạn, như đi chợ cho nhà mình" desc="Đi Chợ Online ra đời để những gia đình bận rộn vẫn có bữa cơm tươi ngon, an toàn mỗi ngày." />

      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {STATS.map(([v, l], i) => (
          <li key={l} className="card animate-fade-up p-5 text-center" style={{ animationDelay: `${150 + i * 70}ms` }}>
            <p className="font-display text-3xl font-bold text-brand-700">{v}</p>
            <p className="mt-1 text-sm text-stone-500">{l}</p>
          </li>
        ))}
      </ul>

      <section className="mt-14 grid items-center gap-8 md:grid-cols-2" aria-labelledby="cau-chuyen">
        <div className="reveal relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image src="/images/banners/slide-giao-hang.webp" alt="Nhân viên giao thực phẩm tươi tới khách hàng" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="reveal">
          <h2 id="cau-chuyen" className="text-2xl font-bold text-stone-900 sm:text-3xl">Câu chuyện của chúng tôi</h2>
          <div className="prose-vi mt-4">
            <p>Chúng tôi bắt đầu từ một câu hỏi đơn giản: làm sao để người bận rộn ở thành phố vẫn mua được rau củ, thịt cá tươi như ngoài chợ sáng?</p>
            <p>Câu trả lời là làm việc trực tiếp với nông trại và cơ sở đánh bắt, rút ngắn khâu trung gian, rồi giao tận nhà trong vài giờ. Nhờ vậy, thực phẩm đến tay bạn tươi hơn, giá hợp lý hơn và minh bạch nguồn gốc.</p>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="gia-tri">
        <h2 id="gia-tri" className="reveal text-2xl font-bold text-stone-900 sm:text-3xl">Giá trị chúng tôi theo đuổi</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ Icon, t, d }) => (
            <li key={t} className="card reveal group p-6 transition-shadow hover:shadow-lg">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 text-lg font-bold text-stone-900">{t}</h3>
              <p className="mt-1 text-stone-600">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="reveal mt-14 flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-brand-700 to-emerald-600 p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Sẵn sàng đi chợ cùng chúng tôi?</h2>
        <p className="max-w-lg text-white/85">Hàng trăm sản phẩm tươi đang chờ bạn – giao nhanh trong 2 giờ.</p>
        <Link href="/danh-muc" className="btn bg-white px-6 py-3 text-base text-brand-800 hover:bg-brand-50">Bắt đầu mua sắm <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </div>
  );
}
