import type { Metadata } from "next";
import { ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ & Câu hỏi thường gặp",
  description: `Liên hệ ${site.name}: hotline ${site.phone}, email ${site.email}. Giải đáp câu hỏi về giao hàng, thanh toán, đổi trả.`,
  alternates: { canonical: "/lien-he" },
};

const FAQ = [
  ["Bao lâu thì tôi nhận được hàng?", "Với đơn đặt trước 18:00, chúng tôi giao trong vòng 2 giờ tại TP. Hồ Chí Minh. Bạn cũng có thể chọn khung giờ nhận hàng khi đặt."],
  ["Phí giao hàng là bao nhiêu?", "Miễn phí giao hàng cho đơn từ 300.000đ. Đơn dưới mức này phí giao là 20.000đ."],
  ["Tôi có cần tạo tài khoản không?", "Không cần. Bạn chỉ cần nhập họ tên, số điện thoại và địa chỉ. Mã đơn hàng dùng để tra cứu sẽ hiển thị sau khi đặt."],
  ["Có những hình thức thanh toán nào?", "Thanh toán khi nhận hàng (COD) hoặc chuyển khoản ngân hàng. Bạn được kiểm tra hàng trước khi thanh toán."],
  ["Nếu sản phẩm không tươi thì sao?", "Chúng tôi đổi trả hoặc hoàn tiền trong vòng 24 giờ nếu sản phẩm không đạt chất lượng. Hãy chụp ảnh và gọi hotline để được hỗ trợ."],
  ["Làm sao để theo dõi đơn hàng?", "Vào mục “Tra cứu đơn hàng”, nhập mã đơn và số điện thoại đã đặt để xem trạng thái."],
];

export default function ContactPage() {
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  const cards = [
    { Icon: Phone, t: "Hotline", v: site.phone, href: tel },
    { Icon: Mail, t: "Email", v: site.email, href: `mailto:${site.email}` },
    { Icon: MapPin, t: "Địa chỉ", v: site.address },
    { Icon: Clock, t: "Giờ mở cửa", v: "6:00 – 21:00, tất cả các ngày" },
  ];
  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ name: "Liên hệ", href: "/lien-he" }]} />
      <PageHero image="/images/banners/slide-rau-cu.webp" eyebrow="Hỗ trợ khách hàng" title="Chúng tôi luôn sẵn sàng lắng nghe" desc="Gọi hotline hoặc gửi email – đội ngũ chăm sóc khách hàng phản hồi nhanh trong giờ mở cửa." />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ Icon, t, v, href }, i) => {
          const body = (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:scale-110"><Icon className="h-6 w-6" /></span>
              <span className="mt-4 block text-sm text-stone-500">{t}</span>
              <span className="mt-0.5 block font-semibold text-stone-900">{v}</span>
            </>
          );
          return (
            <li key={t} className="animate-fade-up" style={{ animationDelay: `${150 + i * 70}ms` }}>
              {href ? <a href={href} className="card group block h-full p-6 transition-shadow hover:shadow-lg">{body}</a> : <div className="card group h-full p-6">{body}</div>}
            </li>
          );
        })}
      </ul>

      <section className="mx-auto mt-14 max-w-3xl" aria-labelledby="faq">
        <h2 id="faq" className="reveal text-center text-2xl font-bold text-stone-900 sm:text-3xl">Câu hỏi thường gặp</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card reveal group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-stone-900 transition-colors hover:text-brand-700">
                {q}
                <ChevronDown className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="animate-fade-in px-5 pb-5 text-stone-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      }} />
    </div>
  );
}
